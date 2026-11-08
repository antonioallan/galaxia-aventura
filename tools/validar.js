#!/usr/bin/env node
/* Validador de conteúdo do jogo. Uso: node tools/validar.js
   Carrega os scripts do jogo num sandbox (sem navegador) e confere o grafo de cenas,
   itens, amizades, mapas e a lista de arquivos do modo offline. Sai com código 1 se houver erros. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const RAIZ = path.join(__dirname, '..', 'aventuras');

const erros = [], avisos = [];
const erro = m => erros.push(m), aviso = m => avisos.push(m);

/* ---------- 1. scripts na ordem em que o index.html os carrega ---------- */
const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const noop = () => {};
const el = new Proxy(function () {}, { get: () => el, apply: () => el, set: () => true });
const ctx = vm.createContext({
  console, setTimeout, clearTimeout, Uint32Array,
  window: { addEventListener: noop, scrollTo: noop },
  document: { getElementById: () => el, addEventListener: noop },
  localStorage: { getItem: () => null, setItem: noop },
  crypto: { getRandomValues: a => { a[0] = 1; return a; } },
  navigator: {}, location: { protocol: 'file:', hostname: '' },
  speechSynthesis: { cancel: noop, speak: noop }, SpeechSynthesisUtterance: function () {}
});
let fontes = '';
for (const s of scripts) {
  const arq = path.join(RAIZ, s);
  if (!fs.existsSync(arq)) { erro(`index.html referencia ${s}, que não existe`); continue; }
  const src = fs.readFileSync(arq, 'utf8'); fontes += src + '\n';
  try { vm.runInContext(src, ctx, { filename: s }); }
  catch (e) { erro(`${s}: falhou ao carregar (${e.message})`); }
}
if (erros.length) fim();
const get = expr => vm.runInContext(expr, ctx);
const SC = get('SC'), ITEMS = get('ITEMS'), FRIEND = get('FRIEND'), FAILS = get('FAILS'), WORLDS = get('WORLDS');

/* ---------- 2. grafo de cenas ---------- */
function saidas(id) {
  const s = SC[id], alvos = [];
  /* alvo calculado por função (ex.: ()=>S.f.concha?'a':'b'): considera os ids de cena citados no texto da função */
  const add = (t, onde) => {
    if (typeof t === 'string') alvos.push([t, onde]);
    else if (typeof t === 'function') {
      const ids = [...String(t).matchAll(/'(\w+)'/g)].map(m => m[1]).filter(x => SC[x]);
      if (ids.length) ids.forEach(x => alvos.push([x, onde + ' (função)']));
      else alvos.push([null, onde]);
    }
  };
  if (s.choices) {
    if (typeof s.choices === 'function') alvos.push([null, 'choices']);
    else s.choices.forEach((c, i) => add(c[1], `escolha ${i + 1}`));
  }
  if (s.test) { add(s.test.next, 'test.next'); add(s.test.ok && s.test.ok.go, 'test.ok.go'); add(s.test.fail && s.test.fail.go, 'test.fail.go'); }
  if (s.battle) add(s.battle.next, 'battle.next');
  return alvos;
}
const ehFim = id => !!SC[id].end;
const semSaida = id => { const s = SC[id]; return !s.end && !s.menu && !s.mundos && !s.rec && !(s.choices && s.choices.length) && !s.test && !s.battle; };

let dinamicos = 0;
for (const id of Object.keys(SC)) {
  const s = SC[id];
  if (semSaida(id)) erro(`cena "${id}" não é fim e não tem saída`);
  if (s.test && typeof s.test.need !== 'number') erro(`cena "${id}": teste sem "need" numérico`);
  if (s.battle && !(s.battle.hp > 0)) erro(`cena "${id}": batalha sem "hp" positivo`);
  if (s.battle && !(Array.isArray(s.battle.counter) && s.battle.counter.length)) erro(`cena "${id}": batalha sem frases de contra-ataque`);
  for (const [alvo, onde] of saidas(id)) {
    if (alvo === null) { dinamicos++; continue; }
    if (!SC[alvo]) erro(`cena "${id}" (${onde}) aponta para "${alvo}", que não existe`);
  }
  if (s.choices && Array.isArray(s.choices))
    s.choices.forEach((c, i) => { if (c[2] && !FRIEND[c[2]]) erro(`cena "${id}" escolha ${i + 1}: amigo "${c[2]}" não existe em FRIEND`); });
  for (const k of ['gain', 'lose']) if (s[k] && !FRIEND[s[k]]) erro(`cena "${id}": ${k}="${s[k]}" não existe em FRIEND`);
}
if (dinamicos) aviso(`${dinamicos} saída(s) calculada(s) por função sem nenhum id de cena reconhecível`);

/* ---------- 3. capítulos, alcançabilidade e mapas ---------- */
const visitadas = new Set();
function alcanca(inicio) {
  const vistas = new Set(), fila = [inicio];
  while (fila.length) {
    const id = fila.pop();
    if (vistas.has(id) || !SC[id]) continue;
    vistas.add(id); visitadas.add(id);
    for (const [t] of saidas(id)) if (t) fila.push(t);
  }
  return vistas;
}
for (const [wid, W] of Object.entries(WORLDS)) {
  const M = W.map, nodes = { ...M.nodes, ...((M.extra && M.extra.nodes) || {}) };
  const pontos = M.path.length + ((M.extra && M.extra.path.length) || 0);
  for (const [n, c] of Object.entries(W.chapters)) {
    const rot = `mundo "${wid}" cap. ${n}`;
    if (c.soon) continue;
    if (!SC[c.start]) { erro(`${rot}: cena inicial "${c.start}" não existe`); continue; }
    const vistas = alcanca(c.start);
    if (![...vistas].some(ehFim)) erro(`${rot}: nenhum final é alcançável a partir de "${c.start}"`);
    if (!(c.rank && c.rank[0] >= c.rank[1])) erro(`${rot}: "rank" inválido (esperado [lendário, corajoso] com o primeiro >= segundo)`);
    if (nodes[n] === undefined) erro(`${rot}: sem posição em map.nodes`);
    else if (nodes[n] >= pontos) erro(`${rot}: posição ${nodes[n]} fora do caminho do mapa (${pontos} pontos)`);
    if (!M.icons[n]) aviso(`${rot}: sem ícone em map.icons`);
    if (!M.colors[n]) aviso(`${rot}: sem cor em map.colors`);
    for (const h of c.heroes) if (!FAILS[h.name]) aviso(`${rot}: herói "${h.name}" sem frases próprias em FAILS (usará as genéricas)`);
  }
  for (const h of W.heroes) if (!FAILS[h.name]) aviso(`mundo "${wid}": herói "${h.name}" sem frases próprias em FAILS`);
  const usados = Object.values(nodes);
  if (new Set(usados).size !== usados.length) erro(`mundo "${wid}": dois capítulos usam a mesma posição no mapa`);
}
const orfas = Object.keys(SC).filter(id => !visitadas.has(id) && !SC[id].menu && !SC[id].mundos && !SC[id].rec);
if (orfas.length) aviso(`${orfas.length} cena(s) nunca alcançadas por nenhum capítulo: ${orfas.join(', ')}`);

/* ---------- 4. itens e amizades citados no código ---------- */
for (const m of fontes.matchAll(/give\('(\w+)'\)/g)) if (!ITEMS[m[1]]) erro(`give('${m[1]}') usa um item que não existe em ITEMS`);
for (const m of fontes.matchAll(/amigo\('(\w+)'\)/g)) if (!FRIEND[m[1]]) erro(`amigo('${m[1]}') usa um amigo que não existe em FRIEND`);
for (const [k, it] of Object.entries(ITEMS)) {
  if (!['bonus', 'heal', 'dmg', 'shield'].includes(it.type)) erro(`item "${k}": tipo "${it.type}" inválido`);
  if (it.type !== 'shield' && typeof it.v !== 'number') erro(`item "${k}": falta o valor "v"`);
}

/* ---------- 4b. troca de nomes (nomes.js) ---------- */
if (typeof get('nomes') === 'function') {
  const nomes = get('nomes'), caso = (rot, html, cfg, esperado) => {
    const r = nomes(html, cfg); if (r !== esperado) erro(`nomes(): ${rot}\n     esperado: ${esperado}\n     obtido:   ${r}`);
  };
  const maria = { kay: { n: 'Maria', g: 'F' } };
  caso('sem personalização não muda nada', 'O Kay e a Liv', {}, 'O Kay e a Liv');
  caso('troca de menino para menina ajusta artigos', 'O Kay pegou o chapéu do Kay', maria, 'A Maria pegou o chapéu da Maria');
  caso('não troca o "o" que não é artigo do nome', 'Ele viu o mar e o Kay', maria, 'Ele viu o mar e a Maria');
  caso('mesmo gênero mantém o artigo', 'a Liv e da Liv', { liv: { n: 'Ana', g: 'F' } }, 'a Ana e da Ana');
  caso('menina para menino', 'na Lia, da Lia, A Lia', { lia: { n: 'Théo', g: 'M' } }, 'no Théo, do Théo, O Théo');
  caso('nome composto inteiro', 'Bilu Bilu e Pegasus', { bilu: { n: 'Davi', g: 'M' } }, 'Davi e Pegasus');
  caso('não altera tags HTML', '<button onclick="go(\'Kay\')">Kay</button>', maria, '<button onclick="go(\'Kay\')">Maria</button>');
  caso('não troca dentro de outras palavras', 'Livro Mágico, Kayak, Julia', { liv: { n: 'Ana' }, kay: { n: 'Zé' }, lia: { n: 'Bia' } }, 'Livro Mágico, Kayak, Julia');
  caso('remove caracteres de HTML do nome', 'Kay', { kay: { n: '<b>x</b>' } }, 'bx/b');
  caso('nome em branco volta ao original', 'Kay', { kay: { n: '   ', g: 'F' } }, 'Kay');
  const faceDe = get('faceDe'), face = (rot, heroi, cfg, esperado) => {
    const r = faceDe(heroi, cfg); if (r !== esperado) erro(`faceDe(): ${rot} (esperado ${esperado}, obtido ${r})`);
  };
  face('sem personalização mantém o rosto original', { name: 'Kay', face: '🧒' }, {}, '🧒');
  face('menino vira menina', { name: 'Kay', face: '🧒' }, { kay: { n: 'Maria', g: 'F' } }, '👧');
  face('menina vira menino', { name: 'Liv', face: '🦸‍♀️' }, { liv: { n: 'Théo', g: 'M' } }, '🦸‍♂️');
  face('herói sem slot mantém o rosto', { name: 'Faísca', face: '🐲' }, { kay: { g: 'F' } }, '🐲');
  for (const s of get('SLOTS')) for (const g of ['M', 'F']) if (!s.faces[g]) erro(`SLOTS: "${s.id}" sem rosto para o gênero ${g}`);
}

/* ---------- 5. arquivos do modo offline (sw.js) ---------- */
const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const lista = [...(sw.match(/ARQUIVOS\s*=\s*\[([\s\S]*?)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
const noHtml = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(u => !/^https?:/.test(u));
const css = ['css/fonts.css', 'css/style.css'].map(f => fs.readFileSync(path.join(RAIZ, f), 'utf8')).join('\n');
const fontesUrl = [...css.matchAll(/url\((\.\.\/[^)]+)\)/g)].map(m => m[1].replace('../', ''));
for (const u of new Set([...noHtml, ...fontesUrl])) {
  if (!fs.existsSync(path.join(RAIZ, u))) erro(`arquivo referenciado não existe: ${u}`);
  else if (!lista.includes(u) && !u.startsWith('icons/icon-1')) erro(`sw.js não guarda "${u}" para uso offline`);
}
for (const u of lista) if (u !== './' && !fs.existsSync(path.join(RAIZ, u))) erro(`sw.js lista "${u}", que não existe`);
const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'manifest.webmanifest'), 'utf8'));
for (const i of man.icons) if (!fs.existsSync(path.join(RAIZ, i.src))) erro(`manifest: ícone ${i.src} não existe`);

fim();
function fim() {
  const n = typeof SC === 'undefined' ? '?' : Object.keys(SC).length;
  avisos.forEach(a => console.log('⚠️  ' + a));
  erros.forEach(e => console.log('❌ ' + e));
  console.log(`\n${n} cenas, ${erros.length} erro(s), ${avisos.length} aviso(s)`);
  process.exit(erros.length ? 1 : 0);
}
