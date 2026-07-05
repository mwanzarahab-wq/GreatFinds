import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

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

  if (!isOffline) return null

  return (
    <div
      role="status"
      style={{
        background: '#D63384',
        color: '#fff',
        textAlign: 'center',
        padding: '8px',
        fontSize: '0.9rem',
        fontWeight: 600
      }}
    >
      You're offline — reconnect to place bids or see the latest prices.
    </div>
  )
}