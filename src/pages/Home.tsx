import { useEffect, useState } from 'react'
import type { IndexData, ResearchRunMeta } from '../types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Home() {
  const [runs, setRuns] = useState<ResearchRunMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/index.json')
      .then((r) => r.json())
      .then((d: IndexData) => {
        setRuns(d.runs ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <nav data-topnav>
        <a href="#/" className="brand">
          ▲ Analyst
        </a>
        <span className="text-light" style={{ fontSize: 'var(--text-8)' }}>
          Indian Market · Momentum Breakouts
        </span>
      </nav>

      <main className="container" style={{ maxWidth: '820px', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>

        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ marginBottom: 'var(--space-1)' }}>Research Runs</h2>
          <p className="text-light" style={{ fontSize: 'var(--text-7)' }}>
            Fundamental + technical momentum breakout picks · 2-5% upside · 2-week horizon
          </p>
        </div>

        {loading && (
          <p className="text-light" style={{ fontSize: 'var(--text-7)' }}>Loading…</p>
        )}

        {!loading && runs.length === 0 && (
          <div className="empty-state">
            <p style={{ fontSize: 'var(--text-4)', marginBottom: 'var(--space-3)' }}>No research yet</p>
            <p style={{ fontSize: 'var(--text-7)' }}>
              Run <code>/stock_research</code> to generate your first analysis
            </p>
          </div>
        )}

        <div className="vstack gap-4">
          {runs.map((run) => (
            <div key={run.id} className="card">
              <div className="run-card">
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Date + tags row */}
                  <div className="hstack" style={{ marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-5)', letterSpacing: '-0.01em' }}>
                      {formatDate(run.date)}
                    </span>
                    {run.tags.map((t) => (
                      <span key={t} className="badge secondary">{t}</span>
                    ))}
                  </div>

                  {/* Summary */}
                  <p className="text-light" style={{ fontSize: 'var(--text-7)', marginBottom: 'var(--space-3)' }}>
                    {run.summary}
                  </p>

                  {/* Tickers */}
                  <div className="hstack">
                    {run.stocks.map((s) => (
                      <span key={s} className="badge outline" style={{ fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                  <a href={`#/research/${run.id}`} className="button outline small">
                    View Research →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
