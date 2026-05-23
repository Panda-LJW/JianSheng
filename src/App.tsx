import { useEffect, useState } from 'react'
import { getLocation } from './data/locations'
import { HomePage } from './pages/HomePage'
import { LocationDetail } from './pages/LocationDetail'

function App() {
  const [activeId, setActiveId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#', '')
    return getLocation(hash)?.id ?? null
  })

  useEffect(() => {
    window.history.replaceState(null, '', activeId ? `#${activeId}` : window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [activeId])

  const activeLocation = activeId ? getLocation(activeId) : undefined

  if (activeLocation) {
    return <LocationDetail location={activeLocation} onBack={() => setActiveId(null)} />
  }

  return <HomePage onSelect={(id) => setActiveId(id)} />
}

export default App
