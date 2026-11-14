/* Nomes personalizáveis dos heróis.
   As histórias continuam escritas com os nomes originais; a troca acontece só na hora de mostrar o texto
   (nomes(html) é chamado por render() em engine.js). Tags HTML e a lógica do jogo não são alteradas.
   Para tornar outro personagem personalizável, basta incluí-lo em SLOTS. */

const SLOTS=[
 {id:'bilu',orig:'Bilu Bilu',faces:{M:'🧔',F:'👩'},g:'M',mundo:'Reino das Cores'},
 {id:'pegasus',orig:'Pegasus',faces:{M:'🦸',F:'🦸‍♀️'},g:'M',mundo:'Reino das Cores'},
 {id:'kay',orig:'Kay',faces:{M:'🧒',F:'👧'},g:'M',mundo:'Reino das Cores'},
 {id:'liv',orig:'Liv',faces:{M:'🦸‍♂️',F:'🦸‍♀️'},g:'F',mundo:'Planeta Florescer'},
 {id:'lia',orig:'Lia',faces:{M:'👶',F:'👶'},g:'F',mundo:'Planeta Florescer'},
 {id:'bolota',orig:'Bolota',faces:{M:'🐿️',F:'🐿️'},g:'F',mundo:'Planeta Florescer'},
 {id:'gominha',orig:'Gominha',faces:{M:'🐙',F:'🐙'},g:'M',mundo:'Planeta Monstrinhos'},
 {id:'pedregulho',orig:'Pedregulho',faces:{M:'🪨',F:'🪨'},g:'M',mundo:'Planeta Monstrinhos'},
 {id:'baiacao',orig:'Baiacão',faces:{M:'🐡',F:'🐡'},g:'M',mundo:'Planeta Monstrinhos'}];

/* artigos que mudam com o gênero: "o Kay" ↔ "a Maria", "do Kay" ↔ "da Maria"... */
const ART_MF={o:'a',O:'A',do:'da',Do:'Da',no:'na',No:'Na',ao:'à',Ao:'À',pelo:'pela',Pelo:'Pela',um:'uma',Um:'Uma'};
const ART_FM=Object.fromEntries(Object.entries(ART_MF).map(([m,f])=>[f,m]));
const NOMES_CHAVE='rpg_nomes',NOME_MAX=14;
const escHtml=t=>t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LETRA='A-Za-zÀ-ÿ';

/* configuração salva: {id:{n:nome,g:'M'|'F'}} — só guarda o que difere do original */
function lerNomes(){
 try{const c=JSON.parse(localStorage.getItem(NOMES_CHAVE)||'{}');return c&&typeof c==='object'?c:{}}catch(e){return {}}
}
function limparNome(t){return String(t||'').replace(/[<>&"'`\\]/g,'').replace(/\s+/g,' ').trim().slice(0,NOME_MAX)}

/* troca os nomes no HTML já montado (só no texto, nunca dentro de tags). cfg opcional, usada nos testes. */
function nomes(html,cfg){
 cfg=cfg||lerNomes();
 const ativos=SLOTS.filter(s=>cfg[s.id]&&(cfg[s.id].n&&cfg[s.id].n!==s.orig||cfg[s.id].g&&cfg[s.id].g!==s.g));
 if(!ativos.length)return html;
 const por=Object.fromEntries(ativos.map(s=>[s.orig,s]));
 const alt=ativos.map(s=>s.orig).sort((a,b)=>b.length-a.length).join('|');
 const re=new RegExp(`(^|[^${LETRA}])(?:(o|O|do|Do|no|No|ao|Ao|pelo|Pelo|um|Um|a|A|da|Da|na|Na|à|À|pela|Pela|uma|Uma) )?(${alt})(?![${LETRA}])`,'g');
 return html.split(/(<[^>]*>)/).map(p=>{
  if(p[0]==='<')return p;
  return p.replace(re,(m,pre,art,orig)=>{
   const s=por[orig],c=cfg[s.id],nome=escHtml(limparNome(c.n)||s.orig),g=c.g||s.g;
   if(art&&g!==s.g)art=(s.g==='M'?ART_MF:ART_FM)[art]||art;
   return pre+(art?art+' ':'')+nome});
 }).join('');
}

/* rosto (emoji) do herói conforme o gênero escolhido; heróis sem slot mantêm o rosto original */
function faceDe(x,cfg){
 const s=SLOTS.find(t=>t.orig===x.name);if(!s)return x.face;
 const g=((cfg||lerNomes())[s.id]||{}).g||s.g;
 return s.faces[g]||x.face;
}
function mudaFaceNomes(id,g){const s=SLOTS.find(t=>t.id===id);$('nf_'+id).textContent=s.faces[g]}

/* ---- tela de edição (aparece no cartão da galáxia) ---- */
function editorNomesHTML(){
 const cfg=lerNomes();let grupo='',h='';
 for(const s of SLOTS){
  if(s.mundo!==grupo){grupo=s.mundo;h+=`<div class="nmgrupo">${grupo}</div>`}
  const c=cfg[s.id]||{},nome=limparNome(c.n)||s.orig,g=c.g||s.g;
  h+=`<div class="nmrow"><span class="nmface" id="nf_${s.id}">${s.faces[g]}</span><input id="nm_${s.id}" type="text" maxlength="${NOME_MAX}" value="${escHtml(nome)}" placeholder="${s.orig}" aria-label="Nome no lugar de ${s.orig}" autocomplete="off">`+
   `<select id="ng_${s.id}" aria-label="Menino ou menina" onchange="mudaFaceNomes('${s.id}',this.value)"><option value="M"${g==='M'?' selected':''}>Menino</option><option value="F"${g==='F'?' selected':''}>Menina</option></select></div>`}
 return `<div class="lvcard nmedit"><div class="lvn">Personalizar</div><div class="lvt">✏️ Quem vai jogar?</div>`+
  `<div class="lvs">Escreva o nome da criança no lugar de um herói. A história usa o nome em todo lugar.</div>${h}`+
  `<div class="nmgrupo">Dado</div><div class="nmrow"><span class="nmface">🎲</span><select id="dado_modo" aria-label="Tipo de dado"><option value="digital"${dadoFisico()?'':' selected'}>Dado do jogo (na tela)</option><option value="fisico"${dadoFisico()?' selected':''}>Meu dado de verdade</option></select></div>`+
  `<div class="lvs nmdica">Com dado de verdade, vocês rolam e tocam no número que saiu.</div>`+
  `<button class="btn go" onclick="salvarNomes()">💾 Salvar</button>`+
  `<button class="btn reset" onclick="restaurarNomes()">↩️ Voltar aos nomes originais</button>`+
  `<button class="adjlink" onclick="fecharNomes()">Cancelar</button></div>`;
}
function abrirNomes(){window._ed=1;render()}
function fecharNomes(){window._ed=0;render()}
function salvarNomes(){
 const cfg={};
 for(const s of SLOTS){
  const n=limparNome($('nm_'+s.id).value)||s.orig,g=$('ng_'+s.id).value==='F'?'F':'M';
  if(n!==s.orig||g!==s.g)cfg[s.id]={n,g}}
 try{localStorage.setItem(NOMES_CHAVE,JSON.stringify(cfg))}catch(e){}
 guardarModoDado($('dado_modo').value==='fisico');
 fecharNomes();
}
function restaurarNomes(){
 try{localStorage.removeItem(NOMES_CHAVE)}catch(e){}
 fecharNomes();
}
