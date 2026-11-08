/* Dado de verdade (opcional).
   Por padrão o jogo rola um dado digital. A família pode escolher "Meu dado de verdade" na tela
   Personalizar: então, em vez de animar o dado, roll() (em engine.js) chama pedirDado(), que mostra
   uma janela para tocar no número que saiu. O resto do jogo não muda: o resultado entra como se fosse o digital. */

const DADO_CHAVE='rpg_dado';
const DADO_PIPS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};

function dadoFisico(){try{return localStorage.getItem(DADO_CHAVE)==='fisico'}catch(e){return false}}
function guardarModoDado(fisico){
 try{if(fisico)localStorage.setItem(DADO_CHAVE,'fisico');else localStorage.removeItem(DADO_CHAVE)}catch(e){}
}

/* mostra as 6 faces do dado; a criança toca na que saiu e confirma. dica: o que cada resultado significa. */
function pedirDado(cb,dica){
 busy=1;
 const ov=document.createElement('div');
 ov.className='dadoov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Qual número saiu no dado?');
 const face=v=>`<button type="button" class="dpick" data-v="${v}" aria-label="Saiu ${v}">${[...Array(9)].map((_,i)=>`<span class="pip ${DADO_PIPS[v].includes(i)?'on':''}"></span>`).join('')}</button>`;
 ov.innerHTML=`<div class="dbox"><div class="dtit">🎲 Role o seu dado!</div>`+
  `<div class="dsub">Toque na face que saiu:</div>`+
  `<div class="dgrid">${[1,2,3,4,5,6].map(face).join('')}</div>`+
  (dica?`<div class="ddica">${dica}</div>`:'')+
  `<button type="button" class="btn go" id="dok" disabled>✅ Foi esse!</button>`+
  `<button type="button" class="adjlink" id="dno">Cancelar</button></div>`;
 let v=0;
 const fechar=()=>{document.removeEventListener('keydown',tecla);ov.remove()};
 const escolher=n=>{v=n;ov.querySelectorAll('.dpick').forEach(b=>b.classList.toggle('sel',+b.dataset.v===n));ov.querySelector('#dok').disabled=false};
 const confirmar=()=>{if(!v)return;fechar();S.die=v;if($('die'))setDie(v);busy=0;cb(v)};
 const cancelar=()=>{fechar();busy=0};
 const tecla=e=>{
  if(e.key>='1'&&e.key<='6')escolher(+e.key);
  else if(e.key==='Enter')confirmar();
  else if(e.key==='Escape')cancelar();
 };
 ov.querySelectorAll('.dpick').forEach(b=>b.onclick=()=>escolher(+b.dataset.v));
 ov.querySelector('#dok').onclick=confirmar;ov.querySelector('#dno').onclick=cancelar;
 document.addEventListener('keydown',tecla);
 document.body.appendChild(ov);
 ov.querySelector('.dpick').focus();
}
