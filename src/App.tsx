import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Commands = lazy(() => import('./pages/Commands'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Leaderboards = lazy(() => import('./pages/Leaderboards'))
const WipeSchedule = lazy(() => import('./pages/WipeSchedule'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/commands" element={<Commands />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/leaderboards" element={<Leaderboards />} />
              <Route path="/wipe-schedule" element={<WipeSchedule />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App
