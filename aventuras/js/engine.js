/* Motor do jogo: tabela de capítulos, estado, dado, batalhas, mapas, galáxia e progresso */
let CH={
 1:{start:'inicio',title:'O Cristal do Arco-Íris',heroes:[],rank:[5,3]},
 2:{start:'c2_inicio',title:'O Sumiço da Lua',needs:()=>amigo('faisca')?[]:['faisca'],heroes:[{name:'Faísca',face:'🐲',move:'Sopro Quentinho 🔥'}],rank:[7,4]},
 3:{start:'c3_inicio',title:'O Tesouro do Fundo do Mar',heroes:[{name:'Pipoca',face:'🐬',move:'Pirueta Splash 💦'}],rank:[8,5]},
 4:{start:'c4_inicio',title:'A Viagem ao Espaço',heroes:[{name:'Estrelinha',face:'⭐',move:'Brilho Ofuscante ✨'}],rank:[9,5]}
};
/* Itens genéricos (capítulos 5+): bonus = soma no dado, heal = corações, dmg = tira energia, shield = protege do próximo erro */
const ITEMS={};
function give(k){S.inv[k]=1;return ` (ganhou: ${ITEMS[k].name}!)`}
function vence(){const f=$('ef');if(f){f.classList.add('amigo');pula(f)}festaBatalha()}
function useItem(k){
 const it=ITEMS[k],B=SC[S.scene].battle,b=S.b;S.inv[k]=2;
 if(it.type==='bonus'){b.bonus=it.v;b.msg=`${it.name} pronto! +${it.v} no próximo dado! ✨`}
 else if(it.type==='heal'){S.hearts=Math.min(S.max,S.hearts+it.v);b.msg=`${it.name}: vocês ganharam ${it.v} ❤️! 💖`}
 else if(it.type==='shield'){b.shield=1;b.msg=`${it.name} ativado! Se alguém errar, ninguém se machuca! 🛡️`}
 else if(it.type==='dmg'){b.hp=Math.max(0,b.hp-it.v);b.msg=`${it.name}: ${it.fx||'POW!'} 💥`;if(b.hp<=0){b.done=1;b.msg+=`\n\n🏆 ${B.win}`}}
 render();if(it.type==='dmg'){$('ef').classList.add('hit');tocar('bom');if(S.b.done)vence()}else tocar(it.type==='heal'?'cura':'ok');
}
function cristal(){S.f.cristais=(S.f.cristais||0)+1;return ` (+1 ⚡ Cristal: ${S.f.cristais} de 3)`}
function recover(back){S.rec={back,msg:''};go('recupera')}
function cont(id){if(S.down)recover(id);else go(id)}
function backFromRec(){S.down=0;const b=S.rec.back;S.rec=null;S.rematch=1;go(b)}
function recRoll(){
 if(busy)return;
 roll(v=>{const g=v<=2?1:v<=4?2:3;S.hearts=Math.min(S.max,S.hearts+g);
  const fr=['🍓','🍇','🍒','🍎'][v%4];
  S.rec.msg=`🎲 Tirou ${v}! Colheram ${fr.repeat(g)} e ganharam ${g} ❤️!`+(S.hearts>=S.max?'\n\nTodos estão com FORÇA TOTAL! 💪\nA Vovó Coruja deu um abraço em cada um e disse:\n"Agora vocês conseguem!" 🦉':'\n\nAinda estão cansadinhos... Vamos colher mais frutinhas!');
  render()},'1-2: 1 ❤️ · 3-4: 2 ❤️ · 5-6: 3 ❤️');
}
const heroes=()=>[...HEROES,...CH[S.ch].heroes];

let S,busy=0;
const $=id=>document.getElementById(id);
function d6(){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%6+1}
const pick=a=>a[Math.floor(Math.random()*a.length)];
const LAST={};
function pickNew(key,a){let i;do{i=Math.floor(Math.random()*a.length)}while(a.length>1&&i===LAST[key]);LAST[key]=i;return a[i]}
/* Falhas de cada herói, combinando com o jeito de cada um */
const FAILS={
 'Bilu Bilu':['Bilu Bilu foi dar o Abraço de Urso... e abraçou uma árvore! 🌳','Bilu Bilu correu tão rápido que a calça caiu! 👖😳','Bilu Bilu abriu os braços para o abraço e bocejou no meio: UAAAH! 🥱','A barba do Bilu Bilu fez cócegas no nariz dele: ATCHIM! 🧔','Bilu Bilu parou para amarrar o cadarço bem na hora! 👟','Bilu Bilu deu o abraço tão apertado... no ar! Não tinha ninguém ali! 🤗💨'],
 'Pegasus':['Pegasus voou tão alto que passou direto pelo inimigo! 🚀','Pegasus fez o Voo Relâmpago... e bateu numa nuvem de chuva! ☁️💦','Pegasus deu uma pirueta no ar e ficou tontinho! 😵‍💫','A capa do Pegasus cobriu os olhos dele e ele voou pro lado errado! 🦸','Pegasus esqueceu como pousa e caiu de bumbum! 😅','O relâmpago do Pegasus saiu fraquinho: bzzt... ⚡'],
 'Kay':['A Bolha Mágica do Kay estourou antes da hora: PLOC! 🫧','Kay soprou a bolha, mas só saíram bolhinhas pequenininhas! 🫧','A bolha do Kay ficou tão grande que ele ficou preso dentro dela! 🫧😂','Kay mirou, mirou... e a bolha voou pra trás! 🔙','A bolha do Kay foi devagarinho... e o inimigo desviou! 🐌','Kay foi soprar a bolha e deu um soluço: HIC! 😮'],
 'Faísca':['Faísca foi soprar fogo, mas só saiu fumacinha: puf, puf! 💨','Faísca soluçou e saíram bolhas de sabão em vez de fogo! 🫧','Faísca bateu as asas forte demais e voou de ré! 🐲','Faísca espirrou faíscas pra todo lado, menos no inimigo! ✨','O rabo do Faísca enroscou numa árvore! 🌳'],
 'Pipoca':['Pipoca deu a Pirueta Splash... e caiu de barriga na água: PLOFT! 💦','Pipoca pulou tão alto que foi parar numa nuvem! ☁️','Pipoca se distraiu brincando com uma bolinha de espuma! ⚪','Pipoca fez a pirueta ao contrário e ficou tonto! 🌀','Pipoca parou o ataque para dar risada de golfinho: IIIH IIIH! 🐬'],
 'Estrelinha':['O brilho da Estrelinha piscou e apagou bem na hora! 💡','A Estrelinha brilhou tão forte que os amigos é que ficaram sem enxergar! 😎','A Estrelinha girou no ar e ficou rodando igual pião! 🌀','Uma nuvem passou na frente da Estrelinha e escondeu o brilho! ☁️','A Estrelinha caiu do céu, PLIM, e ficou de ponta-cabeça! 🙃'],
 'Tritri':['Tritri foi dar a chifrada e o chifre ficou preso numa árvore! 🌳','Tritri correu e tropeçou no próprio rabo! 🦕','Tritri parou no meio do caminho para comer uma folhinha! 🌿','Tritri errou a mira e deu uma chifrada numa pedra: TOC! 🪨','Tritri ficou com vergonha e se escondeu atrás do Bilu Bilu! 🙈'],
 'Pirulito':['O Pirulito jogou a torta... e ela voltou na cara dele! SPLAT! 🥧','O sapato gigante do Pirulito enroscou e ele caiu! 👞','A flor do Pirulito espirrou água... na cara dele mesmo! 🌼💦','O Pirulito tropeçou na própria gravata de bolinhas! 🤡','O Pirulito começou a fazer malabarismo e esqueceu de atacar! 🤹'],
 'Picolé':['Picolé escorregou de barriga... para o lado errado! 🐧💨','Picolé bateu as asinhas para voar... mas pinguim não voa! 😅','Picolé parou para comer um peixinho! 🐟','Picolé escorregou tão rápido que passou direto e afundou na neve! ⚪','Picolé foi andando balançando, de um lado pro outro... e demorou demais! 🐧'],
 'Fofão':['Fofão deu o Abraço Fofinho, mas é tão fofinho que o inimigo nem sentiu! ☁️','Uma costura do Fofão abriu e saiu um pouquinho de algodão! 🧵','Fofão ficou com sono no meio do ataque e deitou! 😴','Fofão caiu sentado no bumbum fofinho: PUF! 🧸','O olho de botão do Fofão ficou torto e ele não enxergou nada! 👀'],
 'Brisa':['A Brisa galopou tão rápido que passou direto! 🦄💨','O chifre da Brisa soltou um arco-íris... para o lado errado! 🌈','A Brisa parou para pentear a crina! 💇','A Brisa relinchou tão alto que assustou os próprios amigos! 🦄','A Brisa pisou numa nuvem fofa e afundou! ☁️']
};
function star(){S.stars++;return ' (+1 ⭐)'}
function hurt(){
 S.hearts--;if(S.hearts>0)return ' (-1 ❤️)';
 if(S.fadas<3){S.fadas++;S.hearts=3;return ` (-1 ❤️)\n\n🧚 A Fada Luzinha apareceu e deu 3 corações de volta! (ajuda ${S.fadas} de 3)`+(S.fadas===3?'\nEssa foi a última ajuda da fada! Cuidado!':'')}
 S.hearts=0;S.down=1;return ' (-1 ❤️)\n\n😴 Os heróis ficaram sem nenhuma força...\nA fada já ajudou 3 vezes. Hora de descansar!';
}
function newGame(ch){S={hearts:5,max:5,stars:0,f:{},inv:{},die:6,ch,fadas:0,down:0,cnt:null}}
function count(){S.cnt.n++;return ` (+1 ${S.cnt.icon}: ${S.cnt.n} de ${S.cnt.of})`}
function reset(){newGame(1);go('menu')}
function go(id){
 if(typeof id==='function')id=id();
 S.scene=id;S.extra='';S.t=null;S.retried=0;S.festou=0;S.mj=null;
 const sc=SC[id];
 if(sc.enter)S.extra=sc.enter();
 if(sc.mini)S.mj=miniNovo(sc.mini);
 if(sc.battle)S.b={hp:sc.battle.hp,msg:(S.rematch?'💪 Os heróis voltaram descansados! Hora da REVANCHE!\n\n':'')+sc.battle.intro,done:0,bonus:0};
 S.rematch=0;
 render();window.scrollTo(0,sc.menu?Math.max(0,(window._mapY||0)-220):0);
}
const PIPS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function dieHTML(v){return `<div class="die" id="die">${[...Array(9)].map((_,i)=>`<div class="pip ${PIPS[v].includes(i)?'on':''}"></div>`).join('')}</div>`}
function setDie(v){$('die').querySelectorAll('.pip').forEach((p,i)=>p.classList.toggle('on',PIPS[v].includes(i)))}
function roll(cb,dica){
 if(dadoFisico()){pedirDado(cb,dica);return}
 busy=1;document.querySelectorAll('button').forEach(b=>b.disabled=true);tocar('dado');
 const el=$('die');el.classList.remove('roll');void el.offsetWidth;el.classList.add('roll');
 let n=0;const it=setInterval(()=>{setDie(d6());if(++n>=10){clearInterval(it);const v=d6();setDie(v);S.die=v;setTimeout(()=>{busy=0;cb(v)},350)}},85);
}
function hud(){
 const h='❤️'.repeat(S.hearts)+'🤍'.repeat(Math.max(0,S.max-S.hearts));
 const bag=[S.f.cenoura&&!S.f.cenouraUsada?'🥕 Cenoura Mágica':'',S.f.concha?'🐚 Concha de Luz':'',S.f.po&&!S.f.poUsado?'🌟 Pó de Estrela':'',S.f.vaga?'✨ Vaga-lumes':'',S.f.buzio&&!S.f.buzioUsado?'🐚 Búzio Mágico':'',WORLD==='reino'&&S.ch===4?`⚡ Cristais ${S.f.cristais||0}/3`:'',S.f.chave?'🪛 Chave Dourada':'',...Object.keys(S.inv).filter(k=>S.inv[k]===1).map(k=>ITEMS[k].name),S.cnt?`${S.cnt.icon} ${S.cnt.n}/${S.cnt.of}`:''].filter(Boolean).join(' · ');
 const B=SC[S.scene].battle,mini=B&&S.b?`<div class="mini" id="mini"><span>${B.face} ${B.name}</span><span>${'💜'.repeat(S.b.hp)}${'🤍'.repeat(Math.max(0,B.hp-S.b.hp))}</span></div>`:'';
 return `<div class="hudfix"><div class="hud"><span class="hearts">${h}</span><span>⭐ ${S.stars} · 🧚 ${3-S.fadas}</span></div>${mini}</div><div class="bag">${bag?'Mochila: '+bag:''}</div>`;
}
/* corações da equipe ficam fixos no topo (.hudfix); a barra do inimigo (#mini) só aparece quando o cartão dele saiu da tela */
let _vigia=null;
function vigiaInimigo(){
 if(_vigia){_vigia.disconnect();_vigia=null}
 const m=$('mini'),e=document.querySelector('.enemy');
 if(!m||!e)return;
 if(!window.IntersectionObserver){m.classList.add('on');return}
 _vigia=new IntersectionObserver(([x])=>m.classList.toggle('on',!x.isIntersecting),{rootMargin:'-110px 0px 0px 0px'});
 _vigia.observe(e);
}
function tools(){return `<div class="tools"><button onclick="speak()">🔊 Ler em voz alta</button><button onclick="if(window._c){reset()}else{window._c=1;this.textContent='Toque de novo p/ recomeçar';setTimeout(()=>window._c=0,2500)}">🔄 Recomeçar</button></div><div class="tools">${botaoSom()}</div>`}
function txt(t){return typeof t==='function'?t():t}

/* ===== Progresso e mapa das fases ===== */
const ICON={1:'🌈',2:'🌙',3:'🐚',4:'🚀',5:'🦖',6:'🎪',7:'⛄',8:'🧸',9:'🦄',10:'👑',11:'🍬',12:'💖'};
const BAND={1:'#c8f2c0',2:'#cfcaf7',3:'#a9e3ff',4:'#3b3f86',5:'#b5e396',6:'#ffd0e0',7:'#eef7ff',8:'#ffe6b8',9:'#e4d4ff',10:'#ffe08a'};
const NODEBG={1:'#7bd389',2:'#8f86e8',3:'#4fb8ee',4:'#262a63',5:'#6cbf4a',6:'#ff7aa2',7:'#9fd3ff',8:'#ffb547',9:'#b896ff',10:'#ffc83d',11:'#ff8fc7',12:'#ff5c8a'};
const DECO={1:['🌳','🌸'],2:['🌙','✨'],3:['🐟','🌊'],4:['🪐','⭐'],5:['🌋','🌴'],6:['🎈','🎠'],7:['❄️','🏔️'],8:['🪀','🎲'],9:['☁️','💤'],10:['🎉','🎆']};
let PROG={};
function loadProg(){
 try{ALLPROG=JSON.parse(localStorage.getItem('rpg_mundos_prog')||'null');
  if(!ALLPROG){const old=JSON.parse(localStorage.getItem('rpg_bilu_prog')||'{}')||{};ALLPROG={reino:old};localStorage.setItem('rpg_mundos_prog',JSON.stringify(ALLPROG))}}catch(e){ALLPROG=ALLPROG||{}}
 PROG=ALLPROG[WORLD]||(ALLPROG[WORLD]={});
}
function saveProg(){ALLPROG[WORLD]=PROG;try{localStorage.setItem('rpg_mundos_prog',JSON.stringify(ALLPROG))}catch(e){}}
function markDone(ch,stars){window._sel=0;const p=PROG[ch];if(!p||stars>p.stars){PROG[ch]={done:1,stars:Math.max(stars,p?p.stars:0)};saveProg()}}
/* ===== Amizades: final triste tira o amigo das próximas aventuras ===== */
const FRIEND={faisca:['o Faísca',1],bruxa:['a Bruxa Trapalhona',2],pirata:['o Pirata Barba-de-Algodão-Doce',3],robo:['o Robô Parafuso',4],magico:['o Mágico Risonho',6],boneco:['o Boneco de Neve',7],arrumadinho:['o Senhor Arrumadinho',8],bocejo:['o Guardião dos Sonhos',9],rei:['o Rei Cinzento',10],formiga:['a Rainha Formiga',11],borracha:['a Borracha Amiga',12]};
function amigo(k){return !(PROG.lost&&PROG.lost[k])}
const capz=t=>t[0].toUpperCase()+t.slice(1);
function lockInfo(n){const c=CH[n];if(!c||!c.needs)return null;const m=c.needs();if(!m.length)return null;
 return{txt:m.map(k=>k.split('|').map(x=>`${FRIEND[x][0]} (Capítulo ${FRIEND[x][1]})`).join(' ou ')).join(' e '),ch:FRIEND[m[0].split('|')[0]][1]}}
function festa3(){const a=[];if(amigo('faisca'))a.push('o Faísca está enchendo balões');if(amigo('bruxa'))a.push('a Bruxa Trapalhona está fazendo pizza');return a.length?capz(a.join(' e '))+'. 🍕':'Todo mundo está enfeitando o castelo. 🎈'}
function festa10(){return [['faisca','🐲 o Faísca acendeu os fogos de artifício'],['bruxa','🧙‍♀️ a Bruxa fez pizza'],['pirata','🏴‍☠️ o Pirata trouxe algodão-doce'],['robo','🤖 o Robô Parafuso enfeitou tudo de luzinhas'],[0,'🦖 a Mamãe Rex e o Bolinha dançaram (e o chão tremeu de alegria!)'],['magico','🎩 o Mágico Risonho fez mágica'],['boneco','⛄ o Boneco de Neve fez sorvete'],[0,'🦄 a Brisa trouxe sonhos bonitos']].filter(x=>!x[0]||amigo(x[0])).map(x=>x[1]).join('\n')+'\n'}
function startCh(n){if(CH[n].soon||lockInfo(n)){window._sel=n;go('menu');return}newGame(n);go(CH[n].start)}
function resetProg(btn){
 if(btn.dataset.c){PROG={};ALLPROG[WORLD]=PROG;saveProg();window._sel=0;render();window.scrollTo(0,0);return}
 btn.dataset.c=1;btn.textContent='⚠️ Toque de novo para apagar todas as estrelas';
 setTimeout(()=>{if(btn.isConnected){delete btn.dataset.c;btn.textContent='🔄 Reiniciar fases'}},3000);
}
/* ===== Mundos ===== */
let WORLD='reino',ALLPROG={};
const WORLDS={
 reino:{id:'reino',name:'Reino das Cores',icon:'🌈',desc:'Bilu Bilu, Pegasus e Kay protegem o Reino das Cores com seus amigos.',bg:'linear-gradient(135deg,#7cd36b,#4fb8ee 60%,#ffd95e)',
  heroes:HEROES,chapters:CH,
  planet:{x:160,y:265,r:82,label:'Reino das Cores',sea:'#3a9fd8',dark:'#1d4f8a',glow:'#7cd36b',ring:['#ff5c5c','#ffb547','#ffe066','#7cd36b','#4fb8ee','#9f7bff'],top:'🏰',
   lands:[[-.45,-.15,.42,.3,'#7cd36b'],[.35,.3,.38,.26,'#7cd36b'],[.2,-.5,.25,.15,'#f2c57a'],[-.2,.55,.3,.14,'#ffd95e'],[.55,-.15,.18,.22,'#ffc2d6']],
   deco:[['🌳',-.5,-.18,.22],['🌋',.22,-.5,.2],['🎪',.55,-.12,.16],['🌴',.35,.28,.2],['☁️',-.1,.15,.22]]},
  map:{h:770,sea:'#3a9fd8',startIcon:'🏰',trophy:15,icons:ICON,colors:NODEBG,
   path:[[90,688,0],[60,615,0],[115,540,0],[55,455,0],[58,342,1],[90,265,0],[180,170,1],[262,150,0],[318,135,0],[335,282,1],[320,368,0],[290,425,0],[340,530,1],[300,628,0],[255,675,0],[325,705,0]],
   nodes:{1:1,2:2,3:3,4:5,5:6,6:8,7:9,8:11,9:12,10:14},
   islands:[
  {pts:'25,345 150,335 160,420 148,520 160,600 155,725 30,730 18,600 30,480',top:'#7cd36b',edge:'#5fb54f'},
  {pts:'25,215 60,95 150,70 235,90 245,190 205,250 120,262 35,300',top:'#f2c57a',edge:'#d9a556'},
  {pts:'262,80 380,70 390,200 378,328 275,322 258,200',top:'#ffc2d6',edge:'#f19ab8'},
  {pts:'240,382 385,372 390,588 300,598 236,560',top:'#d9c8ff',edge:'#b9a2f2'},
  {pts:'195,632 322,616 362,642 366,736 198,742',top:'#ffd95e',edge:'#e9bb2f'}],
   rocks:[[192,395],[206,410],[180,600],[372,618],[214,560],[12,710]],
   overlay:poly=>poly('268,240 384,232 376,326 278,320','#f4fbff',0)+`<ellipse cx="108" cy="468" rx="24" ry="13" fill="#4fb8ee" stroke="#d8f2ff" stroke-width="3"/><circle cx="90" cy="265" r="27" fill="#5b5f9e" opacity=".55"/>`,
   deco:[['🌳',35,565,22],['🌲',140,612,22],['🌸',108,650,15],['🌳',138,470,19],['🌙',128,400,20],['✨',40,392,13],['🐬',108,474,14],
  ['🌋',200,118,36],['🌴',48,200,22],['🌴',150,240,18],['🦴',215,215,15],['⭐',115,105,12],
  ['🎈',365,112,18],['🎠',280,195,20],['🏔️',366,300,22],['❄️',284,262,13],
  ['🎲',258,478,16],['🪀',372,438,16],['☁️',272,570,18],['💤',376,575,13],['🌈',262,400,16],
  ['🎉',218,725,16],['🎆',352,662,15],
  ['⛵',205,312,22],['🐟',198,520,14],['🐙',215,455,20]],
   extra:{after:10,h:925,label:'✨ CAPÍTULOS ESPECIAIS ✨',path:[[300,842,0],[205,858,0],[105,845,0]],nodes:{11:16,12:18},
    islands:[{pts:'35,800 365,792 382,895 30,902',top:'#ffd1ec',edge:'#f5a8d4'}],
    deco:[['🏭',360,820,22],['🍭',250,815,16],['🎀',350,885,15],['📖',45,880,20],['🖍️',165,815,16],['🌈',60,815,16],['💖',225,895,13],['✨',140,890,13]]}
  }
 }
};
function enterWorld(w){WORLD=w;const W=WORLDS[w];CH=W.chapters;HEROES=W.heroes;PROG=ALLPROG[w]||(ALLPROG[w]={});window._sel=0}
function mapHTML(){
 const M=WORLDS[WORLD].map,base=Object.keys(CH).map(Number).filter(n=>!CH[n].special),extra=!!(M.extra&&PROG[M.extra.after]),ids=Object.keys(CH).map(Number).filter(n=>!CH[n].special||extra),doneN=ids.filter(n=>PROG[n]).length,next=ids.find(n=>!PROG[n]&&!CH[n].soon),all=base.every(n=>PROG[n]),MH=extra?M.extra.h:M.h,ICON=M.icons,NODEBG=M.colors;
 if(!ids.includes(window._sel))window._sel=next||ids[ids.length-1];
 const sel=window._sel;
 /* caminho: [x,y,ponte até o próximo ponto] */
 const P=M.path.map(q=>[...q]);
 const NODE={...M.nodes,...(extra?M.extra.nodes:{})};
 if(extra){P[M.trophy][2]=1;P.push(...M.extra.path.map(q=>[...q]))}
 const ISL=[...M.islands,...(extra?M.extra.islands:[])];
 const poly=(pts,fill,dy,extra='')=>`<polygon points="${pts}" fill="${fill}" stroke="${fill}" stroke-width="18" stroke-linejoin="round" transform="translate(0,${dy})" ${extra}/>`;
 let s=`<svg class="wmap" viewBox="0 0 400 ${MH}" xmlns="http://www.w3.org/2000/svg">
<defs><pattern id="wv" width="44" height="26" patternUnits="userSpaceOnUse"><path d="M4 13 q6 -6 12 0 M26 24 q6 -6 12 0" stroke="#ffffff40" stroke-width="2" fill="none" stroke-linecap="round"/></pattern></defs>
<rect class="bgfill" width="400" height="${MH}" fill="${M.sea}"/><rect class="bgfill" width="400" height="${MH}" fill="url(#wv)"/>`;
 /* nuvens nas bordas */
 for(const [x,y,r] of [[0,20,34],[40,0,26],[400,30,36],[360,0,24],[0,MH,38],[45,MH,26],[400,MH-10,34],[170,0,20]])s+=`<ellipse class="cloud" cx="${x}" cy="${y}" rx="${r*1.5}" ry="${r}" fill="#fff" opacity=".9"/>`;
 /* pedrinhas no mar */
 for(const [x,y] of M.rocks)s+=`<path d="M${x-7} ${y+5} L${x} ${y-8} L${x+7} ${y+5}Z" fill="#9fb3c2" stroke="#e8f3f9" stroke-width="1.5"/>`;
 /* ilhas com penhasco */
 for(const I of ISL)s+=poly(I.pts,'#9c5524',20)+poly(I.pts,'#c6773a',10)+poly(I.pts,I.edge,3)+poly(I.pts,I.top,0);
 /* neve na ilha do circo/inverno + lago na ilha verde + base do foguete */
 if(M.overlay)s+=M.overlay(poly);
 /* caminho */
 for(let i=0;i<P.length-1;i++){const [x1,y1,b]=P[i],[x2,y2]=P[i+1];
  s+=b?`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7a4a22" stroke-width="13" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c58b4e" stroke-width="10" stroke-dasharray="3 3"/>`
   :`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff3c4" stroke-width="10" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d9a75f" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`}
 /* enfeites temáticos */
 const D=[...M.deco,...(extra?M.extra.deco:[])];
 for(const [e,x,y,z] of D)s+=`<text x="${x}" y="${y}" font-size="${z}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
 /* início e troféu */
 s+=`<text x="${P[0][0]}" y="${P[0][1]-4}" font-size="30" text-anchor="middle" dominant-baseline="central">${M.startIcon}</text><text x="${P[0][0]}" y="${P[0][1]+20}" font-size="10" font-weight="800" text-anchor="middle" fill="#2f5d2a">INÍCIO</text>`;
 const T=P[M.trophy];
 s+=`<g opacity="${all?1:.45}"><text x="${T[0]}" y="${T[1]-3}" font-size="30" text-anchor="middle" dominant-baseline="central">🏆</text></g>`;
 if(all)s+=`<circle cx="${T[0]}" cy="${T[1]}" r="22" fill="none" stroke="#fff" stroke-width="3"><animate attributeName="r" values="18;28;18" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/></circle>`;
 /* fases */
 for(const n of ids){const [x,y]=P[NODE[n]],p=PROG[n];
  s+=`<g class="lv" onclick="selCh(${n})" transform="translate(${x},${y})">`;
  if(n===next)s+=`<circle r="22" fill="#fff"><animate attributeName="r" values="20;31;20" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0;.8" dur="1.4s" repeatCount="indefinite"/></circle>`;
  const lk=lockInfo(n)||CH[n].soon;if(lk)s+=`<g opacity=".55">`;
  s+=`<circle r="20" cy="3" fill="#0003"/><circle r="19" fill="${NODEBG[n]}" stroke="${p?'#ffc21a':'#fff'}" stroke-width="4"/>`;
  s+=`<text y="1" font-size="19" text-anchor="middle" dominant-baseline="central">${ICON[n]}</text>`;
  s+=`<rect x="-9" y="13" width="18" height="12" rx="6" fill="#7b5cff" stroke="#fff" stroke-width="1.5"/><text y="19.5" font-size="9" font-weight="800" fill="#fff" text-anchor="middle" dominant-baseline="central">${n}</text>`;
  if(lk)s+=`</g>`+(CH[n].soon?'':`<text x="15" y="10" font-size="15" text-anchor="middle" dominant-baseline="central">🔒</text>`);
  if(p)s+=`<text x="15" y="-15" font-size="15" text-anchor="middle" dominant-baseline="central">⭐</text>`;
  if(n===sel)s+=`<circle r="25" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="5 4"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite"/></circle>`;
  s+=`</g>`}
 /* heróis em cima da fase escolhida */
 const [hx,hy]=P[NODE[sel]];
 s+=`<g transform="translate(${hx},${hy-34})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur=".8s" repeatCount="indefinite"/><rect x="-31" y="-11" width="62" height="22" rx="11" fill="#ffffffd9"/><text font-size="15" text-anchor="middle" dominant-baseline="central">${HEROES.map(x=>faceDe(x)).join('')}</text></g></g>`;
 if(extra)s+=`<text x="205" y="${MH-12}" font-size="11" font-weight="800" text-anchor="middle" fill="#b0307a">${M.extra.label}</text>`;
 s+=`</svg>`;
 const p=PROG[sel];
 let h=`<div class="maptop"><button class="back" onclick="go('mundos')">⬅ Mundos</button><div class="title">${WORLDS[WORLD].icon} ${WORLDS[WORLD].name}</div><div class="mapsub">⭐ ${doneN} de ${ids.length} fases concluídas</div>${extra&&!PROG[11]&&!PROG[12]?'<div class="unlock">✨ Novos capítulos especiais desbloqueados! ✨</div>':''}</div>`;
 h+=`<div class="split"><div class="pmap"><div class="wwrap">${s}</div></div><div class="pside">`;
 h+=`<div class="lvcard"><div class="lvn">${CH[sel].special?'✨ Capítulo especial '+sel:'Fase '+sel}</div><div class="lvt">${ICON[sel]} ${CH[sel].title}</div>${(()=>{if(CH[sel].soon)return `<div class="lvs">✨ Em breve</div><div class="fbox">Um capítulo extra vai chegar aqui! Novas aventuras estão sendo preparadas...</div>`;const L=lockInfo(sel);return L?`<div class="lvs">🔒 Fase bloqueada</div><div class="fbox sad">Para jogar esta fase, ${L.txt} precisa ser amigo da equipe. Jogue o Capítulo ${L.ch} de novo e escolha o final feliz!</div><button class="btn" onclick="startCh(${L.ch})">▶ Jogar o Capítulo ${L.ch}</button>`:`<div class="lvs">${p?(p.stars?`⭐ Concluída com ${p.stars} estrelas`:'✓ Concluída'):'Ainda não jogada'}</div><button class="btn go" onclick="startCh(${sel})">▶ Jogar!</button>`})()}<div class="lvhint">Toque numa fase do mapa para escolher</div></div>`;
 h+=`<button class="btn reset" onclick="abrirAlbum()">📒 Álbum de amigos</button><button class="btn reset" onclick="resetProg(this)">🔄 Reiniciar fases</button>`;
 h+=`<div class="adj"><button class="adjlink" onclick="this.nextElementSibling.hidden=!this.nextElementSibling.hidden">⚙️ já jogamos algumas fases</button><div hidden class="adjbox">Em qual fase vocês estão?<br><small>As fases antes dela ficam marcadas como concluídas.</small><div class="adjgrid">${ids.map(n=>`<button onclick="startFrom(${n})">${n}</button>`).join('')}</div></div></div>`;
 h+=`</div></div>`;
 window._mapY=0;
 return h;
}
function selCh(n){window._sel=n;render()}
SC.mundos={mundos:1};SC.album={album:1};
function planetSVG(id,P,sel){
 const {x,y,r}=P;let g='';
 g+=`<defs><radialGradient id="pg_${id}" cx="34%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".3" stop-color="${P.sea}"/><stop offset="1" stop-color="${P.dark}"/></radialGradient>
<radialGradient id="ps_${id}" cx="30%" cy="25%" r="95%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0630" stop-opacity=".55"/></radialGradient>
<clipPath id="pc_${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs>`;
 g+=`<circle cx="${x}" cy="${y}" r="${r+18}" fill="${P.glow||P.sea}" opacity=".18"/>`;
 const ring=(front)=>{if(!P.ring)return '';let o='';P.ring.forEach((c,i)=>{const rx=r*1.62+i*4,ry=r*.36+i*1.2;
  o+=front?`<path d="M${x-rx} ${y} A${rx} ${ry} 0 0 0 ${x+rx} ${y}" fill="none" stroke="${c}" stroke-width="4" transform="rotate(-16 ${x} ${y})"/>`
  :`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${c}" stroke-width="4" opacity=".85" transform="rotate(-16 ${x} ${y})"/>`});return o};
 g+=ring(false);
 g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#pg_${id})"/>`;
 g+=`<g clip-path="url(#pc_${id})">`;
 for(const [dx,dy,rx,ry,c] of (P.lands||[]))g+=`<ellipse cx="${x+dx*r}" cy="${y+dy*r}" rx="${rx*r}" ry="${ry*r}" fill="${c}"/>`;
 for(const [dx,dy,rr] of (P.craters||[]))g+=`<circle cx="${x+dx*r}" cy="${y+dy*r}" r="${rr*r}" fill="#0002" stroke="#fff3" stroke-width="2"/>`;
 for(const [e,dx,dy,z] of (P.deco||[]))g+=`<text x="${x+dx*r}" y="${y+dy*r}" font-size="${z*r}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
 g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#ps_${id})"/></g>`;
 g+=ring(true);
 if(P.top)g+=`<text x="${x}" y="${y-r-r*.12}" font-size="${r*.5}" text-anchor="middle" dominant-baseline="central">${P.top}</text>`;
 if(P.mystery)g+=`<text x="${x}" y="${y+2}" font-size="${r*1.1}" font-weight="800" fill="#ffffffcc" text-anchor="middle" dominant-baseline="central">?</text>`;
 if(sel){g+=`<circle cx="${x}" cy="${y}" r="${r+16}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 6"><animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur="12s" repeatCount="indefinite"/></circle>`;
  g+=`<g><animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur="7s" repeatCount="indefinite"/><text x="${x}" y="${y-r-30}" font-size="22" text-anchor="middle" dominant-baseline="central" transform="rotate(90 ${x} ${y-r-30})">🚀</text></g>`}
 g+=`<text x="${x}" y="${y+r+(P.ring?30:24)}" font-size="15" font-weight="800" fill="#fff" text-anchor="middle" style="paint-order:stroke" stroke="#1a1446" stroke-width="4">${P.label}</text>`;
 return `<g class="lv" onclick="selWorld('${id}')">${g}</g>`;
}
const MYSTERY=[{x:322,y:390,r:42,sea:'#9a8fb5',dark:'#4b3f6b',ring:['#ffffff55'],craters:[[.3,-.3,.2],[-.35,.2,.16]],mystery:1,label:'Em breve'},
 {x:78,y:470,r:28,sea:'#8a9aa8',dark:'#45566a',craters:[[.2,.2,.25]],mystery:1,label:'Em breve'}];
function selWorld(w){window._wsel=w;render()}
function worldsHTML(){
 if(!window._wsel)window._wsel=WORLD;
 const sel=window._wsel;
 let s=`<svg class="wmap" viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140f3d"/><stop offset="1" stop-color="#2d1b5e"/></linearGradient><filter id="blr" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter></defs>
<rect class="bgfill" width="400" height="560" fill="url(#sky)"/>
<ellipse cx="300" cy="250" rx="120" ry="60" fill="#ff5ca8" opacity=".22" filter="url(#blr)"/><ellipse cx="90" cy="120" rx="110" ry="55" fill="#4fb8ee" opacity=".22" filter="url(#blr)"/><ellipse cx="220" cy="500" rx="140" ry="50" fill="#9f7bff" opacity=".25" filter="url(#blr)"/>`;
 let seed=7;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
 for(let i=0;i<70;i++){const x=rnd()*400,y=rnd()*560,r=rnd()*1.6+.4,tw=i%4===0;
  s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(.4+rnd()*.6).toFixed(2)}">${tw?`<animate attributeName="opacity" values="1;.2;1" dur="${(2+rnd()*3).toFixed(1)}s" repeatCount="indefinite"/>`:''}</circle>`}
 s+=`<g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0;.05;.12;1" dur="7s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;160 70;160 70" keyTimes="0;.12;1" dur="7s" repeatCount="indefinite"/><line x1="40" y1="40" x2="80" y2="58" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>`;
 for(const [i,M] of MYSTERY.entries())s+=planetSVG('m'+i,M,sel==='m'+i);
 for(const w in WORLDS)s+=planetSVG(w,WORLDS[w].planet,sel===w);
 s+=`</svg>`;
 let h=`<div class="maptop"><div class="title">🌌 Galáxia das Aventuras</div><div class="mapsub">Toque num planeta para escolher o mundo</div></div><div class="split"><div class="pmap"><div class="wwrap">${s}</div></div><div class="pside">`;
 if(window._ed)h+=editorNomesHTML();
 else if(WORLDS[sel]){const W=WORLDS[sel],pr=ALLPROG[sel]||{},base=Object.keys(W.chapters).filter(n=>!W.chapters[n].special),d=base.filter(n=>pr[n]).length;
  h+=`<div class="lvcard"><div class="lvn">Planeta</div><div class="lvt">${W.icon} ${W.name}</div><div class="lvs">${W.desc}</div><div class="wheroes">${W.heroes.map(x=>faceDe(x)).join(' ')}</div><div class="lvs">⭐ ${d} de ${base.length} fases${d===base.length?' · 🏆':''}</div><button class="btn go" onclick="enterWorld('${sel}');go('menu')">🚀 Viajar para este mundo!</button></div><button class="btn reset" onclick="abrirAlbum()">📒 Álbum de amigos</button><button class="btn reset" onclick="abrirNomes()">✏️ Personalizar nomes e dado</button><div class="somlinha">${botaoSom()}</div>`}
 else h+=`<div class="lvcard"><div class="lvn">Planeta misterioso</div><div class="lvt">❓ Em breve</div><div class="lvs">Um novo mundo, com novos heróis e aventuras, está sendo criado...</div></div>`;
 h+=`</div></div>`;
 return h;
}
function startFrom(n){for(const k of Object.keys(CH).map(Number))if(k<n&&!PROG[k])PROG[k]={done:1,stars:0,skip:1};saveProg();window._sel=n;go('menu')}

function render(){
 const sc=SC[S.scene];
 $('app').className='wrap'+(sc.mundos?' wide gal':sc.menu?' wide map':'');if(sc.menu)$('app').style.setProperty('--sea',WORLDS[WORLD].map.sea);
 if(sc.album){$('app').className='wrap alb';$('app').innerHTML=nomes(albumHTML());window.scrollTo(0,0);return}
 if(sc.mundos){$('app').innerHTML=nomes(worldsHTML());return}
 if(sc.menu){$('app').innerHTML=nomes(mapHTML());return}
 let h=hud();
 if(sc.battle){
  const B=sc.battle,b=S.b;
  h+=`<div class="enemy"><div class="face" id="ef">${B.face}</div><div class="nm">${B.name}</div><div class="hp">${'💜'.repeat(b.hp)}${'🤍'.repeat(B.hp-b.hp)}</div></div>`;
  h+=`<div class="story msg" id="narr">${b.msg}</div>${dieHTML(S.die)}`;
  if(S.down)h+=`<button class="btn go" onclick="recover('${S.scene}')">😴 Ir descansar na cabana ➜</button>`;
  else if(b.done)h+=`<button class="btn go" onclick="go('${B.next}')">Continuar a aventura ➜</button>`;
  else{
   if(S.f.cenoura&&!S.f.cenouraUsada)h+=b.bonus?`<div class="ask">🥕 Cenoura pronta: +1 no próximo dado!</div>`:`<button class="btn carrot" onclick="S.b.bonus=1;S.f.cenouraUsada=1;render()">🥕 Usar a Cenoura Mágica (+1)</button>`;
   if(S.f.buzio&&!S.f.buzioUsado)h+=`<button class="btn carrot" onclick="buzio()">🐚 Tocar o Búzio Mágico (tira 2 💜)</button>`;
   if(S.f.po&&!S.f.poUsado&&S.hearts<S.max)h+=`<button class="btn carrot" onclick="S.f.poUsado=1;S.hearts=Math.min(S.max,S.hearts+2);S.b.msg='🌟 Vocês jogaram o Pó de Estrela e ganharam 2 ❤️! Brilhou tudo! ✨';render()">🌟 Usar o Pó de Estrela (+2 ❤️)</button>`;
   for(const k in S.inv){const it=ITEMS[k];if(S.inv[k]!==1||(it.type==='heal'&&S.hearts>=S.max)||(it.type==='bonus'&&b.bonus)||(it.type==='shield'&&b.shield))continue;
    h+=`<button class="btn carrot" onclick="useItem('${k}')">Usar ${it.name} (${it.desc})</button>`}
   if(b.shield)h+=`<div class="ask">🛡️ Proteção ativada!</div>`;
   const H=heroes();
   h+=`<div class="ask">Quem vai atacar? 🎲</div><div class="heroes" style="grid-template-columns:repeat(${H.length===4?2:3},1fr)">${H.map((x,i)=>`<button class="hero" onclick="attack(${i})"><b>${faceDe(x)}</b>${x.name}<small>${x.move}</small></button>`).join('')}</div>`;
   h+=`<div class="rules">🎲 1-2: errou · 3-4: acertou · 5-6: SUPER ataque!<br>Tirou 6? Ganha ⭐</div>`;
  }
 } else if(sc.test){
  const T=sc.test;
  h+=`<div class="art">${T.art}</div>`;
  if(S.t&&S.t.retry){h+=`<div class="story" id="narr"><b class="bad">🎲 Tirou ${S.t.v}... Quase! 😮</b>\n\nNão desiste! Vocês têm mais uma chance!\nPrecisa tirar ${T.need} ou mais. 💪</div>${dieHTML(S.die)}<button class="btn" onclick="test()">🎲 Tentar mais uma vez!</button>`}
  else if(!S.t){h+=`<div class="story" id="narr">${T.text}</div>${dieHTML(S.die)}<button class="btn" onclick="test()">🎲 Rolar o dado!</button>`}
  else{const r=S.t;h+=`<div class="story" id="narr"><b class="${r.ok?'good':'bad'}">🎲 Tirou ${r.v}! ${r.ok?'Conseguiu! 🎉':'Ihhh, não deu... 😅'}</b>\n\n${r.text}</div>${dieHTML(S.die)}<button class="btn go" onclick="cont('${r.go}')">${S.down?'😴 Ir descansar na cabana ➜':'Continuar ➜'}</button>`}
 } else if(sc.mini){
  const m=sc.mini,J=S.mj;
  h+=`<div class="art">${m.art}</div>${m.title?`<div class="title">${m.title}</div>`:''}`;
  if(J.done)h+=`<div class="story" id="narr">${J.ajudou?'🧚 A Fada Luzinha deu uma forcinha!\n\n':''}${m.ok}${J.extra?`\n\n<b class="good">${J.extra.trim()}</b>`:''}</div><button class="btn go" onclick="go('${m.next}')">Continuar ➜</button>`;
  else h+=`<div class="story" id="narr">${m.text}</div><div id="mj" class="mj">${miniHTML()}</div>`;
 } else if(sc.rec){
  const full=S.hearts>=S.max;
  h+=`<div class="art">🏡🦉🍓</div><div class="title">Cabana da Vovó Coruja</div><div class="story" id="narr">${S.rec.msg||'Os heróis estavam muito cansados... 😴\nA Vovó Coruja 🦉 levou todo mundo para a cabana dela.\n\n"Descansem e comam frutinhas mágicas para ficar fortes!"\n\n(Hora de beber água e se espreguiçar de verdade! 🥤🙆)\n\nRole o dado para colher frutinhas:\n1-2 = 1 ❤️ · 3-4 = 2 ❤️ · 5-6 = 3 ❤️'}</div>${dieHTML(S.die)}`;
  h+=full?`<button class="btn go" onclick="backFromRec()">💪 Voltar para a aventura!</button>`:`<button class="btn" onclick="recRoll()">🎲 Colher frutinhas!</button>`;
 } else {
  h+=`<div class="art">${sc.art}</div>${sc.title?`<div class="title">${sc.title}</div>`:''}<div class="story" id="narr">${txt(sc.text)}${S.extra?`\n\n<b class="good">${S.extra.trim()}</b>`:''}</div>`;
  if(sc.end){
   let fmsg='';const novo=sc.gain&&!figuraGanha(sc.gain);
   if(sc.lose||sc.gain){PROG.lost=PROG.lost||{};
    if(sc.lose){PROG.lost[sc.lose]=1;fmsg=`<div class="fbox sad">💔 ${capz(FRIEND[sc.lose][0])} não virou amigo da equipe.<br>Nas próximas aventuras, não vai aparecer, até vocês jogarem este capítulo de novo e escolherem o final feliz.</div>`}
    if(sc.gain&&PROG.lost[sc.gain]){delete PROG.lost[sc.gain];fmsg=`<div class="fbox">💛 ${capz(FRIEND[sc.gain][0])} agora é amigo da equipe e volta para as próximas aventuras!</div>`}
    saveProg()}
   markDone(S.ch,S.stars);
   const [a,b]=CH[S.ch].rank;
   const r=S.stars>=a?'🏆 Heróis Lendários!':S.stars>=b?'🥇 Heróis Super Corajosos!':'🎖️ Heróis do Reino!';
   h+=`<div class="rank">FIM! ${r}</div><div class="title">Vocês ganharam ⭐ ${S.stars} estrelas!</div>`;
   h+=fmsg;
   if(novo)h+=figurinhaNovaHTML(sc.gain);
   if(!S.festou){S.festou=1;setTimeout(()=>{if(sc.lose)tocar('ok');else{festaFim(S.stars);if(novo)setTimeout(()=>tocar('figurinha'),1100)}},60)}
   const nl=lockInfo(S.ch+1);
   if(CH[S.ch+1]&&CH[S.ch+1].soon){}
   else if(CH[S.ch+1]&&!nl)h+=`<button class="btn" onclick="newGame(${S.ch+1});go(CH[S.ch].start)">📖 Ir para o Capítulo ${S.ch+1} ➜</button>`;
   else if(CH[S.ch+1])h+=`<div class="fbox sad">🔒 O Capítulo ${S.ch+1} ficou bloqueado: ${nl.txt} precisa ser amigo da equipe.</div>`;
   h+=`<div class="ask">⭐ Fase ${S.ch} concluída no mapa!</div><button class="btn go" onclick="reset()">🗺️ Voltar ao mapa</button>`;
  } else sc.choices.forEach((c,i)=>{if(c[2]&&!amigo(c[2]))return;h+=`<button class="btn ${i?'b2':''}" onclick="choose(${i})">${c[0]}</button>`});
 }
 $('app').innerHTML=nomes(h+tools());
 vigiaInimigo();
}
function choose(i){tocar('ok');go(SC[S.scene].choices[i][1])}
function test(){
 if(busy)return;const T=SC[S.scene].test;
 roll(v=>{const ok=v>=T.need;
  if(!ok&&!S.retried){S.retried=1;S.t={v,retry:1};render();tocar('erro');return}
  const o=ok?T.ok:T.fail;let extra=o.fx?o.fx():'';
  S.t={v,ok,text:(ok&&S.retried?'Na segunda tentativa deu certo! 💪\n':'')+o.text+(extra?`\n<b>${extra.trim()}</b>`:''),go:o.go||T.next};render();
  tocar(ok?'bom':'erro');if(ok){pula($('die'));if(v===6)confete(24,['⭐'])}},'Precisa tirar '+T.need+' ou mais');
}
function buzio(){
 const B=SC[S.scene].battle,b=S.b;S.f.buzioUsado=1;b.hp=Math.max(0,b.hp-2);
 b.msg='🐚 TUUUUUUM! O som do Búzio Mágico foi tão forte que o inimigo levou um susto! 💥';
 if(b.hp<=0){b.done=1;b.msg+=`\n\n🏆 ${B.win}`}
 render();$('ef').classList.add('hit');tocar('super');if(b.done)vence();
}
function attack(i){
 if(busy)return;const B=SC[S.scene].battle,b=S.b,x=heroes()[i];
 roll(v=>{
  const bonus=b.bonus;b.bonus=0;const r=v+bonus,lbl=`🎲 ${v}${bonus?` +${bonus} = ${r}`:''}`;let m;
  if(r<=2){m=`${lbl} — ${pickNew('h'+x.name,FAILS[x.name]||SLIP.map(f=>f(x.name)))}\n<span class="bad">${pickNew('c'+S.scene,B.counter)}${b.shield?'\n🛡️ Mas a proteção segurou tudo! Ninguém se machucou!':hurt()}</span>`;b.shield=0}
  else if(r<=4){b.hp--;m=`${lbl} — ${x.name} usou ${x.move}\n<span class="good">Acertou! 👍</span>`}
  else{b.hp-=2;m=`${lbl} — SUPER ${x.move}!!! 💥\n<span class="good">Acertou com tudo!${v===6?star():''}</span>`}
  if(b.hp<=0){b.hp=0;b.done=1;m+=`\n\n🏆 ${B.win}`}
  b.msg=m;render();
  if(r>2){const f=$('ef');f.classList.add('hit')}
  else{const h=document.querySelector('.hud .hearts');if(h)h.classList.add('ai')}
  tocar(r<=2?'erro':v===6||r>=5?'super':'bom');
  if(b.done)vence();
 },'1-2: errou · 3-4: acertou · 5-6: SUPER ataque!');
}
function bestVoice(){
 const vs=speechSynthesis.getVoices().filter(v=>/^pt[-_]BR$/i.test(v.lang));
 const score=v=>(/natural|neural/i.test(v.name)?50:0)+(/online/i.test(v.name)?20:0)+(/francisca|thalita|antonio/i.test(v.name)?15:0)+(/google/i.test(v.name)?10:0)+(/luciana|premium|enhanced|aprimorad/i.test(v.name)?10:0);
 return vs.sort((a,b)=>score(b)-score(a))[0]||null}
if(window.speechSynthesis)speechSynthesis.getVoices();
let _sp=0;
function speak(){
 try{const t=$('narr').innerText.replace(/\p{Extended_Pictographic}|️|‍/gu,'');
  speechSynthesis.cancel();const id=++_sp,v=bestVoice();
  const parts=t.split(/\n+|(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
  const next=i=>{if(id!==_sp||i>=parts.length)return;
   const u=new SpeechSynthesisUtterance(parts[i]);u.lang='pt-BR';if(v)u.voice=v;
   u.rate=.95;u.pitch=1.1;
   const gap=/[.!?…]$/.test(parts[i])?350:150;
   u.onend=()=>setTimeout(()=>next(i+1),gap);u.onerror=()=>{};
   speechSynthesis.speak(u)};
  next(0)}catch(e){}
}
window.addEventListener('load',()=>{loadProg();enterWorld('reino');newGame(1);go('mundos')});
