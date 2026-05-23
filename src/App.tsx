import { useCallback, useEffect, useState } from 'react'
import { getLocation } from './data/locations'
import { AnalyzingPage } from './pages/AnalyzingPage'
import { HomePage } from './pages/HomePage'
import { LocationDetail } from './pages/LocationDetail'
import { UploadPage } from './pages/UploadPage'

type Page =
  | { kind: 'upload' }
  | { kind: 'analyzing'; userPhoto?: string }
  | { kind: 'home' }
  | { kind: 'detail'; locationId: string }

function App() {
  const [page, setPage] = useState<Page>({ kind: 'upload' })

  const syncActiveFromHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '')
    const location = getLocation(hash)
    if (location) {
      setPage({ kind: 'detail', locationId: location.id })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', syncActiveFromHash)
    window.addEventListener('popstate', syncActiveFromHash)
    return () => {
      window.removeEventListener('hashchange', syncActiveFromHash)
      window.removeEventListener('popstate', syncActiveFromHash)
    }
  }, [syncActiveFromHash])

  useEffect(() => {
    window.history.replaceState(null, '', page.kind === 'detail' ? `#${page.locationId}` : window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [page])

  if (page.kind === 'upload') {
    return (
      <UploadPage
        onPhotoSelected={(userPhoto) => setPage({ kind: 'analyzing', userPhoto })}
        onUseExample={() => setPage({ kind: 'analyzing' })}
      />
    )
  }

  if (page.kind === 'analyzing') {
    return <AnalyzingPage userPhoto={page.userPhoto} onComplete={() => setPage({ kind: 'home' })} />
  }

  const activeLocation = page.kind === 'detail' ? getLocation(page.locationId) : undefined

  if (activeLocation) {
    return <LocationDetail location={activeLocation} onBack={() => setPage({ kind: 'upload' })} />
  }

  return <HomePage onSelect={(id) => setPage({ kind: 'detail', locationId: id })} />
}

export default App
