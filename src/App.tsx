import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './routes/HomePage'
import BuilderPage from './routes/BuilderPage'
import GamePage from './routes/GamePage'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream text-coffee">
        <Navbar />
        <main className="px-4 pb-16 sm:px-6 lg:px-10">
          <AnimatedRoutes />
        </main>
      </div>
    </ErrorBoundary>
  )
}
