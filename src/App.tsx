import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ConnectionStatus from './components/ConnectionStatus'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Commands = lazy(() => import('./pages/Commands'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Leaderboards = lazy(() => import('./pages/Leaderboards'))
const WipeSchedule = lazy(() => import('./pages/WipeSchedule'))
const News = lazy(() => import('./pages/News'))
const Rules = lazy(() => import('./pages/Rules'))
const Profile = lazy(() => import('./pages/Profile'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminNews = lazy(() => import('./pages/AdminNews'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const AdminWipes = lazy(() => import('./pages/AdminWipes'))
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
              <Route path="/news" element={<News />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/wipes" element={<AdminWipes />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ConnectionStatus />
      </div>
    </ErrorBoundary>
  )
}

export default App
