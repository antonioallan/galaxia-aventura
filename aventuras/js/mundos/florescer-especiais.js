/* ===== MUNDO 2: PLANETA FLORESCER — capítulos especiais (11 e 12) =====
   Só aparecem no mapa depois de concluir o capítulo 10 (map.extra.after em florescer.js). Substituem os "em breve".
   11 — Tico, Trovãozinho e as Três Estrelinhas: aventura curta com coadjuvantes (contador de 3 estrelinhas).
   12 — Os Monstrinhos Chegaram!: crossover com o Planeta Monstrinhos; Gominha, Pedregulho e Baiacão caem no Florescer
        (contador de 3 grupos sem medo). Usa figuraGanha() (album.js) para citar os amigos que a criança fez lá.
   Ids de cena f11_ e f12_. Carregado depois de monstrinhos.js, porque os heróis e as frases de falha vêm de lá. */
(function(){
const sc=(art,text,choices,x)=>Object.assign({art,text,choices},x||{});
const T=(art,text,need,ok,fail,next)=>({test:{art,text,need,ok,fail,next}});
const B=(face,name,hp,intro,counter,win,next)=>({battle:{face,name,hp,intro,counter,win,next}});
const E=o=>Object.assign({end:1},o);

Object.assign(ITEMS,{
 f_vaga:{name:'✨ Vaga-lume Escudo',type:'shield',desc:'protege do próximo erro'},
 f_cauda:{name:'☄️ Cauda de Cometa',type:'dmg',v:3,desc:'tira 3 💜',fx:'A cauda de cometa riscou o ar: ZUUUUM!'},
 f_gelatina:{name:'🍮 Gelatina do Gominha',type:'heal',v:3,desc:'+3 ❤️'}
});

Object.assign(FAILS,{
 'Trovãozinho':['O Trovãozinho foi fazer um raio e saiu só uma cócega de faísca: ZIP! ⚡','O Trovãozinho chorou de emoção e molhou todo mundo! 🌧️','O Trovãozinho ficou com medo do próprio trovão e se escondeu! ☁️','O Trovãozinho foi dar uma chuvinha de cócegas... para cima! ☔','O Trovãozinho soluçou e saiu um arco-íris pequenininho: hic! 🌈']
});

Object.assign(FRIEND,{cometa:['o Cometinha',11],nevoinha:['a Nevoinha',12]});

/* só vão junto os amigos que a criança não perdeu */
const GOMINHOS=[{name:'Gominha',face:'🐙',move:'Abraço de Gelatina 🍮'},{name:'Pedregulho',face:'🪨',move:'Rolinho Rochoso 🪨'},{name:'Baiacão',face:'🐡',move:'Inchaço Surpresa 🎈'}];
const TICO={name:'Tico',face:'🦊',move:'Truque de Raposa 🦊'},TROVAO={name:'Trovãozinho',face:'☁️',move:'Chuvinha de Cócegas 🌧️'};

/* amigos que a criança fez no Planeta Monstrinhos (figuras do álbum), para o fim do capítulo 12 */
const MONSTRINHOS=['pinchao','cochichona','pincolino','cavoucao','calorao','friozao','bisbilhotao','vovomonstrona'];
const alos=()=>{const l=MONSTRINHOS.filter(k=>figuraGanha(k)).map(k=>FRIEND[k][0]);
 return l.length?'Os amigos que vocês fizeram lá no Planeta Monstrinhos mandaram um alô: '+l.join(', ')+'! 👾💛\n\n':''};

const CH2=WORLDS.florescer.chapters;
CH2[11]={start:'f11_inicio',title:'Tico, Trovãozinho e as Três Estrelinhas',special:1,
 get heroes(){return [...(amigo('tico')?[TICO]:[]),...(amigo('trovao')?[TROVAO]:[])]},rank:[6,3]};
CH2[12]={start:'f12_inicio',title:'Os Monstrinhos Chegaram!',special:1,heroes:GOMINHOS,rank:[7,4]};
/* mapa: ícone e cor dos dois capítulos especiais (antes "❔") e rótulo da faixa */
const M=WORLDS.florescer.map;
M.icons[11]='🌠';M.icons[12]='🥚';
M.colors[11]='#ff9ad0';M.colors[12]='#9a8cf0';
M.extra.label='✨ CAPÍTULOS ESPECIAIS ✨';

Object.assign(SC,{
 /* ===== CAPÍTULO 11: TICO, TROVÃOZINHO E AS TRÊS ESTRELINHAS ===== */
 f11_inicio:sc('🌠🦊☁️','A Festa das Lanternas acabou e a Vila ficou quietinha. Na noite seguinte, o TICO 🦊 e o TROVÃOZINHO ☁️ estavam olhando o céu juntos, sem sono...\n\nDe repente: ZIIIIIU! 🌠🌠🌠\nTrês estrelinhas cadentes riscaram o céu e caíram no Planeta Florescer!\n\n"Elas se perderam do céu!" disse o Trovãozinho, assustado.\nO Tico ficou pensativo: "Eu sei como é ficar longe de casa... Vamos ajudar elas a voltar antes do amanhecer!" 🦊💛\n\nA Liv, a Lia e a Bolota acordaram com o barulho e vieram junto!\n\nO Tico e o Trovãozinho vão batalhar junto!\nVamos achar as 3 estrelinhas 🌠!\n\nPor onde começar?',
  [['🏮 Procurar na Vila das Lanternas','f11_vila'],['🌳 Procurar no Bosque do Luar','f11_bosque']],{title:'Capítulo Especial: Tico, Trovãozinho e as Três Estrelinhas',enter(){S.cnt={icon:'🌠',n:0,of:3};return ''}}),
 f11_vila:T('🏮🌠','Na Vila das Lanternas, uma luzinha vermelha pisca no alto de um poste, mas é altíssimo! O Tico sobe nos ombros da Liv, e a Bolota sobe nos ombros do Tico...\n\nPrecisa tirar 3 ou mais.',3,
  {text:'A torre de amigos chegou lá em cima! Dentro da lanterna, uma ESTRELINHA VERMELHA tremia de medo! 🌠',fx(){return star()}},
  {text:'A torre de amigos balançou e todo mundo caiu num monte de folhas! 🍂 Mas a estrelinha vermelha caiu junto, bem no colo do Tico!',fx(){return hurt()}},'f11_est1'),
 f11_bosque:{mini:{tipo:'sequencia',len:3,art:'🌳✨🌙',text:'No Bosque do Luar, os vaga-lumes piscam três luzinhas, uma de cada vez! ✨\n\nParece um código secreto! Repitam a sequência para os vaga-lumes mostrarem onde está a estrelinha.',
  ok:'Os vaga-lumes piscaram todos juntos e formaram uma trilha brilhante até uma ESTRELINHA VERMELHA, escondida embaixo de uma folha! 🌠\n\nUm vaga-lume ainda deu de presente uma luzinha: o VAGA-LUME ESCUDO ✨, que protege do próximo erro!',next:'f11_est1',fx(){return star()+give('f_vaga')}}},
 f11_est1:sc('🌠❤️🦊','Primeira estrelinha encontrada! 🌠\nEla é vermelha, pequenininha e brilha tremendo.\n\n"Eu quero voltar para casa..." sussurrou.\nO Tico fez um carinho: "Calma, a gente leva você. Mas ainda tem duas amigas suas por aí." 🦊💛',
  [['Procurar a segunda estrelinha ➜','f11_lago']],{enter(){return count()}}),
 f11_lago:sc('🪞🌠🦋','No Lago Espelhado, o céu aparece duas vezes: em cima e na água. 🪞\n\nA segunda estrelinha, azul, está no meio de um bando de MARIPOSAS LANTERNEIRAS 🦋, que adoram luz e rodam em volta dela sem parar!\n\nO que vocês fazem?',
  [['⚔️ Espantar as mariposas na brincadeira','f11_mariposas'],['💬 Conversar com as mariposas','f11_falar'],['🪞 Pedir ajuda ao Espelhinho','f11_espelhinho','espelhinho']]),
 f11_falar:T('💬🦋','O Tico se aproxima sem pressa: "Vocês gostam de luz, né? Mas a estrelinha está com medo!"\n\nPrecisa tirar 4 ou mais.',4,
  {text:'As mariposas pararam de rodar: "Ah... a gente só queria ficar pertinho da luz bonita!" 🦋 E abriram espaço.',fx(){return star()},go:'f11_est2'},
  {text:'As mariposas rodaram mais rápido, de tanta animação! 🦋🌀',go:'f11_mariposas'}),
 f11_espelhinho:sc('🪞✨🦋','O Espelhinho brilhou e mostrou às mariposas outra luz bonita, bem longe, na outra margem! 🪞\n\nTodas as mariposas foram atrás, felizes, e a estrelinha azul ficou livre!',
  [['Continuar ➜','f11_est2']],{enter(){return star()}}),
 f11_mariposas:B('🦋','Mariposas Lanterneiras',4,'As mariposas giram em volta da estrelinha, fazendo vento com as asinhas!\n"Luz! Luz! Luz bonita!" 🦋🦋🦋',
  ['As mariposas jogaram pó brilhante em todo mundo! ✨','As mariposas rodaram e deixaram todo mundo tonto! 🌀','Uma mariposa pousou no nariz do Tico: ATCHIM! 🦊'],
  'As mariposas cansaram e pousaram nas vitórias-régias, bocejando... 🦋💤','f11_est2'),
 f11_est2:sc('🌠💙🪷','Segunda estrelinha encontrada! 🌠💙\nEla é azul e deu uma risadinha: "Hihihi! As mariposas faziam cócegas!"\n\nEla soltou uma CAUDA DE COMETA ☄️ de presente: tira 3 💜 de um inimigo!',
  [['Procurar a terceira estrelinha ➜','f11_monte']],{enter(){return count()+give('f_cauda')}}),
 f11_monte:sc('🕳️🌑🌠','A última estrelinha foi se esconder no MONTE OCO, no meio do escuro! 🌑\nÉ tão escuro que ninguém enxerga nem a ponta do nariz.\n\nO que vocês fazem?',
  [['🕳️ Entrar tateando pelo túnel','f11_tunel'],['⛈️ O Trovãozinho faz um raio para iluminar','f11_raio']]),
 f11_tunel:T('🕳️🤲','Todo mundo de mãozinhas dadas, tateando a parede do túnel...\n\nPrecisa tirar 3 ou mais.',3,
  {text:'Chegaram no fundo do túnel sem tropeçar, guiados pelo cheirinho de poeira de estrela! ✨',fx(){return star()}},
  {text:'A Bolota tropeçou e todo mundo caiu em efeito dominó: TOC, TOC, TOC! 😂',fx(){return hurt()}},'f11_quebra'),
 f11_raio:sc('⛈️💡','O Trovãozinho respirou fundo e fez um raiozinho bem fraquinho, só do tamanho de uma lanterna: ZZZIP! ⚡\nEle ficou orgulhoso: "Dessa vez eu mandei só o raio que eu queria!" ☁️💛\n\nO túnel inteiro ficou iluminado!',
  [['Continuar ➜','f11_quebra']],{enter(){return star()}}),
 f11_quebra:{mini:{tipo:'quebra',emoji:'⭐',cols:2,rows:2,art:'⭐🪨🧩',text:'No fundo do Monte Oco, a parede tem o desenho de uma estrela feito de pedras soltas, todas bagunçadas! 🪨\n\nDizem que a estrela aparece quando alguém montar o desenho. Montem a estrela!',
  ok:'CLAC! A estrela de pedra se completou e brilhou, e de trás dela saiu a última estrelinha: a amarelinha! 🌠💛',next:'f11_est3',fx(){return star()}}},
 f11_est3:sc('🌠🌠🌠','As três estrelinhas, a vermelha, a azul e a amarela, se abraçaram, felizes de estarem juntas outra vez! 🌠🌠🌠\n\nO Trovãozinho abaixou a nuvem: "Subam nas minhas costas! Eu levo vocês até o céu!" ☁️\n\nTodo mundo subiu...',
  [['Subir até o céu ➜','f11_ceu']],{enter(){return count()}}),
 f11_ceu:sc('☁️🌌☄️','Subindo, subindo... as estrelinhas pularam no céu e voltaram a brilhar, uma ao lado da outra! 🌠🌠🌠\n\nMas lá no alto, um pouquinho afastado, tem uma bolinha de luz com cauda comprida, sozinha, quase apagada: o COMETINHA ☄️, irmão mais velho das estrelinhas!\n"Eu era para ter vindo com elas... mas tenho medo de voar sozinho! Vão embora!"\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ele se acalmar','f11_cometa'],['💬 Perguntar por que ele tem medo','f11_perguntar'],['🐦 O Brilho voa até ele','f11_brilho','brilho']]),
 f11_perguntar:T('💬☄️','A Lia estica os bracinhos para o cometinha, e o Tico pergunta com jeitinho.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Cometinha parou de soltar faíscas: "Ninguém... queria saber..." ☄️',fx(){return star()},go:'f11_triste'},
  {text:'"Vão embora! ZUUUM!" ☄️',go:'f11_cometa'}),
 f11_brilho:sc('🐦☄️💛','O Brilho voou até o cometinha: "Eu também já fiquei sozinho no meu ninho, e achei que ninguém ia me visitar. Mas hoje eu tenho amigos!" 🐦\n\nO Cometinha olhou de lado, e a cauda dele ficou um pouquinho mais clara. ☄️',
  [['Continuar ➜','f11_triste']],{enter(){return star()}}),
 f11_cometa:B('☄️','Cometinha Teimoso',6,'"ZUUUM! Eu voo sozinho! Não preciso de ninguém!" ☄️\n\nO Cometinha solta faíscas pelo céu, mas as faíscas só fazem cócegas!',
  ['O Cometinha riscou o céu e passou voando rente à cabeça de todo mundo! 💨','Uma chuva de faíscas fez cócegas no Tico! 🦊','O Cometinha deu uma volta tão rápida que todo mundo ficou tonto! 🌀'],
  'O Cometinha cansou e pousou numa nuvem, com a cauda toda murcha... ☄️💤','f11_triste'),
 f11_triste:sc('☄️💧🌌','O Cometinha falou baixinho:\n\n"Eu viajo tão rápido que ninguém consegue me acompanhar. Quando as estrelinhas caíram, eu fiquei com medo de voar sozinho e não fui atrás delas..." 😢\n\nO Tico olhou para ele, com os olhos molhados:\n"Eu já fiquei longe da minha família... Eu sei bem como é." 🦊\n\nO que vocês fazem?',
  [['💛 Prometer acenar para ele toda noite, da Árvore','f11_final'],['🏠 Descer sem fazer promessa','f11_final_embora']]),
 f11_final:E({gain:'cometa',art:'☄️💛🌠🎉',enter(){return star()},text:'O Tico foi o primeiro:\n"Toda noite a gente vai olhar para o céu e acenar para você! E você pisca de volta, para a gente saber que está tudo bem!" 🦊💛\n\nO Cometinha abriu um sorriso de luz: "Piscar... isso eu consigo fazer!" ☄️✨\nAs três estrelinhas voaram para o lado dele, de mãos dadas: "A gente voa junto, devagarinho!"\n\nLá embaixo, na Árvore dos Desejos, a Liv, a Lia e a Bolota acenaram. 👋\nE lá do céu, quatro luzinhas piscaram de volta: pisca, pisca, pisca! 🌠\n\nO Trovãozinho desceu devagarinho com todo mundo nas costas, e o Tico deu um abraço nele:\n"Amigos de longe também são amigos de perto!" 🦊☁️💛\n\n✨ FIM ✨'}),
 f11_final_embora:E({lose:'cometa',art:'🏠☄️',text:'Vocês desceram do céu, e as três estrelinhas ficaram brilhando no lugar delas. 🌠🌠🌠\n\nMas o Cometinha ficou lá no alto, afastado, sem ninguém para piscar de volta... ☄️💧\n\n(Que tal jogar de novo e prometer acenar para o Cometinha toda noite?)'}),

 /* ===== CAPÍTULO 12: OS MONSTRINHOS CHEGARAM! (crossover com o Planeta Monstrinhos) ===== */
 f12_inicio:sc('🥚🌈👾🌳','Era madrugada na Vila das Lanternas quando... BUUUM! 💥\nUm OVO GIGANTE, listrado de todas as cores do arco-íris, caiu do céu bem ao lado da Árvore dos Desejos! 🥚🌈\n\nCRAC... CRAC... CRAAAC!\nO ovo rachou, e de dentro rolaram três bichinhos que a Liv nunca tinha visto:\num monstrinho de GELATINA 🐙,\num monstrinho de PEDRA 🪨,\ne um monstrinho que INCHA feito balão 🐡!\n\n"AAAAH, MONSTROS!" gritou a Bolota, se escondendo atrás da Liv. 🐿️\n\nMas a Lia deu uma risadinha: "Hihihi!" 👶\nE o monstrinho de gelatina tremeu de tanto rir também, fazendo plop, plop, plop!',
  [['👋 Dar oi para os monstrinhos','f12_conversa']],{title:'Capítulo Especial: Os Monstrinhos Chegaram!'}),
 f12_conversa:sc('🐙🪨🐡💬','"Oi! Eu sou o GOMINHA! 🐙 Esse é o PEDREGULHO 🪨, e esse é o BAIACÃO 🐡. A gente vem do Planeta Monstrinhos!"\n\n"Depois do Grande Piquenique, ficamos brincando dentro do Cesto Grande... e escorregamos por um buraco no céu! O ovo nos trouxe até aqui."\n\nO Pedregulho resmungou: "E o buraco fechou. Para abrir de novo, é só levar o ovo até o galho mais alto da Árvore dos Desejos, quando o sol nascer. Mas ele é pesado, e precisa de MUITAS mãozinhas."\n\nO Baiacão olhou para trás, assustado: "E tem uma neblina roxa seguindo a gente, cochichando que monstros são perigosos..." 🌫️\n\nO Gominha deu uma gelatina para a Liv: "Toma, é uma GELATINA DO GOMINHA 🍮! Ela devolve 3 ❤️ numa batalha."\n\nOs três monstrinhos vão batalhar junto!\nPara carregar o ovo, a equipe precisa que 3 lugares percam o medo 💛.\n\nVamos começar pela Vila?',
  [['🏮 Ir até a Vila das Lanternas ➜','f12_vila']],{enter(){S.cnt={icon:'💛',n:0,of:3};return star()+give('f_gelatina')}}),
 f12_vila:sc('🏮🍞😨','Na Vila das Lanternas, a vovó do pão espiou pela janela e... PAF! Trancou a porta! 🚪\n"Monstros! Eles vão comer meu pão!"\n\nPela fresta da porta, uma fumacinha roxa cochichava: "psiu... cuidado... psiu..." 🌫️\n\nO que vocês fazem?',
  [['🎈 O Baiacão faz a vovó rir','f12_riso'],['🃏 Brincar de memória com as crianças da Vila','f12_memoria']]),
 f12_riso:T('🐡🎈','O Baiacão sobe no telhado e começa a inchar... inchar... inchar... PUF! Desinchou fazendo barulho de trombeta: PRRRRIIIII! 📯\n\nPrecisa tirar 3 ou mais.',3,
  {text:'A vovó do pão caiu na risada, abriu a porta e deu um pão quentinho para cada monstrinho! 🍞😂\n"Estes monstrinhos são uns palhacinhos!"',fx(){return star()}},
  {text:'O Baiacão inchou tanto que saiu voando, e todo mundo foi atrás, correndo! 🎈 A vovó riu tanto da correria que abriu a porta! 😂',fx(){return hurt()}},'f12_vila_fim'),
 f12_memoria:{mini:{tipo:'pares',emojis:['🍞','🏮','🐙','🐡'],art:'🃏🍞🏮',text:'As crianças da Vila toparam jogar, mas só se os monstrinhos jogarem também! 🃏\n\nAchem os pares iguais, todo mundo junto!',
  ok:'Os monstrinhos e as crianças riram tanto no jogo que a vovó do pão destrancou a porta, curiosa! 🍞\n"Hmm... eles parecem bonzinhos!"',next:'f12_vila_fim',fx(){return star()}}},
 f12_vila_fim:sc('🍞💛🏮','A vovó do pão deu um pão quentinho para cada monstrinho, e o medo da Vila passou! 💛\n\nAgora é hora de conversar com os cogumelinhos, no Vale dos Cogumelos.',
  [['Ir para o Vale dos Cogumelos ➜','f12_cogumelos']],{enter(){return count()}}),
 f12_cogumelos:sc('🍄😨🍄','No Vale dos Cogumelos, todos os cogumelinhos fecharam os chapéus de medo e estão tremendo. Um deles cochicha:\n"A neblina disse que monstros pisam em cogumelos!" 🍄\n\nO que vocês fazem?',
  [['🪨 O Pedregulho brinca de boliche com eles','f12_boliche'],['🎶 Cantar a música dos cogumelos','f12_musica']]),
 f12_boliche:T('🪨🍄','O Pedregulho promete: "Eu rolo devagarinho, só de brincadeira!" Os cogumelinhos se enfileiram, rindo, como pinos de boliche!\n\nPrecisa tirar 3 ou mais.',3,
  {text:'O Pedregulho derrubou um por um, de levinho, e os cogumelinhos abriram os chapéus: "De novo, de novo!" 🍄🪨',fx(){return star()}},
  {text:'O Pedregulho rolou tão devagarinho que os cogumelinhos cochilaram esperando! 😴 Mas, ao acordar, riram e abriram os chapéus!',fx(){return hurt()}},'f12_cogu_fim'),
 f12_musica:{mini:{tipo:'sequencia',len:3,art:'🍄🎶🍄',text:'Os cogumelinhos têm uma musiquinha de três notas! 🎶\n\nSe os monstrinhos cantarem igualzinho, eles vão saber que são amigos. Prestem atenção!',
  ok:'Os cogumelinhos abriram os chapéus, um por um, e começaram a dançar junto com os monstrinhos! 🍄🎶',next:'f12_cogu_fim',fx(){return star()}}},
 f12_cogu_fim:sc('🍄💛🎶','O Vale dos Cogumelos inteiro dançou com os monstrinhos! O medo do Vale passou! 💛\n\nO céu já está clareando... falta só o Lago Espelhado!',
  [['Ir para o Lago Espelhado ➜','f12_lago']],{enter(){return count()}}),
 f12_lago:sc('🪞🌫️🦢','No Lago Espelhado, a neblina roxa deixou os reflexos enormes e carrancudos, e os cisnes e os peixinhos fugiram, com medo dos "monstros do lago"! 🪞\n\n"Não são monstros de verdade! São só reflexos!" disse a Liv.\n\nO que vocês fazem?',
  [['🧩 Consertar o espelho mágico do lago','f12_espelho'],['🤪 O Gominha faz careta para o reflexo','f12_careta'],['🪞 O Espelhinho mostra o reflexo de verdade','f12_espelhinho','espelhinho']]),
 f12_espelho:{mini:{tipo:'quebra',emoji:'🪞',cols:2,rows:2,art:'🪞🌫️🧩',text:'O espelho mágico do lago está em pedaços, e por isso mostra tudo errado! 🪞\n\nMontem o espelho para o lago mostrar o reflexo de verdade!',
  ok:'O espelho ficou inteirinho, e o reflexo dos monstrinhos apareceu pequeno e fofinho: 🐙🪨🐡\n\nOs cisnes e os peixinhos voltaram, curiosos...',next:'f12_lago_fim',fx(){return star()}}},
 f12_careta:T('🤪🪞','O Gominha faz a careta mais engraçada do mundo, esticando os tentáculos e revirando os olhos!\n\nPrecisa tirar 3 ou mais.',3,
  {text:'O reflexo gigante fez careta também, e depois deu uma gargalhada: o lago inteiro riu junto! 🤪🪞',fx(){return star()}},
  {text:'O Gominha esticou tanto que se enrolou todo, e o reflexo também ficou enrolado! Todo mundo riu do nó! 🪢',fx(){return hurt()}},'f12_lago_fim'),
 f12_espelhinho:sc('🪞✨😮','O Espelhinho apareceu, todo contente: "Reflexo é comigo!" 🪞\nEle brilhou e mostrou os monstrinhos do jeito que eles são de verdade: três amigos fofos e bobinhos! 🐙🪨🐡',
  [['Continuar ➜','f12_lago_fim']],{enter(){return star()}}),
 f12_lago_fim:sc('🦢💛🪞','Os cisnes voltaram, os peixinhos pularam de alegria e o lago brilhou! O medo do lago passou! 💛\n\nAgora, com os três lugares sem medo, o povo todo ajudou a carregar o ovo até o pé da Árvore dos Desejos. 🥚🌳\n\nMas lá, uma neblina roxa enorme está enrolada no tronco...',
  [['Ir até a Árvore ➜','f12_arvore']],{enter(){return count()}}),
 f12_arvore:sc('🌳🌫️😠','A neblina roxa se juntou e virou uma carinha de nuvem desconfiada:\n"Eu sou a NEVOINHA DESCONFIADA! 🌫️ Quem é diferente é perigoso! Eu protejo o planeta! Ninguém passa com esse ovo!"\n\nO sol já está quase nascendo...\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ela escutar','f12_nevoinha'],['💬 Perguntar do que ela tem medo','f12_perguntar'],['🦊 O Tico conta como foi chegar de longe','f12_tico','tico'],['☁️ O Trovãozinho mostra que nuvem também é amiga','f12_trovao','trovao']]),
 f12_perguntar:T('💬🌫️','A Liv se aproxima da névoa e pergunta bem baixinho, sem bronca.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'A Nevoinha ficou parada, surpresa: "Ninguém nunca... me perguntou isso..." 🌫️',fx(){return star()},go:'f12_triste'},
  {text:'"Desconfio de vocês! Desconfio, desconfio!" 🌫️',go:'f12_nevoinha'}),
 f12_tico:sc('🦊💛🌫️','O Tico chegou pertinho e contou:\n"Quando eu cheguei aqui, eu era diferente de todo mundo, perdido, e tive medo. Mas a Liv e a Lia me aceitaram. O medo de quem a gente não conhece passa quando a gente conversa!" 🦊\n\nA Nevoinha ficou mais branquinha: "Então... eles não são perigosos?" 🌫️',
  [['Continuar ➜','f12_triste']],{enter(){return star()}}),
 f12_trovao:sc('☁️💛🌫️','O Trovãozinho subiu até a Nevoinha: "Eu também sou uma nuvem, e já assustei todo mundo com meus raios... Mas hoje eu tenho amigos!" ☁️\n\nA Nevoinha ficou olhando: "Você... também era assim?" 🌫️',
  [['Continuar ➜','f12_triste']],{enter(){return star()}}),
 f12_nevoinha:B('🌫️','Nevoinha Desconfiada',9,'"Desconfio! Desconfio! Desconfio!" 🌫️\n\nA Nevoinha se espalha em volta da Árvore, mas a névoa só faz cócegas!',
  ['A neblina cobriu todo mundo e ninguém enxergava nada: cadê o Baiacão? 🌫️','A Nevoinha cochichou um monte de coisas esquisitas no ouvido de todo mundo! 🙉','Uma ventania de névoa gelada fez todo mundo espirrar: ATCHIM! 🤧'],
  'A Nevoinha encolheu até ficar do tamanho de uma nuvenzinha, tremendo... 🌫️','f12_triste'),
 f12_triste:sc('🌫️💧🥚','A Nevoinha falou baixinho:\n\n"Eu nasci de uma fofoca, sabem? Quando alguém espalha medo sem saber, eu apareço. Tenho medo de tudo o que eu não conheço... e por isso ninguém chega perto de mim." 😢\n\nO Gominha estendeu um tentáculo, bem de leve.\n\nO que vocês fazem?',
  [['🧺 Convidar a Nevoinha para conhecer os monstrinhos e fazer um piquenique','f12_final'],['🥚 Levar o ovo para o topo e ir embora','f12_final_embora']]),
 f12_final:E({gain:'nevoinha',art:'🌫️💛🥚🌈',enter(){return star()},text:()=>'O Gominha, o Pedregulho e o Baiacão sentaram em volta da Nevoinha, e a Lia deu uma risadinha pertinho dela. 👶\n\n"Viu? Quando a gente conhece, o medo vai embora!" disse a Liv. 💛\nA Nevoinha ficou branquinha de alegria: "Eu quero conhecer vocês!" E virou uma nuvenzinha fofa e cheirosa. 🌫️☁️\n\nDepois, todo mundo carregou o ovo até o galho mais alto e, quando o sol nasceu, o ovo brilhou e abriu o BURACO NO CÉU! 🥚🌈\n\nAntes de ir, fizeram um PIQUENIQUE ENTRE MUNDOS: a vovó do pão trouxe pães, os cogumelinhos fizeram música e os cisnes trouxeram flores! 🍞🍄🦢\n\n'+alos()+'Pelo buraco do céu chegou uma voz lá de longe: "GOMINHAAA, PEDREGULHOOO, BAIACÃOOO!" 👾👋\n\nO Gominha deu um abraço de gelatina na Liv e na Lia: "Vocês são nossas amigas de outro mundo!" 🐙💛\nO Pedregulho rolou devagarinho e foi o último a entrar no ovo, sem parar de acenar. 🪨\nO Baiacão inchou de emoção e saiu flutuando. 🐡🎈\n\nA Bolota, que antes gritou "monstros!", acenou até o ovo sumir: "Voltem logo, monstrinhos!" 🐿️\n\n✨ FIM ✨'}),
 f12_final_embora:E({lose:'nevoinha',art:'🥚🌫️',text:'Vocês carregaram o ovo até o galho mais alto e, quando o sol nasceu, o buraco no céu se abriu. 🥚🌈\n\nOs monstrinhos acenaram e voltaram para casa. 🐙🪨🐡\n\nMas a Nevoinha ficou sozinha, encolhida no tronco da árvore, com medo do que ela não conhece... 🌫️💧\n\n(Que tal jogar de novo e convidar a Nevoinha para conhecer os monstrinhos?)'})
});
})();
