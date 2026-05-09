// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA1O2Lw3unTXECgCtp2bdYuHjgfVqPEW6U",
  authDomain: "flota-firma.firebaseapp.com",
  projectId: "flota-firma",
  storageBucket: "flota-firma.firebasestorage.app",
  messagingSenderId: "281579444434",
  appId: "1:281579444434:web:facb358aa0434a2c00b50b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message primit:', payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'MTC Transport', {
    body: body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'mtc-' + (payload.data?.type || Date.now()),
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('mtctransportgmbh.github.io') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('https://mtctransportgmbh.github.io');
    })
  );
});

console.log('[SW] firebase-messaging-sw.js activ la rădăcina domeniului ✓');
