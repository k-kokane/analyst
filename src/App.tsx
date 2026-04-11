import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Research from './pages/Research'
import './App.css'

type Route = { page: 'home' } | { page: 'research'; id: string }

function parseRoute(): Route {
  const hash = window.location.hash
  const match = hash.match(/^#\/research\/(.+)$/)
  if (match) return { page: 'research', id: match[1] }
  return { page: 'home' }
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute)

  useEffect(() => {
    const handler = () => setRoute(parseRoute())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (route.page === 'research') return <Research id={route.id} />
  return <Home />
}
