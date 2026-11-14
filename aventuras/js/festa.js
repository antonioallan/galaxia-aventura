/* Animações de comemoração: confete, estrelinhas e balanço dos bichos.
   Tudo é desenhado com elementos temporários e CSS; se o aparelho pede "menos movimento"
   (prefers-reduced-motion), nada é animado. */

const FESTA_CORES=['#ff5c8a','#ffb703','#2fb36d','#4fb8ee','#7b5cff','#ff9f1c'];
const _semMovimento=()=>{try{return window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};

/* chuva de confete e emojis. n = quantidade de peças; emojis opcional (ex.: ['⭐','💖']) */
function confete(n,emojis){
 if(_semMovimento())return;
 try{
  const box=document.createElement('div');box.className='confete';box.setAttribute('aria-hidden','true');
  for(let i=0;i<n;i++){
   const p=document.createElement('i'),emo=emojis&&Math.random()<.35;
   p.style.left=(Math.random()*100)+'%';
   p.style.animationDuration=(1.8+Math.random()*1.8)+'s';
   p.style.animationDelay=(Math.random()*.6)+'s';
   p.style.setProperty('--dx',(Math.random()*160-80)+'px');
   p.style.setProperty('--rot',(Math.random()*720-360)+'deg');
   if(emo){p.className='emo';p.textContent=emojis[i%emojis.length]}
   else{p.style.background=FESTA_CORES[i%FESTA_CORES.length];p.style.width=(6+Math.random()*7)+'px';p.style.height=(8+Math.random()*8)+'px'}
   box.appendChild(p)}
  document.body.appendChild(box);
  setTimeout(()=>box.remove(),4500);
 }catch(e){}
}
/* faz um elemento "pular de alegria" */
function pula(el){
 if(!el||_semMovimento())return;
 el.classList.remove('pula');void el.offsetWidth;el.classList.add('pula');
}
/* a Fada Luzinha ajudou: chuva de brilho dourado, fadinha cruzando a tela e corações brilhando */
function festaFada(){
 setTimeout(()=>tocar('fada'),350);
 const h=document.querySelector('.hud .hearts');
 if(h&&!_semMovimento()){h.classList.remove('curou');void h.offsetWidth;h.classList.add('curou')}
 if(_semMovimento())return;
 try{
  const box=document.createElement('div');box.className='brilhos';box.setAttribute('aria-hidden','true');
  const fada=document.createElement('b');fada.className='fadavoa';fada.textContent='🧚';box.appendChild(fada);
  for(let i=0;i<46;i++){
   const p=document.createElement('i'),emo=i%3===0;
   p.style.left=(Math.random()*100)+'%';
   p.style.animationDuration=(2.2+Math.random()*1.8)+'s';
   p.style.animationDelay=(.2+Math.random()*1.1)+'s';
   p.style.setProperty('--dx',(Math.random()*80-40)+'px');
   if(emo){p.className='emo';p.textContent=['✨','🌟','💫'][i%9/3|0]}
   else{const t=3+Math.random()*5;p.style.width=p.style.height=t+'px'}
   box.appendChild(p)}
  document.body.appendChild(box);
  setTimeout(()=>box.remove(),5000);
 }catch(e){}
}
/* vitória na batalha: o inimigo derrotado vira amigo, confete e fanfarra */
function festaBatalha(){tocar('vitoria');confete(40,['⭐','✨'])}
/* fim de capítulo: confete grande */
function festaFim(estrelas){tocar('fim');confete(70+Math.min(estrelas,10)*6,['⭐','💖','🎉','🌈'])}
