import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { useAuctionStore } from '../store/useAuctionStore.js'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'

export default function ItemDetail() {
  const { itemId } = useParams()
  const [item, setItem] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [bidAmount, setBidAmount] = useState('')
  const [bidState, setBidState] = useState('idle')
  const [bidError, setBidError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const liveSnapshot = useAuctionStore((state) => state.items[itemId])
  const subscribeToItem = useAuctionStore((state) => state.subscribeToItem)
  const unsubscribeFromItem = useAuctionStore((state) => state.unsubscribeFromItem)

  const currentPrice = liveSnapshot?.currentPrice ?? item?.current_price
  const status = liveSnapshot?.status ?? item?.status

  useEffect(() => {
    const fetchItem = async () => {
      setLoadError(null)
      const { data, error } = await supabase.from('items').select('*').eq('id', itemId).single()
      if (error) {
        setLoadError(error.message)
        return
      }
      setItem(data)
    }
    fetchItem()
  }, [itemId])

  useEffect(() => {
    subscribeToItem(itemId)
    return () => unsubscribeFromItem(itemId)
  }, [itemId, subscribeToItem, unsubscribeFromItem])

  useEffect(() => {
    const goOnline = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const handleBid = async (e) => {
    e.preventDefault()
    setBidError(null)

    const amount = Number(bidAmount)
    if (!amount || amount <= currentPrice) {
      setBidState('error')
      setBidError(`Your bid must be higher than the current price (ZMW ${currentPrice}).`)
      return
    }

    setBidState('submitting')

    const { error } = await supabase.rpc('place_bid', {
      p_item_id: itemId,
      p_bidder_id: (await supabase.auth.getUser()).data.user?.id,
      p_amount: amount
    })

    if (error) {
      setBidState('error')
      setBidError(error.message)
      return
    }

    setBidState('success')
    setBidAmount('')
  }

  if (loadError) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#D63384', fontWeight: 600 }}>Couldn't load this item — {loadError}</p>
      </div>
    )
  }

  if (!item) {
    return <LoadingSkeleton count={1} />
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
      <img
        src={item.images?.[0]}
        alt={item.title}
        style={{ width: '100%', borderRadius: '16px', aspectRatio: '3 / 4', objectFit: 'cover' }}
      />

      <h1 style={{ fontSize: '1.3rem', margin: '16px 0 4px' }}>{item.title}</h1>
      <p style={{ color: '#666', margin: '0 0 16px' }}>{item.description}</p>

      <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D63384', margin: '0 0 4px' }}>
        ZMW {currentPrice}
      </p>
      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 20px' }}>
        {status === 'active' ? 'Auction is live' : 'Auction has ended'}
      </p>

      {status === 'active' && (
        <form onSubmit={handleBid} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="bid-amount" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            Your bid (ZMW)
          </label>
          <input
            id="bid-amount"
            type="number"
            min={currentPrice + 1}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            disabled={bidState === 'submitting' || isOffline}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #9EC5E8',
              fontSize: '1rem'
            }}
          />

          <button
            type="submit"
            disabled={bidState === 'submitting' || isOffline}
            style={{
              background: isOffline ? '#ccc' : '#6F42C1',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: isOffline ? 'not-allowed' : 'pointer'
            }}
          >
            {isOffline
              ? "You're offline"
              : bidState === 'submitting'
              ? 'Placing bid…'
              : 'Place bid'}
          </button>

          {bidState === 'error' && (
            <p role="alert" style={{ color: '#D63384', fontSize: '0.9rem', margin: 0 }}>
              {bidError}
            </p>
          )}
          {bidState === 'success' && (
            <p role="status" style={{ color: '#2E7D32', fontSize: '0.9rem', margin: 0 }}>
              Bid placed — you're currently the highest bidder.
            </p>
          )}
        </form>
      )}
    </div>
  )
}