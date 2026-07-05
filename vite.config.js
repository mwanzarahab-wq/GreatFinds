import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Great Finds — Vite config
//
// Caching strategy follows the Frontend Production Roadmap (Section 2.2):
//   - App shell (JS/CSS): cached, versioned, served instantly
//   - Item images: cached with expiry, to save mobile data
//   - Supabase API calls (auth, items, bids): NEVER cached — always network.
//     Serving a stale bid price from cache is actively misleading, so those
//     routes are explicitly excluded below via navigateFallbackDenylist /
//     runtimeCaching NetworkOnly rules.

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Great Finds',
        short_name: 'GreatFinds',
        description: 'Zambian thrift marketplace and shoppable style feed',
        theme_color: '#D63384',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/realtime\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.endsWith('.supabase.co') &&
              (url.pathname.startsWith('/rest/') ||
                url.pathname.startsWith('/auth/') ||
                url.pathname.startsWith('/realtime/')),
            handler: 'NetworkOnly'
          },
          {
            urlPattern: ({ url }) =>
              url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/storage/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'great-finds-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 14
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
})