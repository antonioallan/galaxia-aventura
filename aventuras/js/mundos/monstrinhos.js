/* ===== MUNDO 3: PLANETA MONSTRINHOS — o mundo do Gominha, do Pedregulho e do Baiacão =====
   Os heróis aqui são monstrinhos. O Cesto Grande do Piquenique quebrou em 8 pedaços e uma fofoca ("a Vila quebrou de propósito!")
   deixou todas as regiões bravas. Em cada capítulo há um monstrinho bravo por causa da fofoca: dá para conversar, brincar de
   batalha e, no final feliz, ele vira amigo e passa a ajudar a equipe no capítulo seguinte (como companheiro).
   Capítulos 1 a 4 aqui; 5 a 8 em monstrinhos-cap5-8.js. Ids de cena com prefixo m1_ ... m8_. */
(function(){
const sc=(art,text,choices,x)=>Object.assign({art,text,choices},x||{});
const T=(art,text,need,ok,fail,next)=>({test:{art,text,need,ok,fail,next}});
const B=(face,name,hp,intro,counter,win,next)=>({battle:{face,name,hp,intro,counter,win,next}});
const E=o=>Object.assign({end:1},o);
const peca=n=>`PEDAÇO ${n} DO CESTO 🧺 (${n} de 8)`;

const HEROES3=[
 {name:'Gominha',face:'🐙',move:'Abraço de Gelatina 🍮'},
 {name:'Pedregulho',face:'🪨',move:'Rolinho Rochoso 🪨'},
 {name:'Baiacão',face:'🐡',move:'Inchaço Surpresa 🎈'}];

Object.assign(ITEMS,{
 m_biscoito:{name:'🍪 Biscoito de Amizade',type:'heal',v:3,desc:'+3 ❤️'},
 m_sino:{name:'🔔 Sininho Cochicho',type:'bonus',v:2,desc:'+2 no dado'},
 m_concha:{name:'🐚 Concha Escudo',type:'shield',desc:'protege do próximo erro'},
 m_cristal:{name:'💎 Cristal Eco',type:'dmg',v:2,desc:'tira 2 💜',fx:'O cristal fez ECO, ECO, ECO e o monstrinho ficou tonto de tanto brilho!'},
 m_pimenta:{name:'🌶️ Pimentinha Quentinha',type:'dmg',v:3,desc:'tira 3 💜',fx:'A pimentinha soltou faíscas coloridas: PUF, PUF, PUF!'},
 m_gelo:{name:'❄️ Floco Escudo',type:'shield',desc:'protege do próximo erro'},
 m_lupa:{name:'🔎 Lupa da Verdade',type:'bonus',v:2,desc:'+2 no dado'},
 m_mel:{name:'🍯 Mel do Piquenique',type:'heal',v:3,desc:'+3 ❤️'}
});

Object.assign(FAILS,{
 'Gominha':['O Gominha foi dar o Abraço de Gelatina... e grudou nele mesmo! 🐙','O Gominha esticou os braços e se enrolou todo, igual a um nó! 🪢','O Gominha tremeu de gargalhada e ficou todo molenga! 🍮','O Gominha abraçou um arbusto achando que era o monstrinho! 🌿','O Gominha escorregou na própria gosminha: PLOFT! 💦'],
 'Pedregulho':['O Pedregulho rolou... bem devagarinho, e o monstrinho nem viu! 🪨','O Pedregulho rolou para o lado errado e bateu numa árvore: TOC! 🌳','O Pedregulho ficou teimoso e não quis rolar de jeito nenhum! 😤','O Pedregulho rolou, rolou... e parou para tirar uma soneca! 😴','O Pedregulho quicou numa pedrinha e foi parar lá longe! 🪨💨'],
 'Baiacão':['O Baiacão foi inchar... e saiu só um soluço: HIC! 🐡','O Baiacão inchou tanto que saiu flutuando pelo céu! 🎈','O Baiacão inchou de susto e esqueceu de atacar! 😲','O Baiacão se olhou no reflexo e riu tanto que desinchou: PFFFF! 🤣','O Baiacão inchou para o lado errado, de costas para o monstrinho! 🙃'],
 'Pinchão':['O Pinchão rolou tão rápido que passou direto! 🦔💨','Os espinhos do Pinchão ficaram presos numa folha enorme! 🍂','O Pinchão se encolheu de vergonha na hora H! 🙈','O Pinchão rolou em círculos e ficou tontinho! 🌀'],
 'Cochichona':['A Cochichona começou a contar uma novidade e esqueceu de atacar! 💬','A Cochichona cochichou para o lado errado! 🙉','A Cochichona bateu as asas e levantou uma nuvem de penas: ATCHIM! 🪶','A Cochichona pousou de cabeça para baixo, de tanto cochichar! 🙃'],
 'Pinçolino':['O Pinçolino foi beliscar o monstrinho e beliscou o próprio pé! 🦀','O Pinçolino andou de lado... para longe do monstrinho! ↔️','O Pinçolino ficou com as pinças presas numa concha! 🐚','Uma ondinha veio e levou o Pinçolino para trás: SPLASH! 🌊'],
 'Cavoucão':['O Cavoucão cavou um buraco... e caiu dentro dele! 🕳️','O Cavoucão bateu a pá numa pedra: TÓIM! ⛏️','O Cavoucão saiu pelo túnel errado! 🚇','O capacete do Cavoucão caiu nos olhos dele! 🪖'],
 'Calorão':['O Calorão ficou tão quentinho que deu um bocejo enorme! 🥱','O Calorão tomou sol no meio do ataque! ☀️','O Calorão escorregou numa pedra quente e saiu deslizando! 🦎','O rabo quentinho do Calorão fez faísca... só para as próprias costas! 🔥'],
 'Friozão':['O Friozão espirrou: ATCHIM! E voou neve para todo lado! 🤧','O Friozão ficou tremendo e esqueceu de atacar! 🥶','O Friozão escorregou na própria neve: PUF! ❄️','O Friozão enrolou na própria lã e virou uma bola! 🧶'],
 'Bisbilhotão':['O Bisbilhotão piscou todos os olhos ao mesmo tempo e perdeu a mira! 👀','O Bisbilhotão ficou espiando outra coisa e esqueceu do ataque! 🔎','Os olhinhos do Bisbilhotão ficaram vesgos! 😵‍💫','O Bisbilhotão tropeçou nos próprios olhos... quer dizer, nos próprios pés! 👣']
});

Object.assign(FRIEND,{pinchao:['o Pinchão',1],cochichona:['a Cochichona',2],pincolino:['o Pinçolino',3],cavoucao:['o Cavoucão',4],calorao:['o Calorão',5],friozao:['o Friozão',6],bisbilhotao:['o Bisbilhotão',7],vovomonstrona:['a Vovó Monstrona',8]});

/* o amigo do capítulo anterior ajuda a equipe, se não foi perdido */
const amigoHeroi=(k,h)=>amigo(k)?[h]:[];
const CH3={
 1:{start:'m1_inicio',title:'A Vila Ovinho',heroes:[],rank:[4,2]},
 2:{start:'m2_inicio',title:'A Floresta dos Cochichos',get heroes(){return amigoHeroi('pinchao',{name:'Pinchão',face:'🦔',move:'Espinhos de Cócegas 🪥'})},rank:[4,2]},
 3:{start:'m3_inicio',title:'A Praia Marzão',get heroes(){return amigoHeroi('cochichona',{name:'Cochichona',face:'🦉',move:'Cochicho Doce 💬'})},rank:[4,2]},
 4:{start:'m4_inicio',title:'A Caverna Cintilante',get heroes(){return amigoHeroi('pincolino',{name:'Pinçolino',face:'🦀',move:'Pinça de Abraço 🦀'})},rank:[4,2]},
 5:{start:'m5_inicio',title:'A Colina Quentinha',get heroes(){return amigoHeroi('cavoucao',{name:'Cavoucão',face:'🦫',move:'Túnel Surpresa 🕳️'})},rank:[4,2]},
 6:{start:'m6_inicio',title:'A Montanha Geladinha',get heroes(){return amigoHeroi('calorao',{name:'Calorão',face:'🦎',move:'Rabo Quentinho ☀️'})},rank:[4,2]},
 7:{start:'m7_inicio',title:'A Torre da Fofoca',get heroes(){return amigoHeroi('friozao',{name:'Friozão',face:'🦣',move:'Sopro Geladinho ❄️'})},rank:[4,2]},
 8:{start:'m8_inicio',title:'O Grande Piquenique',get heroes(){return amigoHeroi('bisbilhotao',{name:'Bisbilhotão',face:'👀',move:'Olhão Mágico 🔎'})},rank:[4,2]}
};

Object.assign(SC,{
 /* ===== CAPÍTULO 1: A VILA OVINHO ===== */
 m1_inicio:sc('🥚🏡👾','No Planeta Monstrinhos vivem monstrinhos de todos os jeitos: de gelatina, de pedra, de pelo e de espinho! 👾\n\nTodos nascem de ovos coloridos na VILA OVINHO. 🥚 E três melhores amigos moram lá:\no GOMINHA 🐙, feito de gelatina, que adora abraçar;\no PEDREGULHO 🪨, que rola devagarinho e é teimoso;\no BAIACÃO 🐡, que incha de susto e desincha de rir.\n\nHoje é dia de preparar o GRANDE PIQUENIQUE 🧺, a festa em que monstrinhos de todas as regiões comem juntos.\n\nMas, de repente: CRAAAC! 💥 O Cesto Grande quebrou em 8 pedaços, que voaram para longe!\n\nE uma fofoca correu o planeta: "A Vila quebrou o cesto DE PROPÓSITO!" Cada região ficou brava e escondeu o pedaço que achou.\n\nPor onde começar a procurar?',
  [['🐾 Seguir as pegadas de olhinhos','m1_pegadas'],['🥚 Ajudar a Vovó Ovinho a acordar os ovinhos','m1_ovinhos']],{title:'Capítulo 1: A Vila Ovinho'}),
 m1_pegadas:T('👀🐾','Perto do cesto quebrado, há pegadas estranhas: no lugar de pés, têm OLHINHOS desenhados! 👀\n\nO Pedregulho, o Gominha e o Baiacão seguem o rastro, de nariz no chão.\n\nPrecisa tirar 3 ou mais.',3,
  {text:'O rastro termina num adesivo de olhinho colado numa pedra! 👀 "Quem anda por aqui?" Mas o caminho segue até um arbusto cheio de espinhos...',fx(){return star()}},
  {text:'O Pedregulho rolou em cima das pegadas e apagou tudo! 😅 Mas dava para ouvir uma bronca vindo do arbusto...',fx(){return hurt()}},'m1_pinchao_intro'),
 m1_ovinhos:{mini:{tipo:'pares',emojis:['🐙','🪨','🐡','🦔'],art:'🥚🥚🥚',text:'Na casa da Vovó Ovinho, vários ovinhos estão dormindo, cada um com um monstrinho dentro. 🥚\n\nEles só acordam quando alguém acha os dois ovos iguais, como no jogo da memória! 🃏',
  ok:'Os ovinhos racharam: CRAC! CRAC! Saíram monstrinhos bebês bocejando! 🐣\n\nA Vovó Ovinho ficou toda contente e deu um BISCOITO DE AMIZADE para a viagem. 🍪\n"Cuidado com o Pinchão, que está muito bravo com a Vila..."',next:'m1_pinchao_intro',fx(){return star()+give('m_biscoito')}}},
 m1_pinchao_intro:sc('🦔😠🍓','Atrás de um arbusto, uma bolinha de espinhos rola de raiva:\n"EU SOU O PINCHÃO! 🦔 Os monstrinhos da Vila roubaram as minhas frutinhas! E ainda quebraram o cesto de propósito!"\n\nNo chão está o '+peca(1)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ele se acalmar','m1_pinchao'],['💬 Perguntar o que aconteceu de verdade','m1_conversar']]),
 m1_conversar:T('💬🦔','O Gominha chega devagarinho e pergunta com jeitinho, sem pressa.\n\nPrecisa tirar 4 ou mais para o Pinchão escutar.',4,
  {text:'O Pinchão parou de rolar e desencolheu... "Ninguém perguntou antes! Só gritaram comigo!" 🦔',fx(){return star()},go:'m1_triste'},
  {text:'"Chega de conversa! TOMEM ESPINHOS!" 🦔',go:'m1_pinchao'}),
 m1_pinchao:B('🦔','Pinchão',4,'"VOU ENCHER VOCÊS DE ESPINHOS!" 🦔\n\nO Pinchão rola de raiva, mas nesta batalha ninguém se machuca de verdade!',
  ['Os espinhos do Pinchão fizeram cócegas em todo mundo! 🤣','O Pinchão rolou em cima dos pés de todo mundo: TOC, TOC! 🦔','O Pinchão soltou uma chuva de folhinhas secas! 🍂'],
  'O Pinchão cansou de rolar e parou, tonto, de barriga para cima... 🦔💫','m1_triste'),
 m1_triste:sc('🦔💧🍓','O Pinchão contou, baixinho:\n\n"As frutinhas caíram no riacho e foram parar na Vila. Os monstrinhos só estavam guardando! Mas um bichinho cheio de olhões 👀 cochichou que vocês tinham ROUBADO... Eu fiquei com medo de ficar sem comida." 🥺\n\nO que vocês fazem?',
  [['🍪 Dividir o biscoito e as frutinhas com ele','m1_final'],['🧺 Pegar o pedaço do cesto e ir embora','m1_final_embora']]),
 m1_final:E({gain:'pinchao',art:'🦔💛🍓🎉',enter(){return star()},text:'Vocês dividiram o biscoito e as frutinhas, e o Pinchão sorriu de orelha a orelha! 🦔💛\n\n"Desculpa pelos gritos! Eu sou o PINCHÃO e vou com vocês!" Ele entregou o '+peca(1)+'.\n\nO Pinchão contou: "O bichinho de olhões também passou pela FLORESTA DOS COCHICHOS!" 🌲👀\n\nA viagem continua...'}),
 m1_final_embora:E({lose:'pinchao',art:'🧺🦔',text:'Vocês pegaram o '+peca(1)+' e foram embora. 🦔\n\nO Pinchão ficou sozinho entre os arbustos, ainda com medo de ficar sem comida... 💧\n\nNa trilha, vocês viram olhinhos desenhados 👀 na direção da FLORESTA DOS COCHICHOS. 🌲\n\n(Que tal jogar de novo e dividir as frutinhas com o Pinchão?)'}),

 /* ===== CAPÍTULO 2: A FLORESTA DOS COCHICHOS ===== */
 m2_inicio:sc('🌲👂🦉',()=>'Com o '+peca(1)+' na mochila'+(amigo('pinchao')?' e o Pinchão 🦔 rolando ao lado, o Gominha, o Pedregulho e o Baiacão chegam':', o Gominha, o Pedregulho e o Baiacão chegam')+' na FLORESTA DOS COCHICHOS. 🌲\n\nAqui as árvores sussurram o tempo todo: "psiu... psiu..." 🤫 Tudo o que um monstrinho diz passa de folha em folha, cada vez mais embolado!\n\nPor onde vocês vão?',
  [['👂 Escutar os cochichos das folhas','m2_cochicho'],['🔔 Seguir o som de sininhos de flor','m2_sinos']],{title:'Capítulo 2: A Floresta dos Cochichos'}),
 m2_cochicho:{mini:{tipo:'sequencia',len:3,art:'🍃🍃🍃',text:'As folhas cochicham três sons, um de cada vez. 🍃\n\nSe alguém repetir igualzinho, na mesma ordem, a floresta mostra o caminho! Prestem atenção. 👂',
  ok:'As folhas ficaram felizes: "Escutou direitinho!" e abriram o caminho até uma árvore bem alta! 🌲✨',next:'m2_coruja_intro',fx(){return star()}}},
 m2_sinos:T('🔔🌸','Sininhos de flor tocam lá no alto! O Baiacão incha para subir e o Gominha estica os tentáculos...\n\nPrecisa tirar 3 ou mais.',3,
  {text:'O Gominha alcançou um sininho de prata: o SININHO COCHICHO 🔔! Quando toca, ele dá coragem e um empurrãozinho no dado!',fx(){return star()+give('m_sino')}},
  {text:'O Baiacão inchou demais e saiu quicando pela floresta: POF, POF, POF! 😂',fx(){return hurt()}},'m2_coruja_intro'),
 m2_coruja_intro:sc('🦉💬🌲','No alto da árvore, uma coruja de penas fofas fala sem parar:\n"Eu sou a COCHICHONA! 🦉 Sabiam? Um bichinho de olhões me contou que os monstrinhos da Vila quebraram o Cesto Grande de propósito! Já contei para TODO MUNDO!"\n\nEmbaixo dela está o '+peca(2)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ela escutar','m2_coruja'],['💬 Contar a verdade para ela','m2_verdade'],['🦔 Pedir para o Pinchão contar o que viveu','m2_pinchao','pinchao']]),
 m2_verdade:T('💬🦉','O Baiacão explica com calma: "A Vila não quebrou nada de propósito! O cesto caiu sozinho!"\n\nPrecisa tirar 4 ou mais para a Cochichona parar de falar e escutar.',4,
  {text:'A Cochichona fechou o bico, pela primeira vez no dia... 🦉🤐',fx(){return star()},go:'m2_triste'},
  {text:'"Piu-piu-piu! Eu não ouço, eu só falo!" 🦉',go:'m2_coruja'}),
 m2_pinchao:sc('🦔💬🦉','O Pinchão rolou até a árvore e contou: "Eu também acreditei na fofoca e quase fiquei sem amigos. A verdade é que a Vila só guardou minhas frutinhas!" 🦔\n\nA Cochichona arregalou os olhos: "Ah... então eu contei uma coisa sem saber se era verdade?" 🦉',
  [['Continuar ➜','m2_triste']],{enter(){return star()}}),
 m2_coruja:B('🦉','Cochichona',5,'"Piu-piu-piu! Cochicho, cochicho, cochicho!" 🦉\n\nA coruja bate as asas tão rápido que faz vento!',
  ['A Cochichona cochichou tão alto que todo mundo tapou as orelhas! 🙉','Uma chuva de penas fofas fez cócegas em todo mundo! 🪶','A Cochichona repetiu tudo o que o Baiacão disse, só que com voz de pato! 🦆'],
  'A Cochichona cansou de bater as asas e pousou num galho, de bico fechado... 🦉🤐','m2_triste'),
 m2_triste:sc('🦉💧💬','A Cochichona falou baixinho:\n\n"Eu amo contar novidades... mas nunca perguntei se eram verdade. Agora todo mundo está brigado por minha causa..." 😢\n\nO que vocês fazem?',
  [['🤝 Ensinar: antes de contar, a gente pergunta "será que é verdade?"','m2_final'],['🧺 Pegar o pedaço do cesto e ir embora','m2_final_embora']]),
 m2_final:E({gain:'cochichona',art:'🦉💛💬🎉',enter(){return star()},text:'Vocês combinaram juntos: "Antes de contar, pergunte: será que é verdade? Será que é gentil?" 🦉💛\n\nA Cochichona repetiu três vezes para não esquecer. Depois entregou o '+peca(2)+' e disse:\n"Agora eu cochicho só coisas boas! Eu vou com vocês!"\n\nEla contou: "O bichinho de olhões passou voando rumo à PRAIA MARZÃO!" 🏖️👀\n\nA viagem continua...'}),
 m2_final_embora:E({lose:'cochichona',art:'🧺🦉',text:'Vocês pegaram o '+peca(2)+' e foram embora. 🦉\n\nA Cochichona ficou no galho, sem entender direito o que tinha feito de errado... 💧\n\nNo céu, vocês viram uma pena com um olhinho desenhado 👀 apontando para a PRAIA MARZÃO. 🏖️\n\n(Que tal jogar de novo e ensinar a Cochichona a perguntar "será que é verdade?")'}),

 /* ===== CAPÍTULO 3: A PRAIA MARZÃO ===== */
 m3_inicio:sc('🏖️🌊🦀',()=>'O cheiro de sal chega no nariz: é a PRAIA MARZÃO! 🏖️ A água brilha e as ondas fazem espuma.'+(amigo('cochichona')?'\n\nA Cochichona 🦉 voa em círculos lá no alto, avisando o caminho.':'')+'\n\nDe longe, vem um barulho: "TRIC! TRIC! TRIC!" 🦀 É alguém batendo as pinças, muito bravo.\n\nO que vocês fazem primeiro?',
  [['🏰 Fazer um castelo de areia','m3_castelo'],['🐚 Procurar conchas na maré','m3_conchas']],{title:'Capítulo 3: A Praia Marzão'}),
 m3_castelo:T('🏰🏖️','O Pedregulho vira o balde, o Gominha molda e o Baiacão enfeita com bolhinhas...\n\nPrecisa tirar 3 ou mais.',3,
  {text:'Que castelo lindo! Dentro da torre, vocês acharam uma CONCHA ESCUDO 🐚: ela protege do próximo erro numa batalha!',fx(){return star()+give('m_concha')}},
  {text:'Uma onda veio e: SPLASH! 🌊 Levou o castelo... mas deixou todo mundo rindo e molhado!',fx(){return hurt()}},'m3_pincolino_intro'),
 m3_conchas:{mini:{tipo:'quebra',emoji:'🐚',cols:2,rows:2,art:'🐚🌊🏖️',text:'A maré deixou uma concha gigante, quebrada em pedaços, na areia! 🐚\n\nMontem a concha para ver o que tem dentro!',
  ok:'A concha se fechou com um CLIC! Dentro dela tinha um bilhete molhado: "Ajudem o Pinçolino. Ele perdeu uma coisa importante e está muito triste." 🦀',next:'m3_pincolino_intro',fx(){return star()}}},
 m3_pincolino_intro:sc('🦀😠🐚','Na beira da água, um caranguejo gigante bate as pinças: TRIC! TRIC!\n"EU SOU O PINÇOLINO! 🦀 Os monstrinhos da Caverna roubaram as minhas conchas! E um bichinho de olhões me contou que o cesto foi quebrado de propósito!"\n\nPendurado numa pinça dele está o '+peca(3)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha na areia','m3_pincolino'],['💬 Perguntar das conchas','m3_perguntar'],['🦉 A Cochichona pergunta: "será que é verdade?"','m3_coruja','cochichona']]),
 m3_perguntar:T('💬🦀','O Gominha se abaixa, bem pertinho do Pinçolino, e pergunta com jeitinho onde ele viu as conchas pela última vez.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Pinçolino parou de bater as pinças. "Elas... estavam aqui, na beira da água..." 🦀',fx(){return star()},go:'m3_triste'},
  {text:'"Perguntas, perguntas! TRIC TRIC!" 🦀',go:'m3_pincolino'}),
 m3_coruja:sc('🦉❓🦀','A Cochichona pousou na pinça dele e perguntou:\n"Será que é verdade que a Caverna roubou as suas conchas? Você viu alguém levando?"\n\nO Pinçolino parou: "Hm... eu não vi ninguém... só sumiram." 🦀🤔',
  [['Continuar ➜','m3_triste']],{enter(){return star()}}),
 m3_pincolino:B('🦀','Pinçolino',6,'"TRIC, TRIC! Minhas conchas!" 🦀\n\nO caranguejo anda de lado e levanta as pinças, mas só para parecer bravo!',
  ['O Pinçolino beliscou o ar com um TRIC enorme! 🦀','Uma onda de espuma molhou todo mundo: SPLASH! 🌊','O Pinçolino andou de lado e trombou numa pedra! 🪨'],
  'O Pinçolino sentou na areia, de pinças caídas, soprando bolhinhas... 🦀💦','m3_triste'),
 m3_triste:sc('🦀💧🐚','O Pinçolino falou, de pinças baixinhas:\n\n"As conchas eram a minha coleção... Acho que a maré levou. Mas eu tive vergonha de pedir ajuda e botei a culpa na Caverna." 😢\n\nO que vocês fazem?',
  [['🐚 Procurar conchas novas com ele','m3_final'],['🧺 Pegar o pedaço do cesto e ir embora','m3_final_embora']]),
 m3_final:E({gain:'pincolino',art:'🦀💛🐚🎉',enter(){return star()},text:'Todo mundo saiu pela praia catando conchas: uma azul, uma listrada, uma com espiral! 🐚🐚🐚\n\nO Pinçolino pulou de alegria: "Minha coleção está maior do que antes!" 🦀💛\nEle entregou o '+peca(3)+' e disse: "Eu sou o PINÇOLINO e quero ir junto!"\n\nEle apontou para o fundo do mar: "O bichinho de olhões foi visto entrando na CAVERNA CINTILANTE!" 🕳️👀\n\nA viagem continua...'}),
 m3_final_embora:E({lose:'pincolino',art:'🧺🦀',text:'Vocês pegaram o '+peca(3)+' e foram embora. 🦀\n\nO Pinçolino ficou na areia, olhando as ondas, ainda procurando as conchas... 💧\n\nNo fundo do mar, brilhava um olhinho desenhado 👀 apontando para a CAVERNA CINTILANTE. 🕳️\n\n(Que tal jogar de novo e ajudar o Pinçolino a procurar conchas?)'}),

 /* ===== CAPÍTULO 4: A CAVERNA CINTILANTE ===== */
 m4_inicio:sc('🕳️💎✨',()=>'A entrada da CAVERNA CINTILANTE brilha com cristais de todas as cores! 💎✨'+(amigo('pincolino')?'\n\nO Pinçolino 🦀 vai andando de lado ao lado de vocês, bem pertinho.':'')+'\n\nOs cristais fazem "ding... dong..." quando alguém passa. Lá do fundo vem um barulho: TOC! TOC! TOC! ⛏️\n\nO que vocês fazem?',
  [['💎 Seguir os cristais que cantam','m4_cristais'],['🛝 Descer pelo túnel escorregador','m4_tunel']],{title:'Capítulo 4: A Caverna Cintilante'}),
 m4_cristais:{mini:{tipo:'sequencia',len:4,art:'💎🎶💎',text:'Os cristais cantam uma melodia de QUATRO notas! 🎶\n\nO caminho só abre se alguém repetir igualzinho, na mesma ordem. Escutem com atenção!',
  ok:'Os cristais brilharam bem forte e abriram uma passagem! Um deles caiu na mão do Gominha: um CRISTAL ECO 💎, que tonteia um monstrinho com a sua luz!',next:'m4_cavoucao_intro',fx(){return star()+give('m_cristal')}}},
 m4_tunel:T('🛝🕳️','WHEEE! O túnel escorregador faz curvas e voltas, cada vez mais rápido!\n\nPrecisa tirar 3 ou mais.',3,
  {text:'Todo mundo chegou lá no fundo rindo, sem um arranhão! 🎢',fx(){return star()}},
  {text:'O Baiacão inchou no meio da descida e ficou entalado: POP! Saiu voando! 😂',fx(){return hurt()}},'m4_cavoucao_intro'),
 m4_cavoucao_intro:sc('🦫😠🕳️','No fundo da caverna, um monstrinho de dentes grandes e capacete de pedra bate a pá: TOC! TOC!\n"EU SOU O CAVOUCÃO! 🦫 Os monstrinhos da Praia alagaram os meus túneis! E um bichinho de olhões me disse que o cesto foi quebrado de propósito!"\n\nNo capacete dele está o '+peca(4)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha na caverna','m4_cavoucao'],['💬 Perguntar dos túneis','m4_perguntar'],['🦀 O Pinçolino explica a maré','m4_pincolino','pincolino']]),
 m4_perguntar:T('💬🦫','O Pedregulho senta pertinho e pergunta bem devagar, do jeito dele.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Cavoucão baixou a pá. "Meus túneis... estão cheios de água, eu fiquei sem casa!" 🦫',fx(){return star()},go:'m4_triste'},
  {text:'"Não quero conversa! Quero meus túneis!" 🦫',go:'m4_cavoucao'}),
 m4_pincolino:sc('🦀🌊🦫','O Pinçolino levantou as pinças: "Desculpa! Foi a maré alta, não fomos nós! Eu também achei que tinham roubado as minhas conchas, mas era só a maré." 🦀\n\nO Cavoucão coçou a cabeça: "A maré...? Hm, faz sentido..." 🦫',
  [['Continuar ➜','m4_triste']],{enter(){return star()}}),
 m4_cavoucao:B('🦫','Cavoucão',6,'"TOC, TOC! Fora da minha caverna!" 🦫\n\nO Cavoucão balança a pá e levanta poeira, mas só de brincadeira!',
  ['O Cavoucão cavou e jogou terra em cima de todo mundo! 🟤','A pá do Cavoucão fez TÓIM numa pedra e saiu faísca! ⛏️','O Cavoucão sumiu num buraco e apareceu atrás de todo mundo: BU! 🕳️'],
  'O Cavoucão sentou no buraco que ele mesmo cavou, com o capacete torto... 🦫🪖','m4_triste'),
 m4_triste:sc('🦫💧🕳️','O Cavoucão contou:\n\n"Eu cavei esses túneis a vida inteira. Agora estão alagados e eu não tenho onde guardar as minhas coisas. Fiquei com raiva e acreditei no bichinho de olhões." 😢\n\nO que vocês fazem?',
  [['⛏️ Ajudar a cavar um canal para a água sair','m4_final'],['🧺 Pegar o pedaço do cesto e ir embora','m4_final_embora']]),
 m4_final:E({gain:'cavoucao',art:'🦫💛⛏️🎉',enter(){return star()},text:'Todo mundo pegou uma pá: o Cavoucão cavou, o Pedregulho empurrou as pedras, o Gominha tirou a água com os braços e o Baiacão enfeitou com bolhinhas! ⛏️\n\nA água escorreu pelo canal novo e os túneis ficaram sequinhos! 🦫💛\n"Obrigado, amigos! Eu sou o CAVOUCÃO e vou com vocês!" Ele entregou o '+peca(4)+'.\n\nEle avisou: "Um calor estranho vem da COLINA QUENTINHA... e vi olhinhos desenhados lá!" ☀️👀\n\nA viagem continua...'}),
 m4_final_embora:E({lose:'cavoucao',art:'🧺🦫',text:'Vocês pegaram o '+peca(4)+' e foram embora. 🦫\n\nO Cavoucão ficou sentado entre os túneis cheios de água, sem saber por onde começar... 💧\n\nNa saída da caverna, tinha um olhinho desenhado 👀 apontando para a COLINA QUENTINHA. ☀️\n\n(Que tal jogar de novo e ajudar o Cavoucão a cavar o canal?)'})
});

WORLDS.monstrinhos={id:'monstrinhos',name:'Planeta Monstrinhos',icon:'👾',desc:'Gominha, Pedregulho e Baiacão, três monstrinhos amigos, viajam pelo planeta para consertar o Cesto Grande do Piquenique e fazer novos amigos.',bg:'linear-gradient(135deg,#9a8cf0,#ff9ad0 55%,#ffe27a)',
 heroes:HEROES3,chapters:CH3,
 planet:{x:322,y:392,r:46,label:'Planeta Monstrinhos',sea:'#9a8cf0',dark:'#3b2f8a',glow:'#ff8fd0',top:'👾',
  lands:[[-.4,-.15,.4,.28,'#8fe3a8'],[.35,.3,.36,.24,'#ff9ad0'],[.1,-.55,.28,.15,'#ffe27a'],[-.2,.55,.3,.14,'#8fd6ff']],
  deco:[['🥚',-.4,-.18,.24],['🍄',.34,.3,.22],['🪨',.1,-.55,.2],['👀',-.15,.12,.2]]},
 map:{h:770,sea:'#7d8cf0',startIcon:'🥚',trophy:9,
  icons:{1:'🥚',2:'🌲',3:'🏖️',4:'💎',5:'🌋',6:'🏔️',7:'🗼',8:'🧺'},
  colors:{1:'#8fd96a',2:'#4fbf8f',3:'#4fb8ee',4:'#b896ff',5:'#ff8a3d',6:'#8fc7ff',7:'#ff7aa2',8:'#ffc83d'},
  path:[[62,712,0],[140,660,0],[235,705,0],[330,640,1],[322,520,0],[250,440,1],[130,285,0],[240,235,0],[110,160,0],[235,100,0]],
  nodes:{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8},
  islands:[
   {pts:'25,610 372,598 382,745 22,745',top:'#b5e68c',edge:'#8fc965'},
   {pts:'212,395 385,390 390,562 205,568',top:'#f2cf8a',edge:'#d8ab58'},
   {pts:'20,60 380,55 385,335 20,340',top:'#e6dcff',edge:'#c4b2f2'}],
  rocks:[[200,580],[212,596],[190,378],[10,420],[390,350],[8,560]],
  overlay:poly=>poly('90,255 175,245 182,330 95,335','#f4fbff',0)+`<ellipse cx="300" cy="680" rx="38" ry="20" fill="#9fd8f0" stroke="#e3f6ff" stroke-width="3"/>`,
  deco:[['🏡',100,690,20],['🥚',40,660,16],['🍓',190,650,16],['🌲',60,625,20],['🌲',270,665,18],['🌿',185,730,14],['🐚',365,700,16],['🌊',355,615,16],
   ['💎',280,410,18],['🕳️',360,470,16],['🌶️',230,520,16],['⛏️',350,540,14],['🌋',215,430,20],
   ['⛄',60,300,22],['🏔️',50,230,22],['❄️',170,300,14],['🗼',330,270,22],['👀',300,190,16],['🌸',40,110,16],['🌳',350,120,22],['🐦',300,90,14],
   ['⛵',150,590,18],['🐟',380,585,13],['🐙',15,585,16]]}
};
})();
