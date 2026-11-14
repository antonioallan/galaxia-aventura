/* Service worker: guarda o jogo todo para funcionar offline.
   Ao mudar qualquer arquivo, aumente CACHE para os jogadores receberem a versão nova. */
const CACHE = 'galaxia-aventura-v11';
const ARQUIVOS = [
  './', 'index.html', 'manifest.webmanifest',
  'css/fonts.css', 'css/style.css',
  'fonts/baloo2-latin.woff2',
  'js/reino-cenas.js', 'js/engine.js', 'js/nomes.js', 'js/dado.js', 'js/som.js', 'js/festa.js', 'js/album.js', 'js/minijogos.js', 'js/pwa.js',
  'js/mundos/reino-cap5-10.js', 'js/mundos/reino-especiais.js', 'js/mundos/florescer.js', 'js/mundos/monstrinhos.js', 'js/mundos/monstrinhos-cap5-8.js', 'js/mundos/florescer-especiais.js', 'js/segredos.js',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
