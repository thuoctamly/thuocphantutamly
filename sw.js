const CACHE_NAME = "freud-ruler-v5-offline"; // Đổi tên cache mới

const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "alert-amber.mp3",
  "alert-red.mp3",
  "success.mp3",
  "click.mp3",
 "sieunganhe.mp3",
 "bannangnhe.mp3"
];

// 1. CÀI ĐẶT: Cache toàn bộ tài nguyên
self.addEventListener("install", event => {
  self.skipWaiting(); // Kích hoạt ngay, không chờ
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log("Đang tải tài nguyên vào cache offline...");
      return cache.addAll(ASSETS);
    })
    .catch(err => console.error("Lỗi khi cache file (Kiểm tra lại tên file):", err))
  );
});

// 2. KÍCH HOẠT: Xóa cache cũ rác
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Đang xóa cache cũ:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH: Chế độ Offline-First (Ưu tiên lấy từ cache)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Nếu có trong cache thì dùng luôn (Offline)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Nếu không thì tải từ mạng
      return fetch(event.request).catch(() => {
          // Nếu mất mạng hoàn toàn và không có cache, trả về index.html
          if (event.request.mode === 'navigate') {
              return caches.match('index.html');
          }
      });
    })
  );

});

