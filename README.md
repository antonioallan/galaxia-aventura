# 🌈 Galáxia Aventura

Aventuras de livro-jogo para crianças, **em português do Brasil**, que rodam direto no navegador. Sem anúncios, sem cadastro, sem coleta de dados.

A criança (de preferência junto com um adulto) escolhe um mundo, depois um capítulo no mapa, e vive uma história com escolhas, testes de dado e batalhas divertidas, em que ninguém se machuca de verdade.

## Como jogar

Abra `aventuras/index.html` no navegador. Ou, para testar também o modo offline (instalável no celular):

```bash
npm run servir      # ou: python3 -m http.server 8765 --directory aventuras
```

e acesse <http://localhost:8765>.

## Mundos

- **Reino das Cores** 🌈: Bilu Bilu, Pegasus e Kay procuram o Cristal do Arco-Íris (10 capítulos + 2 especiais).
- **Planeta Florescer** 🌱: Liv, Lia e Bolota procuram as 9 Folhas Douradas da Árvore dos Desejos (10 capítulos).

## Estrutura

```
aventuras/
├── index.html            # página única
├── css/                  # estilos e fonte (Baloo 2, hospedada localmente)
├── js/
│   ├── reino-cenas.js    # heróis e cenas do Mundo 1 (caps. 1–4)
│   ├── engine.js         # motor: dado, batalhas, mapas, galáxia, progresso
│   ├── pwa.js            # registro do service worker
│   └── mundos/           # capítulos restantes de cada mundo
├── icons/  manifest.webmanifest  sw.js   # PWA / modo offline
tools/validar.js          # validador de conteúdo
docs/                     # documentação do projeto
```

## Validar o conteúdo

Depois de editar ou criar capítulos, rode:

```bash
npm run validar
```

O script confere se toda cena citada existe, se cada capítulo tem um final alcançável, se itens e amizades usados estão definidos, se os capítulos têm posição no mapa e se o `sw.js` guarda todos os arquivos para uso offline.

> Ao alterar qualquer arquivo do jogo, aumente o número de `CACHE` em `aventuras/sw.js` para que quem já instalou receba a versão nova.

## Progresso e privacidade

O progresso fica apenas no `localStorage` do navegador do jogador (chave `rpg_mundos_prog`). Nada é enviado para nenhum servidor e não há requisições a serviços externos.

## Licença

[MIT](LICENSE). A fonte Baloo 2 é distribuída sob a SIL Open Font License 1.1.

Veja o [resumo do projeto](docs/resumo-do-projeto.md) para detalhes das mecânicas e de como criar capítulos e mundos.
