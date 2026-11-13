import { useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { CustomerJourneySection } from '../components/home/CustomerJourneySection';

export function HomePage() {
  const bgVideoRef = useRef(null);

  useEffect(() => {
    const el = bgVideoRef.current;
    if (!el) return;
    el.muted = true;
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay restricted by browser policy; dark navy fallback remains intact
      });
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeroSection />
      </main>

      {/* Shared continuous background video spanning Customer Journey and Footer */}
      <div className="gs-lower-video-stage">
        <video
          ref={bgVideoRef}
          className="gs-lower-video-bg"
          src="/media/brand-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="gs-lower-video-overlay" aria-hidden="true" />
        <div className="gs-lower-video-content">
          <CustomerJourneySection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
