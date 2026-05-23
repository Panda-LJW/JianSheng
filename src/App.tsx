import { useCallback, useEffect, useState } from 'react'
import { getLocation } from './data/locations'
import { AnalyzingPage } from './pages/AnalyzingPage'
import { HomePage } from './pages/HomePage'
import { LocationDetail } from './pages/LocationDetail'
import { UploadPage } from './pages/UploadPage'

type Page =
  | { kind: 'home'; focusArchive?: boolean }
  | { kind: 'upload' }
  | { kind: 'analyzing'; userPhoto?: string; resultId: string }
  | { kind: 'detail'; locationId: string }

function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '')
    const location = getLocation(hash)
    return location ? { kind: 'detail', locationId: location.id } : { kind: 'home' }
  })

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
    if (page.kind !== 'home' || !page.focusArchive) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [page])

  if (page.kind === 'upload') {
    return (
      <UploadPage
        onBack={() => setPage({ kind: 'home' })}
        onBrowseLocations={() => setPage({ kind: 'home', focusArchive: true })}
        onPhotoSelected={(userPhoto) => setPage({ kind: 'analyzing', userPhoto, resultId: 'jiefang' })}
        onUseExample={() => setPage({ kind: 'analyzing', resultId: 'jiefang' })}
      />
    )
  }

  if (page.kind === 'analyzing') {
    const resultLocation = getLocation(page.resultId)
    return (
      <AnalyzingPage
        resultLocation={resultLocation}
        userPhoto={page.userPhoto}
        onBack={() => setPage({ kind: 'upload' })}
        onComplete={() => setPage({ kind: 'detail', locationId: page.resultId })}
      />
    )
  }

  const activeLocation = page.kind === 'detail' ? getLocation(page.locationId) : undefined

  if (activeLocation) {
    return <LocationDetail location={activeLocation} onBack={() => setPage({ kind: 'home', focusArchive: true })} />
  }

  return (
    <HomePage
      focusArchive={page.kind === 'home' ? page.focusArchive : false}
      onSelect={(id) => setPage({ kind: 'detail', locationId: id })}
      onUpload={() => setPage({ kind: 'upload' })}
    />
  )
}

export default App
