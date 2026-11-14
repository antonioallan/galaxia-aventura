/* Mini-jogos curtos: momentos da história que se resolvem com as mãos, sem dado.
   Uma cena de mini-jogo é assim (SC):
     id:{mini:{tipo:'quebra',art:'🚪🔒',title?:'...',text:'...',ok:'texto ao vencer',next:'cena_seguinte',fx?(){return star()}, ...opções do tipo}}
   Tipos e opções:
     quebra    {emoji:'🔑',cols:3,rows:2}   monta a figura trocando peças de lugar (toca em duas peças)
     pares     {emojis:['🧸','🚂','🎲']}    jogo da memória
     sequencia {len:3}                      repete a sequência de sons e cores
   Ninguém perde: errar só pede para tentar de novo. Depois de algumas tentativas aparece "pedir ajuda da Fada",
   que resolve o jogo sem dar a recompensa (fx). Estado do jogo em S.mj (criado em go(), engine.js). */

const MJ_AJUDA={quebra:14,pares:10,sequencia:3};
/* lado de cada peça do quebra-cabeça, em px: peças maiores quando há poucas (m.tam força um valor) */
const mjTam=m=>m.tam||(m.cols>=3?100:130);

function _embaralha(a){
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}

function miniNovo(m){
 const J={tipo:m.tipo,tent:0,done:0,ajudou:0,extra:''};
 if(m.tipo==='quebra'){
  const n=m.cols*m.rows;
  do{J.p=_embaralha([...Array(n).keys()])}while(J.p.every((k,i)=>k===i));
  J.sel=-1;
 }else if(m.tipo==='pares'){
  J.c=_embaralha([...m.emojis,...m.emojis]);J.aberta=[];J.achou=J.c.map(()=>0);J.trava=0;
 }else if(m.tipo==='sequencia'){
  J.seq=[...Array(m.len||3)].map(()=>Math.floor(Math.random()*4));
  J.pos=0;J.fase='parado';J.msg='Toque em ▶ e preste atenção nos sons e nas cores!';
 }
 return J;
}

/* ---- desenho de cada tipo ---- */
const MJ_HTML={
 quebra(m,J){
  const T=mjTam(m),fs=Math.min(m.cols,m.rows)*T*.95;let g='';
  J.p.forEach((k,i)=>{
   const c=k%m.cols,r=Math.floor(k/m.cols);
   g+=`<button class="pc${k===i?' ok':''}${J.sel===i?' sel':''}" onclick="miniQuebra(${i})" style="width:${T}px;height:${T}px" aria-label="Peça ${i+1}"><span style="left:${-c*T}px;top:${-r*T}px;width:${m.cols*T}px;height:${m.rows*T}px;font-size:${fs}px">${m.emoji}</span></button>`});
  return `<div class="mjdica">Toque em duas peças para trocar de lugar! 🧩</div><div class="quebra" style="grid-template-columns:repeat(${m.cols},${T}px)">${g}</div><div class="mjdica">Modelo: <b style="font-size:30px">${m.emoji}</b></div>`;
 },
 pares(m,J){
  const g=J.c.map((e,i)=>{const v=J.achou[i]||J.aberta.includes(i);
   return `<button class="carta${J.achou[i]?' ok':''}${v?' vira':''}" onclick="miniPar(${i})" aria-label="Carta ${i+1}">${v?e:'❓'}</button>`}).join('');
  return `<div class="mjdica">Ache os pares iguais! 🃏</div><div class="cartas" style="grid-template-columns:repeat(4,1fr)">${g}</div>`;
 },
 sequencia(m,J){
  const pads=MJ_PADS.map((p,i)=>`<button class="pad" data-p="${i}" style="background:${p[1]}" onclick="miniPad(${i})" aria-label="${p[2]}" ${J.fase==='jogar'?'':'disabled'}>${p[0]}</button>`).join('');
  return `<div class="mjdica">${J.msg}</div><div class="pads">${pads}</div>`+(J.fase==='parado'?`<button class="btn" onclick="miniOuvir()">▶ Ouvir a sequência</button>`:'');
 }
};
const MJ_PADS=[['🔴','#ff6b6b','Vermelho'],['🟡','#ffd23f','Amarelo'],['🟢','#2fb36d','Verde'],['🔵','#4fb8ee','Azul']];

function miniHTML(){
 const m=SC[S.scene].mini,J=S.mj;
 return MJ_HTML[m.tipo](m,J)+(J.tent>=(m.ajuda||MJ_AJUDA[m.tipo])?`<button class="adjlink" onclick="miniVence(1)">🧚 Pedir ajuda da Fada Luzinha</button>`:'');
}
function miniRefresh(){const e=$('mj');if(e)e.innerHTML=miniHTML()}

/* terminou: ajudou=1 quando foi a Fada que resolveu (sem recompensa) */
function miniVence(ajudou){
 const J=S.mj,m=SC[S.scene].mini;
 if(!J||J.done)return;
 J.done=1;J.ajudou=ajudou?1:0;
 J.extra=!ajudou&&m.fx?m.fx():'';
 render();festaBatalha();
}

/* ---- quebra-cabeça ---- */
function miniQuebra(i){
 const J=S.mj;if(!J||J.done)return;
 let trocou=0;
 if(J.sel<0){J.sel=i;tocar('ok')}
 else if(J.sel===i){J.sel=-1}
 else{[J.p[i],J.p[J.sel]]=[J.p[J.sel],J.p[i]];J.sel=-1;J.tent++;trocou=1;tocar(J.p[i]===i?'bom':'ok')}
 miniRefresh();
 if(trocou&&J.p.every((k,x)=>k===x))setTimeout(()=>{if(S.mj===J)miniVence(0)},600);
}

/* ---- jogo da memória ---- */
function miniPar(i){
 const J=S.mj;if(!J||J.done||J.trava||J.achou[i]||J.aberta.includes(i))return;
 J.aberta.push(i);tocar('ok');
 if(J.aberta.length===2){
  const [a,b]=J.aberta;J.tent++;
  if(J.c[a]===J.c[b]){J.achou[a]=J.achou[b]=1;J.aberta=[];tocar('bom');
   if(J.achou.every(Boolean)){miniRefresh();setTimeout(()=>{if(S.mj===J)miniVence(0)},700);return}}
  else{J.trava=1;setTimeout(()=>{if(S.mj!==J)return;J.aberta=[];J.trava=0;miniRefresh()},900)}
 }
 miniRefresh();
}

/* ---- sequência de sons ---- */
function _acende(p){
 const el=document.querySelector(`.pad[data-p="${p}"]`);
 if(el){el.classList.add('lit');setTimeout(()=>el.classList.remove('lit'),420)}
 tocar('pad',p);
}
function miniOuvir(){
 const J=S.mj;if(!J||J.done)return;
 J.fase='ver';J.msg='Escute com atenção... 👂';miniRefresh();
 J.seq.forEach((p,i)=>setTimeout(()=>{if(S.mj===J&&!J.done)_acende(p)},600+i*800));
 setTimeout(()=>{if(S.mj!==J||J.done)return;J.fase='jogar';J.pos=0;J.msg='Agora é a sua vez! 👆';miniRefresh()},600+J.seq.length*800);
}
function miniPad(p){
 const J=S.mj;if(!J||J.done||J.fase!=='jogar')return;
 _acende(p);
 if(p===J.seq[J.pos]){
  if(++J.pos>=J.seq.length){J.fase='fim';setTimeout(()=>{if(S.mj===J)miniVence(0)},700)}
 }else{
  J.tent++;J.fase='parado';J.msg='Ops! Vamos ouvir de novo? 🎶';tocar('erro');
  setTimeout(()=>{if(S.mj!==J||J.done)return;miniRefresh();setTimeout(()=>{if(S.mj===J&&!J.done&&J.fase==='parado')miniOuvir()},900)},350);
 }
}
