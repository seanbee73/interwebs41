import React, { useState, useRef } from 'react';
import { Compass, LayoutGrid, Code2, Sparkles, Check, ArrowUpRight, X } from 'lucide-react';
import { ServiceItem } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
  getIcon: (iconName: string) => React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, getIcon }) => {
  const [displayText, setDisplayText] = useState(service.title);
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);

  React.useEffect(() => {
    setDisplayText(service.title);
  }, [service.title]);

  const handleMouseEnter = () => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const original = service.title;
    let iter = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        original
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iter) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iter += 0.5;

      if (iter >= original.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(original);
      }
    }, 25);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(service.title);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => onSelect(service)}
      className="glass-card group relative p-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[300px]"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 rounded-xl bg-[var(--bg)]/80 border border-[var(--glass-border)] group-hover:border-[var(--accent)]/50 transition-colors">
          {getIcon(service.icon)}
        </div>
        <span className="font-mono text-sm font-semibold tracking-widest text-[var(--accent)] opacity-60 group-hover:opacity-100 transition-opacity">
          {service.num}
        </span>
      </div>

      <div>
        <h3 className="font-display text-2xl font-bold text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors">
          {displayText}
        </h3>
        <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed mb-6">
          {service.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)] text-xs font-mono text-[var(--text-dim)] group-hover:text-[var(--text)] transition-colors">
        <span>Timeline: {service.timeline}</span>
        <div className="flex items-center gap-1 text-[var(--accent)]">
          <span>Explore</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC = () => {
  const { content } = useSiteContent();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const servicesList = content.services || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-8 h-8 text-[var(--accent)]" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-8 h-8 text-[var(--accent)]" />;
      case 'Code2':
        return <Code2 className="w-8 h-8 text-[var(--accent)]" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[var(--accent)]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[var(--accent)]" />;
    }
  };

  return (
    <section id="capabilities" className="section relative z-10 container-custom">
      {/* Section Header */}
      <div className="section-tag">What We Do</div>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-4">
        Core Services
      </h2>
      <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl font-light mb-12">
        Next‑Generation AI Websites Crafted to Grow Your Business and Captivate Your Audience.
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesList.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={setSelectedService}
            getIcon={getIcon}
          />
        ))}
      </div>

      {/* Modal for Service Details */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card w-full max-w-2xl p-8 relative bg-[var(--bg-alt)] border border-[var(--accent)]/30 rounded-2xl shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[var(--glass)] hover:bg-[var(--accent)] hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
                Service {selectedService.num}
              </span>
              <span className="text-xs font-mono text-[var(--text-dim)]">• Est. Timeline: {selectedService.timeline}</span>
            </div>

            <h3 className="font-display text-3xl font-bold text-[var(--text)] mb-3">{selectedService.title}</h3>
            <p className="text-base text-[var(--text-muted)] mb-6 font-light">{selectedService.description}</p>

            <h4 className="text-sm font-semibold tracking-wider uppercase text-[var(--text)] mb-4">
              Key Deliverables &amp; Outputs
            </h4>
            <ul className="space-y-3 mb-8">
              {selectedService.keyDeliverables.map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text)] font-light">
                  <Check className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-6 border-t border-[var(--glass-border)]">
              <a
                href="#contact"
                onClick={() => setSelectedService(null)}
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[var(--bg)] bg-[var(--accent)] px-6 py-3 rounded-full hover:shadow-[0_0_20px_var(--accent-glow)] transition-all"
              >
                <span>Inquire About {selectedService.title}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setSelectedService(null)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
