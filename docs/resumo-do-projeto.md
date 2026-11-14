# Galáxia Aventura — Resumo do Projeto

## Visão geral

Jogo de aventura infantil em formato de livro-jogo (RPG simples), em **português do Brasil**, que roda inteiramente no navegador. Não há backend, build ou dependências: é HTML + CSS + JavaScript puro. A única chamada externa é a fonte *Baloo 2* (Google Fonts).

O jogador navega por uma **galáxia de mundos**, escolhe um mundo, depois um capítulo no mapa, e vive uma história com escolhas, testes de dado e batalhas contra inimigos engraçados. O tom é leve e fofo (erros viram piadas, ninguém se machuca de verdade), pensado para crianças pequenas.

## Estrutura de arquivos

```
galaxia-aventura/
├── README.md  LICENSE  package.json  .gitignore
├── docs/
│   └── resumo-do-projeto.md
├── tools/
│   └── validar.js               # validador de conteúdo (npm run validar)
└── aventuras/
    ├── index.html               # página única, só carrega CSS e scripts
    ├── manifest.webmanifest     # PWA
    ├── sw.js                    # service worker (modo offline)
    ├── css/
    │   ├── fonts.css            # @font-face da Baloo 2 (local)
    │   └── style.css            # estilos do jogo
    ├── fonts/baloo2-latin.woff2
    ├── icons/                   # ícones do app (SVG e PNG)
    └── js/
        ├── reino-cenas.js       # Mundo 1: heróis (HEROES), SLIP e cenas dos caps. 1–4
        ├── engine.js            # tabela CH, estado, dado, batalhas, mapas, galáxia, progresso
        ├── nomes.js             # nomes personalizáveis dos heróis
        ├── dado.js              # opção de dado de verdade
        ├── pwa.js               # registra o service worker
        └── mundos/
            ├── reino-cap5-10.js     # Mundo 1: capítulos 5 a 10
            ├── reino-especiais.js   # Mundo 1: capítulos especiais 11 e 12
            └── florescer.js         # Mundo 2: Planeta Florescer
```

A ordem dos scripts no `index.html` importa: `reino-cenas.js` define `SC` e `HEROES`, `engine.js` define o motor, e os arquivos de `mundos/` estendem `SC`, `CH`, `ITEMS` e `FAILS` com `Object.assign`.

Para jogar, abra `aventuras/index.html` no navegador. Para testar o modo offline, sirva a pasta por HTTP (`npm run servir`).

## Mundos e capítulos

### Mundo 1 — Reino das Cores 🌈
Heróis: **Bilu Bilu**, **Pegasus** e **Kay**. Objetivo: recuperar o Cristal do Arco-Íris.

| Cap. | Título | Companheiro novo |
|---|---|---|
| 1 | O Cristal do Arco-Íris | — |
| 2 | O Sumiço da Lua | Faísca 🐲 |
| 3 | O Tesouro do Fundo do Mar | Pipoca 🐬 |
| 4 | A Viagem ao Espaço | Estrelinha ⭐ |
| 5 | A Ilha dos Dinossauros | Tritri 🦕 |
| 6 | O Circo Sem Risadas | Pirulito 🤡 |
| 7 | O Inverno Que Não Acaba | Picolé 🐧 |
| 8 | A Cidade dos Brinquedos | Fofão 🧸 |
| 9 | O Ladrão de Sonhos | Brisa 🦄 |
| 10 | A Grande Festa dos Heróis | Faísca + Brisa |
| 11 *(especial)* | Tio Bala Bala e a Pequena Duda | Bala Bala 👨, Duda 👧 |
| 12 *(especial)* | Liv e Lia no Livro Mágico | Liv 🦸‍♀️, Lia 👶 |

Os capítulos especiais 11 e 12 só aparecem no mapa depois de concluir o capítulo 10.

### Mundo 2 — Planeta Florescer 🌱
Heróis: **Liv**, **Lia** e **Bolota** 🐿️. Jornada linear em busca das 9 Folhas Douradas da Árvore dos Desejos.

| Cap. | Título |
|---|---|
| 1 | A Árvore dos Desejos |
| 2 | O Vale dos Cogumelos |
| 3 | O Pântano das Rãs Cantoras |
| 4 | O Deserto das Areias Cantantes |
| 5 | A Floresta de Bambu |
| 6 | A Cidade das Nuvens |
| 7 | O Lago Espelhado |
| 8 | A Horta Gigante |
| 9 | O Monte Oco |
| 10 | A Festa das Lanternas (companheiro: Tico 🦊) |
| 11 *(especial)* | Tico, Trovãozinho e as Três Estrelinhas (amigo: Cometinha ☄️) |
| 12 *(especial)* | Os Monstrinhos Chegaram! Crossover com o Planeta Monstrinhos (amiga: Nevoinha 🌫️) |

Os capítulos 11 e 12 estão em `js/mundos/florescer-especiais.js` e só aparecem no mapa depois de concluir o capítulo 10. O 11 é um spin-off com coadjuvantes (contador de 3 estrelinhas); o 12 traz Gominha, Pedregulho e Baiacão como heróis extras (contador de 3 lugares sem medo) e, no final, cita os amigos que a criança fez no Planeta Monstrinhos (`figuraGanha()`).

A galáxia também exibe um planeta misterioso "Em breve", indicando espaço para novos mundos.

## Mecânicas de jogo

- **Cenas (`SC`)**: dicionário de cenas com arte em emojis, texto (string ou função) e escolhas. Cada cena pode ser narrativa, um **teste** ou uma **batalha**.
- **Dado d6**: gerado com `crypto.getRandomValues`, com animação. Em testes, a primeira falha dá uma segunda tentativa automática.
- **Batalhas**: o jogador escolhe um herói a cada turno. Resultado do dado (+ bônus): 1–2 erro (inimigo contra-ataca e custa ❤️), 3–4 acerto (−1 de energia do inimigo), 5–6 super golpe (−2); um 6 puro dá ⭐.
- **Corações e Fada Luzinha**: começa com 5 ❤️. Ao zerar, a fada devolve 3 corações, até 3 vezes por capítulo. Depois disso os heróis descansam numa tela de recuperação e podem refazer a batalha.
- **Itens (`ITEMS`)**: tipos `bonus` (soma no dado), `heal` (cura), `dmg` (tira energia do inimigo) e `shield` (protege do próximo erro).
- **Mensagens de falha (`FAILS`)**: frases engraçadas e específicas por herói, sem repetir a anterior seguida.
- **Estrelas e ranking**: cada capítulo tem notas de ranking (`rank`) e guarda a melhor pontuação em estrelas.
- **Sistema de amizades**: inimigos poupados em finais felizes viram amigos (Faísca, Bruxa Trapalhona, Pirata Barba-de-Algodão-Doce, Robô Parafuso, Mágico etc.) e voltam nos capítulos seguintes. Alguns capítulos têm pré-requisitos (`needs`) e ficam bloqueados se a amizade foi perdida.
- **Leitura em voz alta**: botão 🔊 usando `speechSynthesis` em pt-BR, com emojis removidos do texto.

## Interface

- Layout mobile-first (coluna de até 560px), com layout de tela cheia a partir de 900px: galáxia e mapas ocupam a tela e um cartão flutuante mostra o capítulo selecionado.
- **Galáxia** (`worldsHTML`): planetas em SVG, um por mundo.
- **Mapa do mundo** (`mapHTML`): caminho SVG com nós por capítulo, ilhas, decorações e uma seção "Capítulos Especiais".
- Visual colorido, botões grandes estilo "3D", fonte arredondada e muitos emojis como arte.

## Nomes personalizáveis

Na galáxia, o botão **✏️ Personalizar nomes** abre um formulário com os seis heróis principais (Bilu Bilu, Pegasus, Kay, Liv, Lia e Bolota). Para cada um a família escolhe um nome e se é menino ou menina.

- As histórias continuam escritas com os nomes originais. `nomes(html)` (em `js/nomes.js`) troca os nomes **só no texto mostrado**, chamado por `render()`; tags HTML e lógica (como as frases de falha, indexadas por nome) não mudam.
- Ao mudar o gênero, os artigos acompanham: "o chapéu do Kay" vira "o chapéu da Maria".
- O emoji do herói também acompanha o gênero (`faceDe()`, usando `faces` de cada slot) na batalha, no cartão da galáxia e no marcador do mapa.
- Limite conhecido: adjetivos e pronomes no texto ("ficou tontinho", "ele") não mudam com o gênero. Emojis dentro da arte das cenas também permanecem os originais.
- Para tornar outro personagem personalizável, inclua-o em `SLOTS`. Os testes de `nomes()` ficam em `tools/validar.js`.
- Salvo em `localStorage`, chave `rpg_nomes`.

## Dado de verdade (opcional)

Na mesma tela de personalizar, a família escolhe **Dado do jogo (na tela)** ou **Meu dado de verdade**.

- Todo lançamento (testes, batalhas e colheita de frutinhas) passa por `roll(cb, dica)` em `engine.js`. No modo físico, `roll()` chama `pedirDado()` (`js/dado.js`), que abre uma janela com as 6 faces do dado desenhadas em bolinhas. A criança toca na face que saiu e confirma; o resultado entra como se fosse o digital.
- A janela mostra uma dica do que cada resultado significa e tem "Cancelar". Também aceita teclado (1 a 6, Enter, Esc).
- O padrão é o dado digital. A escolha fica em `localStorage`, chave `rpg_dado`.

## Persistência

Progresso salvo em `localStorage` na chave `rpg_mundos_prog` (os nomes escolhidos ficam em `rpg_nomes` e o tipo de dado em `rpg_dado`), separado por mundo (`reino`, `florescer`...). Há migração automática da chave antiga `rpg_bilu_prog` para o Mundo 1. Também existe uma opção discreta de ajuste de progresso (pular para um capítulo) e de reiniciar o progresso.

## Como estender

- **Novo capítulo**: criar as cenas em `SC` (ou arquivo `.js` novo usando `Object.assign(SC, {...})`), registrar em `CH` com `start`, `title`, `heroes` e `rank`, e mapear o nó no mapa do mundo (`nodes`).
- **Novo mundo**: seguir o padrão de `mundo-florescer.js` (IIFE com helpers `sc`, `T`, `B`, `E`; ids de cena com prefixo próprio) e registrar uma entrada em `WORLDS` com `heroes`, `chapters`, `planet` e `map`.
- **Novos itens ou falhas**: `Object.assign(ITEMS, ...)` e `Object.assign(FAILS, ...)`.

## Observações

- O repositório git foi iniciado, mas ainda sem commits. Não há testes automatizados de jogo; a verificação de conteúdo é feita por `tools/validar.js`.
- Ao alterar qualquer arquivo do jogo, aumente `CACHE` em `aventuras/sw.js` para os jogadores receberem a versão nova.
- Todo o conteúdo e a lógica ficam no cliente; basta servir a pasta `aventuras/` como arquivos estáticos para publicar.

## Liberação de mundos

Cada mundo só abre depois de concluir **todos os capítulos normais** (os especiais não contam) do mundo anterior: Reino das Cores → Planeta Florescer → Planeta Monstrinhos.

- Cada mundo declara `req:'id-do-mundo-anterior'` em `WORLDS` (o primeiro não tem `req`). Para um mundo novo, basta pôr o `req` dele.
- `mundoCompleto(w)`, `mundoLiberado(w)` e `liberaMundos()` ficam em `engine.js`. Na galáxia, o planeta bloqueado aparece apagado com 🔒, e o cartão mostra quantas fases faltam e um botão para ir ao mundo anterior. `viajar(w)` recusa a entrada.
- Ao concluir o último capítulo do mundo anterior, o fim do capítulo mostra "🌟 NOVO MUNDO LIBERADO!" com um botão para ver o planeta.
- O desbloqueio fica salvo em `ALLPROG._lib` (chave `rpg_mundos_prog`), então "Reiniciar fases" não tranca de novo. Quem já tinha progresso num mundo antes desta regra continua com acesso.
- O `validar.js` confere que existe um único mundo inicial, que não há ciclos e que as regras abrem e fecham como esperado.

## Segredos e finais secretos (`js/segredos.js`)

Em cada capítulo normal há uma **escolha misteriosa** (botão tracejado) que leva a uma cena escondida com um **tesouro bônus**. Alguns capítulos finais também têm um **final secreto**. São 31 segredos: 28 tesouros (10 no Reino, 10 no Florescer, 8 nos Monstrinhos) e 3 finais secretos (O Rei das Cores, O Desejo para Todos os Mundos, A Toalha Dourada).

- **Como se registra:** `seg({id, mundo, ch, de, label, emoji, nome, item, art, text})` no fim de `segredos.js`. `de` é a cena (só com escolhas) onde o botão aparece. Final secreto: escreva a cena em `SC` com `end:1`, `gain` e `segredo:'id'`, e registre com `cena:'id_da_cena'`.
- **Efeito:** achar dá +1 ⭐ na partida, um item bônus (`s_sorte`, `s_gema`, `s_escudo`, `s_brilho`), som e chuva de chaves e tesouros. A cena de tesouro volta sozinha para a cena de origem (`voltarSeg()`), sem repetir estrelas ou itens dessa cena. O botão some depois de usado na partida.
- **Registro:** fica em `PROG.segredos` (por mundo). Aparece como "🗝️ Segredos: x de y" no cartão do capítulo no mapa, no fim do capítulo (com um incentivo para jogar de novo) e numa seção do álbum, com "❓ Segredo escondido" para os que faltam.
- O `validar.js` confere que cada segredo tem capítulo, cena de origem só com escolhas, cena de destino com a marca certa e item existente.
