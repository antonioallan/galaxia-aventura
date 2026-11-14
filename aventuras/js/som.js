/* Sons do jogo, gerados na hora com Web Audio (nenhum arquivo de áudio).
   tocar('nome') é seguro de chamar em qualquer lugar: se o navegador não tiver áudio, ou o som estiver
   desligado, não acontece nada. A escolha de ligar/desligar fica em localStorage, chave rpg_som. */

const SOM_CHAVE='rpg_som';
let _ac=null;

function somLigado(){try{return localStorage.getItem(SOM_CHAVE)!=='off'}catch(e){return true}}
function guardarSom(on){try{if(on)localStorage.removeItem(SOM_CHAVE);else localStorage.setItem(SOM_CHAVE,'off')}catch(e){}}
function alternarSom(){
 const on=!somLigado();guardarSom(on);
 if(on)tocar('ok');
 document.querySelectorAll('.somtog').forEach(b=>{b.textContent=on?'🔊 Sons ligados':'🔇 Sons desligados';b.setAttribute('aria-pressed',on)});
}
function botaoSom(){const on=somLigado();return `<button class="somtog" aria-pressed="${on}" onclick="alternarSom()">${on?'🔊 Sons ligados':'🔇 Sons desligados'}</button>`}

function _audio(){
 if(_ac)return _ac;
 try{const A=window.AudioContext||window.webkitAudioContext;if(A)_ac=new A()}catch(e){}
 return _ac;
}
/* uma nota: freq (Hz), início (s depois de agora), duração (s), tipo de onda, volume, freq final opcional (deslizar) */
function _nota(ac,f,t0,dur,tipo,vol,f2){
 const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+t0;
 o.type=tipo||'sine';o.frequency.setValueAtTime(f,t);
 if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.15,t+.015);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+.02);
}
const _N={do:523.25,re:587.33,mi:659.25,fa:698.46,sol:783.99,la:880,si:987.77,do2:1046.5,mi2:1318.5,sol2:1568};
const SONS={
 /* dado rolando: tique-taques que aceleram */
 dado(ac){for(let i=0;i<8;i++)_nota(ac,420+i*35,i*.085,.05,'square',.06)},
 /* resultado do dado: agudo se foi bom, grave se foi ruim */
 bom(ac){_nota(ac,_N.mi,0,.12,'triangle',.16);_nota(ac,_N.sol,.1,.18,'triangle',.16)},
 super(ac){[_N.do,_N.mi,_N.sol,_N.do2].forEach((f,i)=>_nota(ac,f,i*.07,.2,'triangle',.16));_nota(ac,_N.sol2,.3,.35,'sine',.1)},
 erro(ac){_nota(ac,330,0,.18,'sawtooth',.08,200);_nota(ac,220,.16,.28,'sawtooth',.07,150)},
 /* clique e escolhas */
 ok(ac){_nota(ac,_N.sol,0,.1,'sine',.12);_nota(ac,_N.do2,.07,.14,'sine',.12)},
 /* final de batalha: pequena fanfarra */
 vitoria(ac){[[_N.do,0],[_N.mi,.12],[_N.sol,.24],[_N.do2,.36],[_N.sol,.5],[_N.do2,.62]].forEach(([f,t])=>_nota(ac,f,t,.22,'triangle',.17));_nota(ac,_N.mi2,.75,.6,'sine',.1)},
 /* fim do capítulo: mais longa e brilhante */
 fim(ac){[[_N.do,0],[_N.re,.1],[_N.mi,.2],[_N.sol,.3],[_N.la,.4],[_N.do2,.5]].forEach(([f,t])=>_nota(ac,f,t,.2,'triangle',.16));
  [_N.do2,_N.mi2,_N.sol2].forEach((f,i)=>_nota(ac,f,.75+i*.03,.9,'sine',.09))},
 /* figurinha nova: brilhinhos */
 figurinha(ac){[0,1,2,3,4].forEach(i=>_nota(ac,_N.mi2+i*180,i*.07,.25,'sine',.09))},
 /* coração perdido / cura */
 ai(ac){_nota(ac,400,0,.25,'sine',.12,160)},
 /* botões coloridos do mini-jogo de sequência: i = 0..3 */
 pad(ac,i){_nota(ac,[330,392,494,587][i||0],0,.38,'triangle',.18)},
 /* a Fada Luzinha aparece: sininhos subindo e um brilho no final */
 fada(ac){[0,1,2,3,4,5,6].forEach(i=>_nota(ac,_N.sol*(1+i*.12),i*.09,.45,'sine',.1));[_N.do2,_N.mi2,_N.sol2].forEach((f,i)=>_nota(ac,f,.7+i*.08,.9,'triangle',.07))},
 /* segredo encontrado: arpejo misterioso que sobe */
 segredo(ac){[_N.mi,_N.sol,_N.si,_N.mi2,_N.sol2].forEach((f,i)=>_nota(ac,f,i*.11,.4,'triangle',.13));[_N.mi2,_N.si*2].forEach((f,i)=>_nota(ac,f,.65+i*.06,.8,'sine',.08))},
 cura(ac){_nota(ac,_N.do,0,.12,'sine',.12);_nota(ac,_N.mi,.1,.12,'sine',.12);_nota(ac,_N.sol,.2,.2,'sine',.12)}
};
function tocar(nome,arg){
 if(!somLigado())return;
 try{const ac=_audio();if(!ac||!SONS[nome])return;
  if(ac.state==='suspended')ac.resume();
  SONS[nome](ac,arg)}catch(e){}
}
