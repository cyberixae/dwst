self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.status === 404) {
        return fetch('404.html');
      }
      return response;
    })
  );
});
