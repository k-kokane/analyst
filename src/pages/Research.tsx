import { useEffect, useState } from 'react'
import type { ResearchRun, StockAnalysis } from '../types'
import ThemeToggle from '../ThemeToggle'

interface Props {
  id: string
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function fmt(n: number) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function StockAccordion({ stock }: { stock: StockAnalysis }) {
  return (
    <details>
      <summary>
        <div className="stock-summary-inner">
          <span className="stock-ticker">{stock.ticker}</span>
          <span className="stock-meta">{stock.name}</span>
          <span className="badge outline" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            ₹{fmt(stock.cmp)}
          </span>
          <span className="badge outline" style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', borderColor: 'var(--success)' }}>
            ₹{fmt(stock.target)}
          </span>
          <span className="badge success">▲ {stock.upside.toFixed(1)}%</span>
          <span className="badge secondary">{stock.sector}</span>
        </div>
      </summary>

      <div>
        {/* Thesis */}
        <p className="text-light" style={{ fontSize: 'var(--text-7)', marginBottom: 'var(--space-6)', fontStyle: 'italic' }}>
          {stock.thesis}
        </p>

        <div className="row">
          {/* Technical */}
          <div className="col-6">
            <p className="section-label">Technical</p>

            <div className="hstack" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="badge secondary">{stock.technical.pattern}</span>
              <span className="badge outline">RSI {stock.technical.rsi}</span>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div className="stat-row">
                <span className="text-light">Volume</span>
                <strong>{stock.technical.volume_signal}</strong>
              </div>
              <div className="stat-row">
                <span className="text-light">Support</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{fmt(stock.technical.support)}</span>
              </div>
              <div className="stat-row">
                <span className="text-light">Resistance</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>₹{fmt(stock.technical.resistance)}</span>
              </div>
              <div className="stat-row">
                <span className="text-light">Target</span>
                <span className="price-up" style={{ fontFamily: 'var(--font-mono)' }}>₹{fmt(stock.target)}</span>
              </div>
            </div>

            <ul style={{ fontSize: 'var(--text-7)', paddingLeft: 'var(--space-5)' }}>
              {stock.technical.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Fundamental */}
          <div className="col-6">
            <p className="section-label">Fundamental</p>

            <div role="alert" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-7)' }}>
              <strong>Catalyst — </strong>{stock.fundamental.catalyst}
            </div>

            <ul style={{ fontSize: 'var(--text-7)', paddingLeft: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
              {stock.fundamental.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>

            {stock.risk && (
              <div role="alert" data-variant="warning" style={{ fontSize: 'var(--text-7)' }}>
                <strong>Risk — </strong>{stock.risk}
              </div>
            )}
          </div>
        </div>
      </div>
    </details>
  )
}

export default function Research({ id }: Props) {
  const [data, setData] = useState<ResearchRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/data/research/${id}/data.json`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d: ResearchRun) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  return (
    <>
      <nav data-topnav>
        <a href="#/" className="button ghost small" style={{ padding: '4px 8px' }}>
          ← Back
        </a>
        <a href="#/" className="brand">
          ▲ Analyst
        </a>
        <ThemeToggle />
      </nav>

      <main className="container" style={{ maxWidth: '820px', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>

        {loading && (
          <p className="text-light" style={{ fontSize: 'var(--text-7)' }}>Loading…</p>
        )}

        {error && (
          <div role="alert" data-variant="danger">
            Research run not found. <a href="#/">Go back home</a>
          </div>
        )}

        {data && (
          <>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div className="hstack" style={{ marginBottom: 'var(--space-2)' }}>
                <h2 style={{ margin: 0 }}>{formatDate(data.date)}</h2>
                {data.tags.map((t) => (
                  <span key={t} className="badge secondary">{t}</span>
                ))}
              </div>
              <p className="text-light" style={{ fontSize: 'var(--text-7)', marginBottom: 'var(--space-3)' }}>
                {data.summary}
              </p>
              {data.market_context && (
                <div role="alert" style={{ fontSize: 'var(--text-7)' }}>
                  {data.market_context}
                </div>
              )}
            </div>

            {/* Stocks accordion */}
            <div>
              {data.stocks.map((stock) => (
                <StockAccordion key={stock.ticker} stock={stock} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
