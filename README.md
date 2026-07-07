# 🧵 Great Finds

**A Zambian thrift marketplace and shoppable style feed — combining auction-style buying with social discovery, built as a PWA for low-bandwidth mobile users.**

🔗 **Live demo:** _add your Netlify URL here_

---

## What is this?

Great Finds is a two-in-one shopping app for the Zambian secondhand fashion market:

- **Thrift Marketplace** — browse and bid on thrifted items from local partner stores in a live-auction format.
- **Style Feed** — a shoppable, Instagram-style feed of curated outfit posts linked directly to items you can buy.

Built as a Progressive Web App so it installs like a native app on mobile without requiring an app store, and works reliably on the patchy connections common in Zambia's urban centers.

## Tech Stack

`React` · `Vite` · `Supabase (Postgres, Auth, Realtime)` · `Zustand` · `React Router` · `PWA / Service Workers`

## Key Features & Design Decisions

- **Real-time bidding** — live bid updates flow through a single shared Zustand store per item, not a subscription per component, keeping the app fast under concurrent bidders.
- **Non-optimistic bids** — the UI always waits for the server's `place_bid` RPC to confirm before showing a success state, so users never see a bid price that could roll back.
- **Offline-aware** — a visible offline banner disables bidding entirely when connectivity drops, rather than silently
 queuing actions against a stale price.
npm install 
## Getting Started

1. **Install dependencies**

2. **Set up environment variables**

- **Resilient by design** — error boundaries wrap each routed section so one broken component can't crash the whole app; every data-fetching page explicitly handles loading, error, and empty states.
- **Cache-safe service worker** — explicitly excludes all Supabase API/auth/realtime traffic from PWA caching, so bid prices and auth state are never served stale.

## Project Structure
