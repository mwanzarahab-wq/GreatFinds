import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'

export default function StyleFeed() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)

  const fetchPosts = async () => {
    setError(null)
    setPosts(null)

    const { data, error: fetchError } = await supabase
      .from('style_feed_posts')
      .select('id, images, caption, linked_item_id, likes_count')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }
    setPosts(data)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#D63384', fontWeight: 600, marginBottom: '12px' }}>
          Couldn't load the feed — {error}
        </p>
        <button onClick={fetchPosts} style={retryButtonStyle}>
          Retry
        </button>
      </div>
    )
  }

  if (posts === null) {
    return <LoadingSkeleton />
  }

  if (posts.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6F42C1' }}>
          No style posts yet.
        </p>
        <p>Be the first to share a look.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        padding: '20px'
      }}
    >
      {posts.map((post) => (
        <div
          key={post.id}
          style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1px solid #E8DCF0' }}
        >
          <img
            src={post.images?.[0]}
            alt={post.caption || 'Style feed post'}
            loading="lazy"
            style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '10px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '0.9rem' }}>{post.caption}</p>
            {post.linked_item_id && (
              <Link
                to={`/market/${post.linked_item_id}`}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#D63384',
                  textDecoration: 'none'
                }}
              >
                Shop this look →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}