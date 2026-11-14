/* ===== MUNDO 3: PLANETA MONSTRINHOS — capítulos 5 a 8 (a configuração do mundo está em monstrinhos.js) ===== */
(function(){
const sc=(art,text,choices,x)=>Object.assign({art,text,choices},x||{});
const T=(art,text,need,ok,fail,next)=>({test:{art,text,need,ok,fail,next}});
const B=(face,name,hp,intro,counter,win,next)=>({battle:{face,name,hp,intro,counter,win,next}});
const E=o=>Object.assign({end:1},o);
const peca=n=>`PEDAÇO ${n} DO CESTO 🧺 (${n} de 8)`;

/* os amigos que chegam ao piquenique (só os que não foram perdidos) */
const festa8=()=>[['pinchao','🦔 o Pinchão trouxe frutinhas fresquinhas'],['cochichona','🦉 a Cochichona contou só novidades verdadeiras'],['pincolino','🦀 o Pinçolino colocou conchas como pratos'],['cavoucao','🦫 o Cavoucão cavou uma mesa de pedra'],['calorao','🦎 o Calorão esquentou a sopa'],['friozao','🦣 o Friozão fez sorvete geladinho'],['bisbilhotao','👀 o Bisbilhotão contou quantos pratos faltavam']].filter(x=>amigo(x[0])).map(x=>x[1]).join('\n');

Object.assign(SC,{
 /* ===== CAPÍTULO 5: A COLINA QUENTINHA ===== */
 m5_inicio:sc('🌋☀️🌶️',()=>'O ar vai ficando quentinho, quentinho... é a COLINA QUENTINHA! 🌋☀️ As pedras fazem bolhinhas de calor e as pimentinhas crescem de todas as cores.'+(amigo('cavoucao')?'\n\nO Cavoucão 🦫 limpa o suor do capacete e vai na frente.':'')+'\n\nLá no alto, alguém reclama sem parar: "Que sono! Que sono!" 🥱\n\nO que vocês fazem?',
  [['🌶️ Colher pimentinhas coloridas','m5_pimentas'],['🪨 Pular de pedra em pedra','m5_pedras']],{title:'Capítulo 5: A Colina Quentinha'}),
 m5_pimentas:T('🌶️🌿','Tem pimentinhas vermelhas, amarelas e até roxas! O Gominha colhe com cuidado, sem encostar na boca.\n\nPrecisa tirar 3 ou mais.',3,
  {text:'Colheram uma PIMENTINHA QUENTINHA 🌶️: ela solta faíscas coloridas e tira 3 💜 de um monstrinho bravo!',fx(){return star()+give('m_pimenta')}},
  {text:'O Baiacão achou que era balinha e provou! PUUUF! Saiu fumaça pelas orelhas dele! 😂',fx(){return hurt()}},'m5_calorao_intro'),
 m5_pedras:{mini:{tipo:'pares',emojis:['☀️','🌶️','🌋','🦎'],art:'🪨🪨🪨',text:'As pedras quentes têm desenhos, e só dá para pular em pares iguais! 🪨\n\nAchem os pares para atravessar a colina sem queimar os pezinhos!',
  ok:'Todos os pares foram achados e vocês atravessaram a colina pulando sem queimar nenhum pezinho! 🦶✨',next:'m5_calorao_intro',fx(){return star()}}},
 m5_calorao_intro:sc('🦎😠☀️','No alto da colina, um lagartão laranja arrasta o rabo, sonolento:\n"EU SOU O CALORÃO! 🦎 Os monstrinhos da Montanha esconderam o meu sol com uma nuvem! Sem sol, eu fico com sono! E ouvi dizer que o cesto foi quebrado de propósito!"\n\nNo rabo dele está o '+peca(5)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para acordar ele','m5_calorao'],['💬 Perguntar sobre a nuvem','m5_perguntar'],['🦫 O Cavoucão mostra a caverna quentinha','m5_cavoucao','cavoucao']]),
 m5_perguntar:T('💬🦎','O Pedregulho sobe a colina bem devagarinho e conversa com o Calorão, deitado ao lado dele.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Calorão abriu um olho: "Alguém... perguntou... bocejo... a nuvem!" 🦎🥱',fx(){return star()},go:'m5_triste'},
  {text:'"Zzzz... não quero... zzz... conversa!" 🦎',go:'m5_calorao'}),
 m5_cavoucao:sc('🦫🕳️🦎','O Cavoucão explicou: "Na minha caverna é quentinho o dia inteiro! Quando a nuvem passa, você pode ir lá descansar!" 🦫\n\nO Calorão arregalou os olhos: "Eu... eu não sabia! Achei que a Montanha tinha escondido o sol de propósito!" 🦎',
  [['Continuar ➜','m5_triste']],{enter(){return star()}}),
 m5_calorao:B('🦎','Calorão',7,'"Zzz... Rabo Quentinho... zzz..." 🦎\n\nO Calorão está tão sonolento que ataca de olhos fechados!',
  ['O Calorão deu uma rabanada quentinha e todo mundo suou! 🔥','O Calorão bocejou e soltou uma fumacinha fofa! 🥱','O Calorão dormiu em pé e caiu em cima de todo mundo: PUF! 😴'],
  'O Calorão caiu sentado numa pedra quentinha e suspirou... 🦎💨','m5_triste'),
 m5_triste:sc('🦎💧☀️','O Calorão falou, bocejando:\n\n"Sem sol, eu fico lento e com sono, e todo mundo ri de mim. Eu tinha vergonha de pedir ajuda... então botei a culpa na Montanha." 😢\n\nO que vocês fazem?',
  [['☀️ Combinar: ele leva uma pedra quentinha para onde for','m5_final'],['🧺 Pegar o pedaço do cesto e ir embora','m5_final_embora']]),
 m5_final:E({gain:'calorao',art:'🦎💛☀️🎉',enter(){return star()},text:'O Pedregulho escolheu a pedra mais quentinha e o Gominha amarrou nas costas do Calorão, como uma mochila! 🪨☀️\n\nO Calorão ficou todo animado: "Agora eu não fico mais com sono! Obrigado!" 🦎💛\nEle entregou o '+peca(5)+' e disse: "Eu sou o CALORÃO e vou com vocês!"\n\nEle apontou: "Na MONTANHA GELADINHA tem um olhinho desenhado gigante na neve!" 🏔️👀\n\nA viagem continua...'}),
 m5_final_embora:E({lose:'calorao',art:'🧺🦎',text:'Vocês pegaram o '+peca(5)+' e foram embora. 🦎\n\nO Calorão ficou deitado na pedra, bocejando, sem sol e sem amigos... 💧\n\nLá longe, na neve da MONTANHA GELADINHA, brilhava um olhinho desenhado. 🏔️👀\n\n(Que tal jogar de novo e dar uma pedra quentinha para o Calorão?)'}),

 /* ===== CAPÍTULO 6: A MONTANHA GELADINHA ===== */
 m6_inicio:sc('🏔️❄️⛄',()=>'Brrr! A neve começa e o vento faz "uuuuh"! É a MONTANHA GELADINHA. 🏔️❄️'+(amigo('calorao')?'\n\nO Calorão 🦎 vai esquentando todo mundo com o rabo quentinho.':'')+'\n\nLá em cima, alguém espirra tão forte que cai neve de uma árvore: ATCHIM! 🤧\n\nO que vocês fazem?',
  [['🛷 Escorregar na neve','m6_neve'],['⛄ Montar o boneco de neve que quebrou','m6_boneco']],{title:'Capítulo 6: A Montanha Geladinha'}),
 m6_neve:T('🛷❄️','O Baiacão incha e vira um balão de neve, o Pedregulho vira bola e o Gominha escorrega de barriga!\n\nPrecisa tirar 3 ou mais.',3,
  {text:'WHEEEE! Escorregaram até lá em cima rindo! Na neve, ficou um FLOCO ESCUDO ❄️ que protege do próximo erro!',fx(){return star()+give('m_gelo')}},
  {text:'O Pedregulho rolou rápido demais e foi parar de cabeça num montinho de neve! 😂',fx(){return hurt()}},'m6_friozao_intro'),
 m6_boneco:{mini:{tipo:'quebra',emoji:'⛄',cols:2,rows:2,art:'⛄❄️🧩',text:'Um boneco de neve gigante quebrou em pedaços no caminho! ⛄\n\nMontem o boneco para poder passar!',
  ok:'O boneco de neve ficou inteirinho e piscou os olhos de carvão: "Obrigado! Podem passar!" ⛄✨',next:'m6_friozao_intro',fx(){return star()}}},
 m6_friozao_intro:sc('🦣😠❄️','Um mamutinho peludo tremendo aparece no meio da neve:\n"EU SOU O FRIOZÃO! 🦣 Os monstrinhos da Colina roubaram o calor das minhas cobertas! E me disseram que o cesto foi quebrado de propósito!"\n\nPendurado na lã dele está o '+peca(6)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ele se esquentar','m6_friozao'],['💬 Perguntar sobre as cobertas','m6_perguntar'],['🦎 O Calorão oferece a pedra quentinha','m6_calorao','calorao']]),
 m6_perguntar:T('💬🦣','O Gominha se enrola nele como um cobertor de gelatina e pergunta baixinho.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Friozão parou de tremer um pouquinho. "Ninguém... nunca... me abraçou..." 🦣',fx(){return star()},go:'m6_triste'},
  {text:'"Brrr! Estou com frio demais para conversar!" 🦣',go:'m6_friozao'}),
 m6_calorao:sc('🦎🪨🦣','O Calorão tirou a pedra quentinha das costas e entregou: "Segura! Quando esfria, é só colocar no sol!" 🦎\n\nO Friozão abraçou a pedra e fechou os olhos: "Quentinho... ah, que bom..." 🦣💛',
  [['Continuar ➜','m6_triste']],{enter(){return star()}}),
 m6_friozao:B('🦣','Friozão',7,'"Brrr! ATCHIM! Sopro Geladinho!" 🦣\n\nO Friozão sopra uma ventania de neve, mas a neve é fofinha e ninguém se machuca!',
  ['O Friozão espirrou e cobriu todo mundo de neve! ⛄','Uma bolinha de neve fofa acertou o Baiacão: POF! ❄️','O Friozão pisou e deixou uma pegada gigante na neve! 🦣'],
  'O Friozão sentou na neve, tremendo, todo encolhido... 🦣🥶','m6_triste'),
 m6_triste:sc('🦣💧❄️','O Friozão falou, batendo o queixo:\n\n"Eu sempre sinto frio, e os outros dizem que sou chato. Quando as cobertas sumiram, achei que a Colina tinha levado. Mas acho que o vento levou..." 😢\n\nO que vocês fazem?',
  [['🧶 Fazer uma coberta grande, de abraços e de lã','m6_final'],['🧺 Pegar o pedaço do cesto e ir embora','m6_final_embora']]),
 m6_final:E({gain:'friozao',art:'🦣💛🧶🎉',enter(){return star()},text:'Todo mundo se juntou num abraço enorme em volta do Friozão: o Gominha de gelatina, o Pedregulho, o Baiacão inchado e fofinho! 🧶\n\nO Friozão deu um sorriso quentinho: "Nunca tive tanto abraço de uma vez!" 🦣💛\nEle entregou o '+peca(6)+' e disse: "Eu sou o FRIOZÃO e vou com vocês!"\n\nEle olhou para o alto: "Naquela TORRE DA FOFOCA, no topo da montanha, tem muitos olhinhos desenhados..." 🗼👀\n\nA viagem continua...'}),
 m6_final_embora:E({lose:'friozao',art:'🧺🦣',text:'Vocês pegaram o '+peca(6)+' e foram embora. 🦣\n\nO Friozão ficou tremendo na neve, sozinho e com frio... 💧\n\nNo topo da montanha, uma torre alta brilhava, cheia de olhinhos desenhados: a TORRE DA FOFOCA. 🗼👀\n\n(Que tal jogar de novo e dar um abraço no Friozão?)'}),

 /* ===== CAPÍTULO 7: A TORRE DA FOFOCA ===== */
 m7_inicio:sc('🗼👀👂',()=>'No topo da montanha, uma torre estreita e torta, coberta de olhos e orelhas desenhados, sussurra com o vento: a TORRE DA FOFOCA! 🗼👀'+(amigo('friozao')?'\n\nO Friozão 🦣 tremeu: "Brrr! É aqui que começou tudo..."':'')+'\n\nDentro dela alguém cochicha sem parar... e alguém mais chora baixinho.\n\nO que vocês fazem?',
  [['🪜 Subir a escada de caracol','m7_escada'],['🔎 Abrir a porta dos olhos','m7_porta']],{title:'Capítulo 7: A Torre da Fofoca'}),
 m7_escada:T('🪜🗼','A escada de caracol tem mil degraus, e cada um faz um barulhinho diferente: nhec, nhoc, nhic!\n\nPrecisa tirar 4 ou mais.',4,
  {text:'Subiram até o último degrau sem ninguém cair, e encontraram uma LUPA DA VERDADE 🔎: ela dá +2 no próximo dado!',fx(){return star()+give('m_lupa')}},
  {text:'O Baiacão inchou no meio da escada e entalou: POP! Saiu quicando degrau abaixo, e voltou rindo! 😂',fx(){return hurt()}},'m7_bisbilhotao_intro'),
 m7_porta:{mini:{tipo:'sequencia',len:4,art:'👀🚪👀',text:'A porta da torre tem quatro olhos coloridos que piscam numa ordem! 👀\n\nPiscando igualzinho, a porta abre. Prestem atenção na sequência!',
  ok:'Os quatro olhos piscaram juntos e a porta abriu devagarinho: CREEEEC! 🚪✨',next:'m7_bisbilhotao_intro',fx(){return star()}}},
 m7_bisbilhotao_intro:sc('👀😢🗼','No meio da sala redonda, um monstrinho minúsculo, cheio de olhões, encolhido no chão:\n"Eu sou o BISBILHOTÃO! 👀 Fui eu que contei que a Vila quebrou o cesto de propósito. Eu inventei... Mas eu só queria que alguém viesse me visitar!"\n\nAo lado dele está o '+peca(7)+'.\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ele se acalmar','m7_bisbilhotao'],['💬 Perguntar por que ele inventou','m7_perguntar'],['🦉 A Cochichona conta o que aprendeu','m7_coruja','cochichona']]),
 m7_perguntar:T('💬👀','O Gominha senta no chão, no tamanho do Bisbilhotão, e pergunta sem bronca.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'O Bisbilhotão enxugou os olhões, um por um: "Ninguém... tinha me perguntado isso..." 👀💧',fx(){return star()},go:'m7_triste'},
  {text:'O Bisbilhotão ficou com vergonha e se escondeu atrás de um tapete! 🙈',go:'m7_bisbilhotao'}),
 m7_coruja:sc('🦉💬👀','A Cochichona pousou perto dele: "Eu também espalhei uma fofoca sem saber se era verdade... e todo mundo ficou brigado. Mas a gente pode consertar!" 🦉\n\nO Bisbilhotão arregalou os olhões: "Você também...? Eu achei que só eu tinha feito isso!" 👀',
  [['Continuar ➜','m7_triste']],{enter(){return star()}}),
 m7_bisbilhotao:B('👀','Bisbilhotão',8,'"Eu vejo tudo! Olhão Mágico!" 👀\n\nO Bisbilhotão pisca todos os olhos ao mesmo tempo, mas as piscadas só fazem cócegas!',
  ['O Bisbilhotão piscou tanto que todo mundo ficou tontinho! 😵‍💫','Os olhões do Bisbilhotão brilharam e deram um susto nos três! 👀','O Bisbilhotão espiou o Baiacão e o Baiacão ficou vermelho de vergonha! 😳'],
  'O Bisbilhotão sentou no chão, com os olhões fechados, soluçando... 👀💧','m7_triste'),
 m7_triste:sc('👀💧🗼','O Bisbilhotão falou, soluçando:\n\n"Eu moro sozinho nesta torre. Quando eu contava novidades, todo mundo vinha me escutar. Então comecei a inventar... mas agora todo mundo está brigado, e eu me sinto pior ainda." 😢\n\nO que vocês fazem?',
  [['🧺 Convidar ele para o piquenique, para desfazer a fofoca','m7_final'],['🧺 Pegar o pedaço do cesto e ir embora','m7_final_embora']]),
 m7_final:E({gain:'bisbilhotao',art:'👀💛🧺🎉',enter(){return star()},text:'O Gominha estendeu um tentáculo: "Vem com a gente ao piquenique! Lá você conta a verdade para todo mundo, e a gente vai junto!" 👀💛\n\nO Bisbilhotão abriu os olhões, um por um, e sorriu com todos: "Eu... eu posso? Prometo contar só coisas verdadeiras!"\nEle entregou o '+peca(7)+' e disse: "Eu sou o BISBILHOTÃO e vou com vocês!"\n\nEle chamou todo mundo para a janela: "Olhem lá embaixo! No CAMPO DO PIQUENIQUE tem alguém enorme dormindo..." 🦕\n\nA viagem continua para o grande final...'}),
 m7_final_embora:E({lose:'bisbilhotao',art:'🧺👀',text:'Vocês pegaram o '+peca(7)+' e foram embora. 👀\n\nO Bisbilhotão ficou sozinho na torre, olhando a janela com todos os olhões... 💧\n\nLá embaixo, no CAMPO DO PIQUENIQUE, tinha alguém enorme dormindo. 🦕\n\n(Que tal jogar de novo e convidar o Bisbilhotão para o piquenique?)'}),

 /* ===== CAPÍTULO 8: O GRANDE PIQUENIQUE ===== */
 m8_inicio:sc('🧺🌳🦕',()=>'No Campo do Piquenique, a grama é macia e tem um toco de mesa enorme, esperando o Cesto Grande. 🧺🌳'+(amigo('bisbilhotao')?'\n\nO Bisbilhotão 👀 está com os olhões arregalados, mas bem pertinho de vocês.':'')+'\n\nUm monstro ENORME, de pescoço comprido, dorme ali perto, ronc... ronc... 🦕 É a VOVÓ MONSTRONA, a monstrinha mais velha e maior do planeta!\n\nOs monstrinhos das 7 regiões começam a chegar, desconfiados e cochichando. 👀\n\nPrimeiro, vamos juntar os pedaços do cesto!',
  [['🧩 Montar o Cesto Grande','m8_cesto']],{title:'Capítulo 8: O Grande Piquenique'}),
 m8_cesto:{mini:{tipo:'quebra',emoji:'🧺',cols:2,rows:2,art:'🧺🧩🧩',text:'Os 8 pedaços do Cesto Grande estão em cima do toco de mesa! 🧺\n\nMontem o cesto para o piquenique poder começar!',
  ok:'CLIC! CLAC! O Cesto Grande ficou inteirinho! 🧺✨\n\nTodos os monstrinhos bateram palmas, e o barulho acordou alguém enorme...',next:'m8_vovo_intro',fx(){return star()}}},
 m8_vovo_intro:sc('🦕😠🌳','A Vovó Monstrona abriu um olho do tamanho de uma lua, e depois o outro:\n"QUEM... ESTÁ... FAZENDO... TANTO... BARULHO?" 🦕\n\nO vento do bocejo dela fez voar os guardanapos! 🍃\n\n"Eu só queria DORMIR! Briga, fofoca, gritaria... não aguento mais!"\n\nO que vocês fazem?',
  [['⚔️ Brincar de batalha para ela acordar de vez','m8_vovo'],['🎶 Cantar uma cantiga de ninar','m8_cantiga'],['💬 Perguntar o que a deixou tão chateada','m8_perguntar']]),
 m8_cantiga:{mini:{tipo:'sequencia',len:3,art:'🦕🎶🌙',text:'Todos os monstrinhos cantam uma cantiga de ninar bem baixinho, com três notas! 🎶\n\nRepitam as notas na ordem certa para a Vovó Monstrona sorrir.',
  ok:'A cantiga ficou tão bonita que a Vovó Monstrona sorriu, com os olhos fechadinhos... 🦕💤\n\n"Faz tempo que ninguém canta para mim..."',next:'m8_triste',fx(){return star()}}},
 m8_perguntar:T('💬🦕','O Pedregulho, o menor, sobe no focinho dela e pergunta devagarinho.\n\nPrecisa tirar 4 ou mais.',4,
  {text:'A Vovó Monstrona olhou bem de pertinho: "Nunca ninguém perguntou antes..." 🦕',fx(){return star()},go:'m8_triste'},
  {text:'A Vovó bocejou e fez um VENTÃO sem querer! 🌬️',go:'m8_vovo'}),
 m8_vovo:B('🦕','Vovó Monstrona',9,'"RONC! Eu quero dormir!" 🦕\n\nA Vovó Monstrona se mexe, e o chão balança como gelatina, mas ninguém se machuca!',
  ['A Vovó Monstrona espirrou e todo mundo voou nos guardanapos! 🍃','O bocejo da Vovó fez um vento que despenteou todo mundo! 🌬️','A Vovó balançou o rabo enorme... e varreu o campo inteiro, devagarinho! 🦕'],
  'A Vovó Monstrona deitou de novo, bocejando, com os olhos meio fechados... 🦕😴','m8_triste'),
 m8_triste:sc('🦕💧🧺','A Vovó Monstrona falou, bem baixinho:\n\n"As brigas e as fofocas me acordaram. E eu sou tão grande que todo mundo tem medo de mim... Ninguém me convida para os piqueniques." 😢\n\nTodos os monstrinhos olharam para o chão, envergonhados.\n\nO que vocês fazem?',
  [['🧺 Convidar a Vovó Monstrona para a mesa, no melhor lugar','m8_final'],['🌙 Deixar ela dormir sozinha','m8_final_embora']]),
 m8_final:E({gain:'vovomonstrona',art:'🦕💛🧺🎉',enter(){return star()+give('m_mel')},text:()=>'O Gominha estendeu um tentáculo: "Vovó, a senhora é a convidada de honra! Venha para a mesa!" 🦕💛\n\nA Vovó Monstrona sorriu com todos os dentes: "Eu... posso? Até eu, tão grande?" Todo mundo respondeu junto: "PODE!"\n\nO Cesto Grande foi aberto e o PIQUENIQUE DOS MONSTRINHOS começou! 🧺🎉\n'+festa8()+'\n🦕 a Vovó Monstrona cantou a cantiga de ninar mais bonita do mundo\n\nOs monstrinhos das 7 regiões pediram desculpa uns aos outros e se abraçaram: o planeta inteiro fez as pazes. 💛\nO Bisbilhotão contou a verdade para todo mundo, e as fofocas viraram histórias bonitas.\n\nO Gominha, o Pedregulho e o Baiacão sentaram juntos, comendo frutinhas. 🐙🪨🐡\n\n✨ FIM DA AVENTURA DO CESTO GRANDE ✨'}),
 m8_final_embora:E({lose:'vovomonstrona',art:'🌙🦕',text:'A Vovó Monstrona fechou os olhos e voltou a dormir, sozinha no campo. 🦕💤\n\nO piquenique aconteceu, e foi gostoso, mas a mesa ficou com uma cadeira enorme vazia... 😔\n\nO Gominha olhou para ela e entendeu: "Piquenique bom é aquele em que ninguém fica de fora." 🧺💛\n\n(Que tal jogar de novo e convidar a Vovó Monstrona para a mesa?)'})
});
})();
