import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Great Finds — caught render error:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: '32px',
            textAlign: 'center',
            color: '#6F42C1'
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>
            Something didn't load right.
          </p>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Nothing was lost — try again.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              background: '#D63384',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '999px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}