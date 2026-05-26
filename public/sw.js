const CACHE_NAME = 'pos-cache-v1';
// オフライン時でも絶対に手放さないファイルのリスト
const ASSETS = [
  '/DemoPos/',
  '/DemoPos/index.html',
  '/DemoPos/manifest.json',
  '/DemoPos/favicon.png',
  // ビルド後のJSやCSSもすべてこのサービスワーカーが自動で捕まえてキャッシュします
];

// 1. アプリのインストール時にファイルを筋トレのようにガッチリ保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. 古いキャッシュを綺麗に掃除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. 【超重要】通信が発生したら、ネットではなく端末内のキャッシュから一瞬で返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});