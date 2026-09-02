import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { ThemeMode } from './types';
import { SiteContentProvider } from './context/SiteContentContext';
import { Navbar } from './components/Navbar';
import { ParticleCanvas } from './components/ParticleCanvas';
import { CursorTrail } from './components/CursorTrail';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Services } from './components/Services';
import { WorkGrid } from './components/WorkGrid';
import { Process } from './components/Process';
import { Pricing } from './components/Pricing';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';

function MainLayout() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefilledService, setPrefilledService] = useState<string>('');
  const [prefilledBudget, setPrefilledBudget] = useState<string>('');

  // Lenis smooth scroll & scroll progress tracking
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  // Sync html class with theme state
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectPackage = (packageName: string, estimatedPrice: number) => {
    setPrefilledService(`Package: ${packageName}`);
    setPrefilledBudget(`$${estimatedPrice}`);
  };

  return (
    <div className="relative min-h-screen selection:bg-[var(--accent)] selection:text-[#060606]">
      {/* Scroll Progress Bar at top */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Grain texture overlay */}
      <div className="grain" />

      {/* Three.js Morphing Particle Canvas */}
      <ParticleCanvas theme={theme} scrollProgress={scrollProgress} />

      {/* Glowing Cursor Trail Effect */}
      <CursorTrail theme={theme} />

      {/* Fixed Navigation Bar */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <Manifesto />
        <Services />
        <WorkGrid />
        <Process />
        <Pricing onSelectPackage={handleSelectPackage} />
        <ContactSection initialService={prefilledService} initialBudget={prefilledBudget} />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Admin CMS Modal */}
      <AdminDashboardModal />
    </div>
  );
}

export default function App() {
  return (
    <SiteContentProvider>
      <MainLayout />
    </SiteContentProvider>
  );
}
