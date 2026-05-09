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

// Handler pentru mesaje în background
// Citește titlul și body din data payload (nu din notification)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message primit:', JSON.stringify(payload));

  // Citește din notification (iOS/webpush) sau din data (Android data-only)
  const title = payload.notification?.title || payload.data?.title || 'MTC Transport';
  const body = payload.notification?.body || payload.data?.body || '';

  console.log('[SW] Afișez notificare:', title, body);

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'mtc-' + (payload.data?.type || Date.now()),
    data: payload.data || {},
    requireInteraction: true,
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificare apăsată:', event.notification.tag);
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

console.log('[SW] firebase-messaging-sw.js v2 activ ✓');
