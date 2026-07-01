import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'

import Cursor from './components/Cursor'
import './index.css'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'))
const Apply = lazy(() => import('./pages/Apply'))
const Talent = lazy(() => import('./pages/Talent'))
const TalentOriginal = lazy(() => import('./pages/TalentOriginal'))
const TalentV2 = lazy(() => import('./pages/TalentV2'))

const Brands = lazy(() => import('./pages/Brands'))
const BrandsOriginal = lazy(() => import('./pages/BrandsOriginal'))
const BrandsV2 = lazy(() => import('./pages/BrandsV2'))

const Hospitality = lazy(() => import('./pages/Hospitality'))
const HospitalityOriginal = lazy(() => import('./pages/HospitalityOriginal'))
const HospitalityV2 = lazy(() => import('./pages/HospitalityV2'))

const CaseStudiesPage = lazy(() => import('./pages/CaseStudies'))
const FounderProfile = lazy(() => import('./pages/FounderProfile'))
const Admin = lazy(() => import('./pages/Admin'))

// Loading Fallback
const PageLoader = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div className="loader-spinner"></div>
  </div>
)

// Transition Overlay Component
const PageTransitionOverlay = () => {
  const overlayRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Fade IN (hide overlay) when location changes (new page loaded)
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.1 // Slight delay to ensure DOM is ready
      })
    }

    // Safety Fallback: Force transparency after 2s if GSAP hangs
    const timer = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
        overlayRef.current.style.pointerEvents = 'none';
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [location])

  return (
    <div
      className="page-transition-overlay"
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        opacity: 1, // Start black on refresh/load
        pointerEvents: 'all',
        zIndex: 9999
      }}
    ></div>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Cursor />
        <PageTransitionOverlay />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Standard Routes */}
            <Route path="/talent" element={<Talent />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/hospitality" element={<Hospitality />} />

            {/* Backups */}
            <Route path="/talent-original" element={<TalentOriginal />} />
            <Route path="/brands-original" element={<BrandsOriginal />} />
            <Route path="/hospitality-original" element={<HospitalityOriginal />} />

            {/* V2 Variations */}
            <Route path="/talent-v2" element={<TalentV2 />} />
            <Route path="/brands-v2" element={<BrandsV2 />} />
            <Route path="/hospitality-v2" element={<HospitalityV2 />} />

            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/founder/:slug" element={<FounderProfile />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
