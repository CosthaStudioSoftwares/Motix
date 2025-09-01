// Define um nome e versão para o cache
const CACHE_NAME = 'motix-pro-cache-v1';

// Lista de URLs e recursos essenciais para o funcionamento offline
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
];

// Evento 'install': é disparado quando o Service Worker é instalado pela primeira vez.
self.addEventListener('install', (event) => {
  // O service worker espera até que a promessa dentro de waitUntil seja resolvida.
  event.waitUntil(
    // Abre o cache com o nome que definimos
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto:', CACHE_NAME);
        // Adiciona todas as URLs essenciais ao cache.
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'fetch': é disparado para cada requisição que a página faz (imagens, scripts, etc.).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Tenta encontrar uma resposta para a requisição no cache.
    caches.match(event.request)
      .then((response) => {
        // Se encontrar no cache, retorna a resposta do cache.
        if (response) {
          return response;
        }
        // Se não encontrar, faz a requisição à rede.
        return fetch(event.request);
      })
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
// É um bom lugar para limpar caches antigos.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Se o nome do cache não estiver na nossa "lista branca", ele é excluído.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
