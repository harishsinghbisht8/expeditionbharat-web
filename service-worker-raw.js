workbox.skipWaiting();
workbox.clientsClaim();

const htmlStrategy = workbox.strategies.networkFirst({
	cacheName: 'html_pages',
	plugins: [
		new workbox.expiration.Plugin({
			maxEntries: 50,
			maxAgeSeconds: 1296000,
		}),
		new workbox.cacheableResponse.Plugin({
			statuses: [0, 200]
		})
	]
});

workbox.routing.registerRoute(function(obj) {
	var request = obj.event.request;
	return "GET" === request.method && request.headers.get("accept").includes("text/html") && (obj.url.hostname.includes('.expeditionbharat.com') || obj.url.hostname.includes('localhost'));
}, function(obj) {
	return htmlStrategy.handle({event:obj.event}).then(function(response) {
		if(response) return response;
    	return caches.match("/").then(function(o) {
            return o
        })
	});
});

workbox.precaching.precacheAndRoute(self.__precacheManifest);
workbox.precaching.precache([{"url": "/", "revision": ""+(new Date()).getTime()}]);
workbox.routing.registerRoute(
	new RegExp('.*/js/dist/.*'),
	new workbox.strategies.CacheFirst({
		cacheName: 'scripts',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 50,
				maxAgeSeconds: 1296000,
			}),
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200]
			})
		]
	})
);

workbox.routing.registerRoute(
	new RegExp('.*/img/.*'),
	new workbox.strategies.CacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 100,
				maxAgeSeconds: 1296000,
			}),
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200]
			})
		]
	})
);