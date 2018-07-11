import config from './config.js';

const VERSION = config.appVersion;

addEventListener('install', evt => {
  const staticAssets = [
    'images/favicon.ico',
    'images/icon_192.png',
    'images/return.png',
    'images/minilogo-hover.png',
    'images/cc0.png',
    'images/minilogo-connected-hover.png',
    'images/icon_128.png',
    'images/favicon.png',
    'images/icon_512.png',
    'images/minilogo-connected.png',
    'images/minilogo.png',
    'images/return-hover.png',
    'styles/dwst.css',
    'scripts/dwst.js',
    'manifest.json',
  ];
  const assetPaths = staticAssets.map(path => `/${VERSION}/${path}`);
  const entrypoints = ['/'];
  evt.waitUntil(caches.open(VERSION).then(cache => {
    cache.addAll(assetPaths.concat(entrypoints));
  }));
});

addEventListener('fetch', evt => {
  evt.respondWith(caches.match(evt.request).then(response => {
    if (response) {
      return response;
    }
    return fetch(evt.request);
  }));
});
