import React, { useEffect, useState, useRef } from 'react';
import { METRICS } from '../data/portfolioData';

export const Metrics: React.FC = () => {
  const [counts, setCounts] = useState<number[]>(METRICS.map(() => 0));
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let started = false;

    const handleScroll = () => {
      if (started || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        started = true;

        METRICS.forEach((metric, index) => {
          let current = 0;
          const target = metric.num;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            setCounts((prev) => {
              const updated = [...prev];
              updated[index] = current;
              return updated;
            });
          }, 35);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger immediately if already visible

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="metrics" className="section relative z-10 container-custom">
      <div className="glass-card p-8 sm:p-12 border border-[var(--glass-border)] rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {METRICS.map((metric, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--accent)] tracking-tight drop-shadow-[0_0_20px_var(--accent-glow)]">
                {counts[i]}
                <span className="text-[var(--accent)] font-normal">+</span>
              </span>
              <span className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[var(--text-muted)] mt-2">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
