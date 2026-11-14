/* Segredos e finais secretos.
   Em cada capítulo há uma escolha "misteriosa" (botão tracejado) que leva a uma cena escondida com um tesouro bônus.
   Alguns capítulos finais têm também um FINAL SECRETO, que só aparece por uma escolha escondida na cena da decisão.
   Para criar um segredo: chame seg({...}) no fim deste arquivo.
     id      identificador único (também é o nome da cena: seg_<id>, ou use cena:'...' para um final secreto já escrito em SC)
     mundo   id do mundo (reino, florescer, monstrinhos)       ch  número do capítulo
     de      cena (só com escolhas, sem teste/batalha/mini-jogo) onde aparece o botão escondido
     label   texto do botão escondido                          emoji, nome   como aparece no álbum
     art, text, item   (cena de tesouro) arte, texto e item bônus (ITEMS); fx e cond opcionais
   O que a criança já achou fica em PROG.segredos (por mundo). Achar dá +1 ⭐ na partida, e o botão some depois de usado. */

Object.assign(ITEMS,{
 s_sorte:{name:'🪙 Moeda da Sorte',type:'bonus',v:2,desc:'+2 no dado'},
 s_gema:{name:'💖 Gema do Coração',type:'heal',v:3,desc:'+3 ❤️'},
 s_escudo:{name:'🛡️ Medalha Escudo',type:'shield',desc:'protege do próximo erro'},
 s_brilho:{name:'🌟 Estrela Mágica',type:'dmg',v:2,desc:'tira 2 💜',fx:'A estrela mágica explodiu em purpurina: POOF!'}
});

const SEG=[];
/* registra o segredo; se tiver text, cria a cena de tesouro */
function seg(o){
 SEG.push(o);
 if(!o.cena){
  o.cena='seg_'+o.id;
  SC[o.cena]={segredo:o.id,art:o.art,text:o.text,enter(){return give(o.item)}};
 }
}

/* ---------- estado ---------- */
const segFeito=o=>!!((ALLPROG[o.mundo]||{}).segredos||{})[o.id];
function segEntra(id){
 const o=SEG.find(x=>x.id===id);if(!o)return '';
 const novo=!segFeito(o);
 PROG.segredos=PROG.segredos||{};PROG.segredos[id]=1;saveProg();
 S.f['seg_'+id]=1;S.segNovo=1;
 return (novo?' 🗝️ SEGREDO NOVO!':' 🗝️ Segredo!')+star();
}
/* botões escondidos da cena atual */
function segBotoes(){
 return SEG.filter(o=>o.de===S.scene&&o.mundo===WORLD&&!S.f['seg_'+o.id]&&(!o.cond||o.cond()))
  .map(o=>`<button class="btn secreto" onclick="segIr('${o.id}')">${o.label}</button>`).join('');
}
function segIr(id){
 const o=SEG.find(x=>x.id===id);if(!o)return;
 S.segVolta={id:S.scene,extra:S.extra};
 tocar('ok');go(o.cena);
}
/* volta para a cena de onde veio, sem repetir o que ela deu (estrelas e itens) */
function voltarSeg(){
 const v=S.segVolta;
 if(!v){reset();return}
 S.scene=v.id;S.extra=v.extra;S.t=null;S.segVolta=null;
 render();window.scrollTo(0,0);
}

/* ---------- resumos ---------- */
const segDoCap=(mundo,ch)=>SEG.filter(o=>o.mundo===mundo&&o.ch===ch);
function segLinha(ch){
 const l=segDoCap(WORLD,ch);if(!l.length)return '';
 const n=l.filter(segFeito).length;
 return `<div class="segline">🗝️ Segredos: ${n} de ${l.length}${n<l.length?' <small>(procure as escolhas misteriosas!)</small>':' 🎉'}</div>`;
}
function segFimHTML(ch){
 const l=segDoCap(WORLD,ch);if(!l.length)return '';
 const n=l.filter(segFeito).length;
 return `<div class="fbox seg">🗝️ Segredos deste capítulo: ${n} de ${l.length}<br>${n<l.length?'Ainda tem coisa escondida por aqui... jogue de novo e escolha diferente!':'🎉 Você achou todos!'}</div>`;
}
function segAlbumHTML(){
 let h='',tot=0,tem=0;
 for(const w in WORLDS){
  const l=SEG.filter(o=>o.mundo===w).sort((a,b)=>a.ch-b.ch);if(!l.length)continue;
  const f=l.filter(segFeito);tot+=l.length;tem+=f.length;
  h+=`<div class="albmundo">${WORLDS[w].icon} ${WORLDS[w].name} <span>${f.length}/${l.length}</span></div><div class="albgrade">`;
  for(const o of l)h+=segFeito(o)
   ?`<div class="figcard seg"><div class="fig">${o.emoji}</div><div class="fignm">${o.nome}</div><div class="figsub">Capítulo ${o.ch}</div></div>`
   :`<div class="figcard vazia"><div class="fig">❓</div><div class="fignm">Segredo escondido</div><div class="figsub">Capítulo ${o.ch}</div></div>`;
  h+=`</div>`}
 return `<div class="albsecao">🗝️ Segredos e Tesouros</div><div class="albtxt">Escolhas misteriosas escondem tesouros e finais secretos. Você achou ${tem} de ${tot}!</div>${h}`;
}

/* ================= REINO DAS CORES ================= */
seg({id:'rei_moeda',mundo:'reino',ch:1,de:'inicio',label:'🕳️ Espiar atrás do trono da Rainha',emoji:'🪙',nome:'Moeda da Rainha',item:'s_sorte',art:'🚪🪙👑',
 text:'Atrás do trono cinza, vocês encontram uma portinha minúscula, do tamanho de um coelhinho! 🚪\n\nDentro dela, a Rainha guardava um tesouro bem antigo: uma MOEDA DA SORTE 🪙, que brilhava mesmo no reino todo cinza!\n\n"Guardei para um dia difícil", sussurrou a Rainha. "Levem com vocês!"'});
seg({id:'rei_coruja',mundo:'reino',ch:2,de:'c2_inicio',label:'🦉 Seguir a corujinha que piscou para vocês',emoji:'🦉',nome:'Coruja da Meia-Noite',item:'s_gema',art:'🦉🌳🌑',
 text:'Num galho, uma corujinha minúscula piscou os olhos redondos e apontou com a asa para uma árvore oca. 🦉\n\nDentro do tronco havia uma GEMA DO CORAÇÃO 💖, quentinha!\n"A Lua me pediu para guardar um pedacinho de luz até ela voltar", disse a corujinha. "Levem, vocês vão precisar!"'});
seg({id:'rei_concha',mundo:'reino',ch:3,de:'c3_inicio',label:'🐚 Escutar a conchinha que cochicha na areia',emoji:'🐚',nome:'Concha Sussurrante',item:'s_escudo',art:'🐚🌊✨',
 text:'Na areia, uma conchinha cochichou: "Psiu... siga a bolhinha azul!" 🐚\n\nA bolhinha rolou pela praia e parou diante de um baú minúsculo, escondido numa toca de caranguejo. Dentro dele, uma MEDALHA ESCUDO 🛡️ do Capitão Sardinha:\n"Para quem tem bom ouvido!"'});
seg({id:'rei_telescopio',mundo:'reino',ch:4,de:'c4_inicio',label:'🔭 Olhar pelo telescópio velho',emoji:'🔭',nome:'Estrela do Telescópio',item:'s_brilho',art:'🔭🌌⭐',
 text:'Na entrada da cidade, um telescópio velho apontava para o céu escurecido. 🔭\n\nQuando o Kay olhou por ele, viu uma ESTRELA MÁGICA 🌟 pendurada num fio de luz, bem pertinho! Ela caiu na mão dele, como um presente do espaço.\n\n"Quem olha com curiosidade sempre ganha um brilho!", disse uma voz baixinha.'});
seg({id:'rei_dino',mundo:'reino',ch:5,de:'c5_inicio',label:'🦖 Seguir as pegadinhas pequeninas',emoji:'🦴',nome:'Osso Brilhante',item:'s_sorte',art:'🦴✨🦖',
 text:'Perto do chão que tremia, vocês acharam pegadinhas pequenininhas. 🦖 Elas levavam a um dinossaurinho tímido, escondido atrás de uma pedra.\n\nEle mostrou um OSSO BRILHANTE 🦴 e entregou na mão do Pegasus:\n"Era do meu avô. Ele dizia que dá sorte a quem sabe esperar!"'});
seg({id:'rei_balao',mundo:'reino',ch:6,de:'c6_inicio',label:'🎈 Estourar o balão que balança sozinho',emoji:'🎈',nome:'Bilhete do Balão',item:'s_gema',art:'🎈📜🎪',
 text:'Um balão colorido estava preso na ponta da tenda, balançando sozinho. 🎈\n\nQuando o Bilu Bilu estourou, saiu um bilhete: "A risada mais bonita é a de quem faz os outros rirem." 📜\n\nJunto com o bilhete, caiu uma GEMA DO CORAÇÃO 💖 cheia de gargalhadas!'});
seg({id:'rei_neve',mundo:'reino',ch:7,de:'c7_inicio',label:'⛄ Ajudar o bonequinho de neve que está tremendo',emoji:'🥕',nome:'Cenoura de Gelo',item:'s_escudo',art:'🥕❄️⛄',
 text:'Perto da fonte congelada, um bonequinho de neve bem pequenininho tremia, sem nariz! ⛄\n\n"Alguém viu minha cenoura?" Vocês procuraram e acharam uma CENOURA DE GELO 🥕 debaixo da neve.\nEle ficou tão feliz que deu de presente uma MEDALHA ESCUDO 🛡️ de gelo, que nunca derrete!'});
seg({id:'rei_casa',mundo:'reino',ch:8,de:'c8_inicio',label:'🪟 Espiar pela janelinha da casa de bonecas',emoji:'🪆',nome:'Bonequinha Dourada',item:'s_brilho',art:'🪆🏠✨',
 text:'Na casinha de bonecas, uma janelinha se mexeu! 🪟\n\nDentro dela, uma BONEQUINHA DOURADA 🪆 piscou e disse:\n"Eu fiquei escondida o dia todo para ninguém me guardar na caixa! Levem um pouco do meu brilho!"\nE entregou uma ESTRELA MÁGICA 🌟.'});
seg({id:'rei_ovelha',mundo:'reino',ch:9,de:'c9_inicio',label:'🐑 Procurar a ovelhinha que pula mais alto',emoji:'🐑',nome:'Ovelhinha Dourada',item:'s_gema',art:'🐑🌙✨',
 text:'Na fila das ovelhinhas, uma delas era DOURADA e pulava mais alto que todas! 🐑\n\nDepois do último pulo, ela deixou cair um tufo de lã brilhante: uma GEMA DO CORAÇÃO 💖, macia como nuvem.\n"Quem dorme com um sorriso sonha em dobro!", balbuciou a ovelhinha, bocejando.'});
seg({id:'rei_presente',mundo:'reino',ch:10,de:'c10_inicio',label:'🎁 Olhar embaixo da mesa da festa',emoji:'🎁',nome:'Presente da Rainha',item:'s_sorte',art:'🎁🎉👑',
 text:'Embaixo da mesa da festa, um presente com laço torto estava esquecido. 🎁\n\nNo cartão estava escrito: "Para quem olha embaixo das mesas também." Dentro havia uma MOEDA DA SORTE 🪙 em formato de coroa!\n\nA Rainha, de longe, deu uma piscadinha. 😉'});

/* final secreto do Reino: só aparece na cena em que o Rei Cinzento conta a tristeza dele */
SC.c10_final_secreto={end:1,gain:'rei',segredo:'rei_cor',art:'🎨👑🌈🎉',enter(){return star()},
 text:()=>'Vocês tiraram da mochila um lápis de cor e entregaram para o Rei Cinzento. 🎨\n"Eu... nunca escolhi uma cor sozinho...", disse ele.\n\nEle pensou, pensou, e riscou no chão uma cor que nunca existiu: ROSA-CHICLETE-COM-BRILHO! 💖✨\nA cor se espalhou pelo castelo, pelo reino e pelo céu, e todo mundo ganhou uma cor nova, só dele!\n\nA Festa dos Heróis foi a MAIOR de todas:\n'+festa10()+'\nO Rei Cinzento, agora o REI DAS CORES, abraçou a equipe: "Vocês me ensinaram que ninguém precisa ficar sozinho." 👑💖\n\n✨ FINAL SECRETO: O REI DAS CORES ✨'};
seg({id:'rei_cor',mundo:'reino',ch:10,de:'c10_rei_triste',cena:'c10_final_secreto',label:'🎨 Dar um lápis de cor para o Rei Cinzento',emoji:'👑',nome:'Final: O Rei das Cores'});

/* ================= PLANETA FLORESCER ================= */
seg({id:'flo_noz',mundo:'florescer',ch:1,de:'f1_inicio',label:'🌰 Procurar entre as raízes da árvore',emoji:'🌰',nome:'Noz Dourada',item:'s_sorte',art:'🌰🐿️🌳',
 text:'A Bolota farejou o tronco da Árvore dos Desejos e começou a cavar entre as raízes. 🐿️\n\n"Achei! É o meu ESTOQUE SECRETO de nozes!" Ela abriu uma casinha escondida e tirou uma NOZ DOURADA 🌰:\n"Eu guardava para uma ocasião especial. Parece que chegou!" 🪙'});
seg({id:'flo_cogumelo',mundo:'florescer',ch:2,de:'f2_inicio',label:'🍄 Apertar o cogumelinho que faz cara de segredo',emoji:'🍄',nome:'Cogumelo Arco-Íris',item:'s_gema',art:'🍄🌈✨',
 text:'Um cogumelinho de bolinhas roxas fazia cara de quem guarda um segredo. 🍄\n\nQuando a Lia apertou o chapéu dele: PUFF! Saiu uma nuvem de esporos coloridos que formou um arco-íris miúdo! 🌈\n\nNo pé do cogumelo, brilhava uma GEMA DO CORAÇÃO 💖.'});
seg({id:'flo_ninfeia',mundo:'florescer',ch:3,de:'f3_inicio',label:'🪷 Levantar a vitória-régia que brilha',emoji:'🪷',nome:'Pérola da Vitória-Régia',item:'s_escudo',art:'🪷🐸✨',
 text:'Uma vitória-régia brilhava mais do que as outras, como se tivesse uma lanterninha por baixo. 🪷\n\nQuando a Liv levantou a folha, uma rãzinha minúscula entregou uma pérola que virou uma MEDALHA ESCUDO 🛡️ no mesmo instante:\n"Para quem olha com carinho!"'});
seg({id:'flo_cacto',mundo:'florescer',ch:4,de:'f4_inicio',label:'🌵 Abraçar o cacto que sorri',emoji:'🌵',nome:'Gota do Cacto',item:'s_gema',art:'🌵😊💧',
 text:'Um cacto tinha dois pontinhos no lugar dos olhos e um sorriso torto. 🌵 A Liv deu um abraço bem cuidadoso nele.\n\nO cacto ficou tão emocionado que chorou uma gota cristalina: uma GEMA DO CORAÇÃO 💖 cheia de água fresca!'});
seg({id:'flo_bambu',mundo:'florescer',ch:5,de:'f5_inicio',label:'🎋 Bater três vezes no bambu mais alto',emoji:'🎋',nome:'Bambu da Sorte',item:'s_sorte',art:'🎋🐼🎶',
 text:'No meio do bambuzal, um bambu mais alto que os outros fazia TOC-TOC-TOC sozinho. 🎋\n\nA Bolota bateu três vezes de volta, e o bambu se abriu: dentro havia uma MOEDA DA SORTE 🪙 de bambu, com um pandinha desenhado!'});
seg({id:'flo_nuvem',mundo:'florescer',ch:6,de:'f6_inicio',label:'☁️ Pular na nuvem em forma de coração',emoji:'☁️',nome:'Nuvem-Coração',item:'s_escudo',art:'☁️💗🦢',
 text:'Entre as nuvens fofas, uma tinha formato de coração! ☁️💗 A Lia pulou nela, e a nuvem fez cócegas de volta.\n\nDe dentro da nuvem saiu uma pena branquinha que se transformou numa MEDALHA ESCUDO 🛡️ leve como o ar!'});
seg({id:'flo_reflexo',mundo:'florescer',ch:7,de:'f7_inicio',label:'🪞 Acenar para o reflexo que acena primeiro',emoji:'🪞',nome:'Estrela do Reflexo',item:'s_brilho',art:'🪞🌟🏞️',
 text:'No lago, o reflexo da Liv acenou primeiro, antes dela! 🪞\n\nA Liv acenou de volta, e o reflexo mergulhou e voltou com uma ESTRELA MÁGICA 🌟 que tinha caído no fundo do lago:\n"Reflexos também sabem ser gentis!"'});
seg({id:'flo_cenoura',mundo:'florescer',ch:8,de:'f8_inicio',label:'🥕 Puxar a cenoura que treme',emoji:'🥕',nome:'Cenoura Gigante',item:'s_gema',art:'🥕🕳️✨',
 text:'Uma cenoura gigante tremia no canteiro, como se estivesse com cócegas! 🥕\n\nA Liv e a Bolota puxaram juntas: POP! Embaixo dela havia uma tocazinha com uma GEMA DO CORAÇÃO 💖 e uma minhoca simpática:\n"Obrigada por me avisarem que já era hora de acordar!"'});
seg({id:'flo_vela',mundo:'florescer',ch:9,de:'f9_inicio',label:'🕯️ Acender a velinha esquecida na entrada',emoji:'🕯️',nome:'Vela Mágica',item:'s_sorte',art:'🕯️🔥✨',
 text:'Na entrada do Monte Oco, uma velinha apagada esperava, esquecida no chão. 🕯️\n\nQuando a Liv encostou o dedinho no pavio, ela acendeu sozinha e mostrou, na parede, uma portinha escondida! Lá dentro, uma MOEDA DA SORTE 🪙 coberta de poeira de estrela.'});
seg({id:'flo_lanterna',mundo:'florescer',ch:10,de:'f10_inicio',label:'🏮 Soltar uma lanterna extra para o céu',emoji:'🏮',nome:'Lanterna dos Desejos',item:'s_escudo',art:'🏮🌌💖',
 text:'Na Vila, sobrou uma lanterninha sem dono, pendurada no galho. 🏮\n\nA Lia segurou, a Liv acendeu, e a lanterna subiu devagarinho, levando um desejo bem pequenininho: "Que ninguém fique triste hoje." ✨\n\nDe volta, ela deixou cair uma MEDALHA ESCUDO 🛡️ de luz.'});

/* final secreto do Florescer: só aparece quando o Trovãozinho conta que se perdeu da mamãe */
SC.f10_final_secreto={end:1,gain:'trovao',segredo:'flo_desejo',art:'🌳🌌💖🎉',enter(){return star()},
 text:'A Liv e a Lia fecharam os olhos e, em vez de desejar algo para elas, desejaram bem baixinho:\n"Que todos os mundos tenham amigos, e que ninguém fique sozinho!" 🌌💖\n\nA Árvore dos Desejos brilhou tanto que o brilho escapou pelo céu, e lá longe, em outros planetas, pequenas luzes se acenderam, como se alguém tivesse respondido: ✨ (Dizem que uma delas chegou a um mundo cheio de monstrinhos... 👾)\n\nA Mamãe Nuvem desceu e abraçou o Trovãozinho, e a MAMÃE RAPOSA chegou com as três raposinhas e abraçou o Tico. 🦊☁️💖\n\nA Festa das Lanternas foi a mais linda de todas, e até o céu piscou de alegria. 🏮\n\n✨ FINAL SECRETO: O DESEJO PARA TODOS OS MUNDOS ✨'};
seg({id:'flo_desejo',mundo:'florescer',ch:10,de:'f10_trovao_triste',cena:'f10_final_secreto',label:'🌌 Fazer um desejo para TODOS os mundos',emoji:'🌌',nome:'Final: Desejo para Todos'});

/* ================= PLANETA MONSTRINHOS ================= */
seg({id:'mon_ovo',mundo:'monstrinhos',ch:1,de:'m1_inicio',label:'🥚 Escutar o ovinho que faz TOC-TOC baixinho',emoji:'🥚',nome:'Ovinho Dourado',item:'s_sorte',art:'🥚✨🐣',
 text:'Entre os ovinhos da Vila, um fazia TOC, TOC, TOC bem baixinho. 🥚\n\nO Gominha encostou o ouvido, o Pedregulho bateu de volta e o Baiacão ficou bem quietinho. CRAC! O ovinho abriu e saiu uma bolinha dourada: uma MOEDA DA SORTE 🪙!\n"O ovinho dourado só abre para quem tem paciência", cochichou a Vovó Ovinho.'});
seg({id:'mon_folha',mundo:'monstrinhos',ch:2,de:'m2_inicio',label:'🍃 Perguntar à folha que sussurra sozinha',emoji:'🍃',nome:'Folha Cochichona',item:'s_gema',art:'🍃🤫💬',
 text:'Uma folha sussurrava sozinha, balançando sem vento. 🍃\n\nO Baiacão perguntou, educadinho: "O que você está dizendo?" A folha respondeu: "A fofoca mais bonita é um elogio!" 💬\n\nE deixou cair uma GEMA DO CORAÇÃO 💖, que cresceu de tanto elogio.'});
seg({id:'mon_caranguejo',mundo:'monstrinhos',ch:3,de:'m3_inicio',label:'🦀 Seguir a pegadinha de caranguejo bebê',emoji:'🦀',nome:'Caranguejinho Bebê',item:'s_escudo',art:'🦀🏖️✨',
 text:'Uma pegadinha minúscula na areia levava a um caranguejinho bebê, escondido num buraco de concha. 🦀\n\nEle tinha muita vergonha, mas pegou uma MEDALHA ESCUDO 🛡️ feita de concha e entregou ao Pedregulho:\n"Para quem anda devagar e olha o chão!"'});
seg({id:'mon_cristal',mundo:'monstrinhos',ch:4,de:'m4_inicio',label:'💎 Soprar o cristal que está dormindo',emoji:'💎',nome:'Cristal Dorminhoco',item:'s_brilho',art:'💎😴✨',
 text:'Perto da entrada da caverna, um cristal ressonava com um "zzz" tilintante. 💎\n\nO Gominha soprou de levinho, e o cristal acordou, espreguiçando raios de luz! Para agradecer, ele soltou uma ESTRELA MÁGICA 🌟 que guardava para as noites frias.'});
seg({id:'mon_pipoca',mundo:'monstrinhos',ch:5,de:'m5_inicio',label:'🌋 Pisar na pedra que faz PUF',emoji:'🍿',nome:'Pedra Pipoca',item:'s_gema',art:'🌋🍿💥',
 text:'Na colina, uma pedra bem quentinha fazia PUF a cada passo do Pedregulho. 🌋\n\nEle pisou de novo... PUF! Saiu uma pipoca gigante! 🍿 E dentro dela, uma GEMA DO CORAÇÃO 💖 quentinha.\n"Pipoca de pedra dá coragem!", gritou o Baiacão, de boca cheia.'});
seg({id:'mon_cachecol',mundo:'monstrinhos',ch:6,de:'m6_inicio',label:'⛄ Ajudar o boneco de neve sem cachecol',emoji:'🧣',nome:'Cachecol do Boneco',item:'s_sorte',art:'⛄🧣❄️',
 text:'No caminho nevado, um boneco de neve sem cachecol batia os dentes de frio! ⛄\n\nO Gominha enrolou os tentáculos no pescoço dele, como um cachecol de gelatina. O boneco ficou tão quentinho que deu de presente uma MOEDA DA SORTE 🪙 de gelo.'});
seg({id:'mon_torre',mundo:'monstrinhos',ch:7,de:'m7_inicio',label:'👂 Encostar o ouvido na parede da torre',emoji:'👂',nome:'Segredo da Parede',item:'s_escudo',art:'👂🗼💬',
 text:'A parede da torre sussurrava! 👂\n\nO Pedregulho encostou o ouvido e ouviu uma voz fininha: "Eu só queria um amigo..." Ele sussurrou de volta: "Estamos chegando!" E da parede escorregou um bilhetinho e uma MEDALHA ESCUDO 🛡️.'});
seg({id:'mon_toalha',mundo:'monstrinhos',ch:8,de:'m8_inicio',label:'🧺 Espiar embaixo da toalha de piquenique',emoji:'🍽️',nome:'Toalha Mágica',item:'s_brilho',art:'🍽️🧺✨',
 text:'Embaixo da toalha de piquenique, havia uma bolinha brilhando. 🧺\n\nO Baiacão levantou a toalha e achou uma ESTRELA MÁGICA 🌟 bordada:\n"Toalha boa esconde coisas boas!" Ele inchou de orgulho e quase saiu voando.'});

/* final secreto dos Monstrinhos: só aparece quando a Vovó Monstrona conta que ninguém a convida */
SC.m8_final_secreto={end:1,gain:'vovomonstrona',segredo:'mon_toalhadourada',art:'🧺🌟🦕🎉',enter(){return star()},
 text:()=>{const l=['pinchao','cochichona','pincolino','cavoucao','calorao','friozao','bisbilhotao'].filter(k=>figuraGanha(k)).map(k=>FRIEND[k][0]);
  return 'O Gominha lembrou: "Todo cesto bom tem um fundo falso!" 🧺 Ele apertou o fundo... CLIC! Escondida embaixo, havia uma TOALHA DOURADA, bordada com uma patinha de cada região e com um bilhetinho:\n"Piquenique bom é aquele em que cabem TODOS." 💛\n\nA Vovó Monstrona estendeu a toalha sobre o campo, e ela foi crescendo, crescendo... até caberem todos os monstrinhos do planeta, até os mais tímidos, que nunca tinham ido a nenhum piquenique! 🌎\n\n'+(l.length?'Chegaram correndo: '+l.join(', ')+'! 👾\n\n':'')+'A Vovó Monstrona sentou no melhor lugar, bem no meio, e cantou a cantiga de ninar mais bonita do mundo. 🦕🎶\nOs monstrinhos de todas as regiões se abraçaram, e o Gominha, o Pedregulho e o Baiacão se olharam, felizes: "Conseguimos!" 🐙🪨🐡\n\n✨ FINAL SECRETO: A TOALHA DOURADA ✨'}};
seg({id:'mon_toalhadourada',mundo:'monstrinhos',ch:8,de:'m8_triste',cena:'m8_final_secreto',label:'🎁 Procurar o fundo falso do cesto',emoji:'🌟',nome:'Final: Toalha Dourada'});
