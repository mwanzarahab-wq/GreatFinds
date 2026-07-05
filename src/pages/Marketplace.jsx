import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'

export default function Marketplace() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)

  const fetchItems = async () => {
    setError(null)
    setItems(null)

    const { data, error: fetchError } = await supabase
      .from('items')
      .select('id, title, images, current_price, status, ends_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }
    setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#D63384', fontWeight: 600, marginBottom: '12px' }}>
          Couldn't load listings — {error}
        </p>
        <button onClick={fetchItems} style={retryButtonStyle}>
          Retry
        </button>
      </div>
    )
  }

  if (items === null) {
    return <LoadingSkeleton />
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6F42C1' }}>
          No active listings yet.
        </p>
        <p>Check back soon, or be the first to list something.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '16px',
        padding: '20px'
      }}
    >
      {items.map((item) => (
        <Link
          key={item.id}
          to={`/market/${item.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#fff',
              border: '1px solid #E8DCF0'
            }}
          >
            <img
              src={item.images?.[0]}
              alt={item.title}
              loading="lazy"
              style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '10px' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</p>
              <p style={{ margin: '4px 0 0', color: '#D63384', fontWeight: 700 }}>
                ZMW {item.current_price}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

const retryButtonStyle = {
  background: '#D63384',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '999px',
  fontWeight: 600,
  cursor: 'pointer'
}