import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient.js'

export const useAuctionStore = create((set, get) => ({
  items: {},
  _channels: {},

  setItemSnapshot: (itemId, snapshot) =>
    set((state) => ({
      items: { ...state.items, [itemId]: { ...state.items[itemId], ...snapshot } }
    })),

  subscribeToItem: (itemId) => {
    const { _channels } = get()
    if (_channels[itemId]) return

    const channel = supabase
      .channel(`item-${itemId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'items', filter: `id=eq.${itemId}` },
        (payload) => {
          get().setItemSnapshot(itemId, {
            currentPrice: payload.new.current_price,
            status: payload.new.status,
            endsAt: payload.new.ends_at
          })
        }
      )
      .subscribe()

    set((state) => ({ _channels: { ...state._channels, [itemId]: channel } }))
  },

  unsubscribeFromItem: (itemId) => {
    const { _channels } = get()
    const channel = _channels[itemId]
    if (!channel) return

    supabase.removeChannel(channel)
    set((state) => {
      const next = { ..._channels }
      delete next[itemId]
      return { _channels: next }
    })
  }
}))