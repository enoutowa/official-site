self.addEventListener("push", event => {
  let data = {
    title: "鴛鴦トワ｜制作依頼チャット",
    body: "新しいメッセージがあります。",
    url: "./request-chat.html",
    tag: "request-chat"
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag || "request-chat",
      renotify: true,
      data: {
        url: data.url || "./request-chat.html"
      }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || "./request-chat.html";

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of allClients) {
      try {
        const clientUrl = new URL(client.url);
        const target = new URL(targetUrl, self.location.origin);

        if (
          clientUrl.origin === target.origin &&
          clientUrl.pathname === target.pathname
        ) {
          await client.navigate(target.href);
          return client.focus();
        }
      } catch {}
    }

    return clients.openWindow(targetUrl);
  })());
});
