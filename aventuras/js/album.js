/* Álbum de amigos: uma figurinha para cada amigo que a equipe fez nos finais felizes.
   Não guarda nada novo: um amigo está no álbum quando o capítulo dele foi jogado até o fim e o amigo
   não foi perdido (PROG.lost, em engine.js). Assim, quem já jogou antes do álbum existir também vê as figurinhas.
   Para um amigo novo: acrescente-o em FRIEND (engine.js) e aqui em FIGURAS ([emoji, id do mundo]). */

const FIGURAS={
 faisca:['🐲','reino'],bruxa:['🧙‍♀️','reino'],pirata:['🏴‍☠️','reino'],robo:['🤖','reino'],magico:['🎩','reino'],
 boneco:['⛄','reino'],arrumadinho:['🧺','reino'],bocejo:['💭','reino'],rei:['👑','reino'],formiga:['🐜','reino'],borracha:['✏️','reino'],
 brilho:['🐦','florescer'],lesma:['🐌','florescer'],flamingo:['🦩','florescer'],escorpiao:['🦂','florescer'],tigre:['🐯','florescer'],
 pavao:['🦚','florescer'],espelhinho:['🪞','florescer'],borboleta:['🦋','florescer'],tico:['🦊','florescer'],trovao:['🌩️','florescer']
};

/* o amigo k está no álbum? pr = progresso do mundo dele (padrão: o salvo) */
function figuraGanha(k,pr){
 const f=FIGURAS[k];if(!f)return false;
 pr=pr||ALLPROG[f[1]]||{};
 const p=pr[FRIEND[k][1]];
 /* skip: capítulo marcado como "já jogamos" em startFrom(); não conta como amizade conquistada */
 return !!(p&&p.done&&!p.skip&&!(pr.lost&&pr.lost[k]));
}

/* cartão que aparece no final de um capítulo quando o amigo acaba de entrar no álbum */
function figurinhaNovaHTML(k){
 return `<div class="figcard nova"><div class="figtag">🎉 Figurinha nova no álbum!</div><div class="fig">${FIGURAS[k][0]}</div><div class="fignm">${capz(FRIEND[k][0])}</div></div>`;
}

function albumHTML(){
 let total=0,tem=0,corpo='';
 for(const w in WORLDS){
  const ks=Object.keys(FIGURAS).filter(k=>FIGURAS[k][1]===w);
  if(!ks.length)continue;
  const ganhas=ks.filter(k=>figuraGanha(k));
  total+=ks.length;tem+=ganhas.length;
  corpo+=`<div class="albmundo">${WORLDS[w].icon} ${WORLDS[w].name} <span>${ganhas.length}/${ks.length}</span></div><div class="albgrade">`;
  for(const k of ks.sort((a,b)=>FRIEND[a][1]-FRIEND[b][1])){
   corpo+=figuraGanha(k)
    ?`<div class="figcard"><div class="fig">${FIGURAS[k][0]}</div><div class="fignm">${capz(FRIEND[k][0])}</div><div class="figsub">Capítulo ${FRIEND[k][1]}</div></div>`
    :`<div class="figcard vazia"><div class="fig">❓</div><div class="fignm">Amigo secreto</div><div class="figsub">Capítulo ${FRIEND[k][1]}</div></div>`}
  corpo+=`</div>`}
 return `<div class="maptop"><button class="back" onclick="fecharAlbum()">⬅ Voltar</button><div class="title">📒 Álbum de Amigos</div><div class="mapsub">${tem} de ${total} amigos${tem===total&&total?' · 🏆 Álbum completo!':''}</div></div>`+
  `<div class="albtxt">Nos finais felizes, quem era inimigo vira amigo. Cada amigo ganha uma figurinha!</div>${corpo}`;
}
function abrirAlbum(){window._albumDe=S.scene;tocar('ok');go('album')}
function fecharAlbum(){tocar('ok');go(window._albumDe||'mundos')}
