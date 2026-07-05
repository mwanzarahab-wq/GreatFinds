export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '16px',
        padding: '20px'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              background: '#E8DCF0',
              borderRadius: '12px',
              aspectRatio: '3 / 4',
              animation: 'gf-pulse 1.4s ease-in-out infinite'
            }}
          />
          <div style={{ background: '#E8DCF0', height: '12px', width: '70%', borderRadius: '4px' }} />
          <div style={{ background: '#E8DCF0', height: '12px', width: '40%', borderRadius: '4px' }} />
        </div>
      ))}
      <style>{`
        @keyframes gf-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="gf-pulse"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}