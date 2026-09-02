import React, { useState, useRef } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface ProcessStepCardProps {
  step: {
    num: string;
    title: string;
    desc: string;
  };
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ step }) => {
  const [displayText, setDisplayText] = useState(step.title);
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null);

  React.useEffect(() => {
    setDisplayText(step.title);
  }, [step.title]);

  const handleMouseEnter = () => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const original = step.title;
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
    setDisplayText(step.title);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="glass-card p-6 sm:p-8 border-l-2 border-l-[var(--glass-border)] hover:border-l-[var(--accent)] transition-all duration-300 group rounded-2xl"
    >
      <span className="font-display text-3xl font-extrabold text-[var(--accent)] opacity-30 group-hover:opacity-100 transition-opacity block mb-4 font-mono">
        {step.num}
      </span>
      <h3 className="font-display text-xl font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors font-mono min-h-[28px]">
        {displayText}
      </h3>
      <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">
        {step.desc}
      </p>
    </div>
  );
};

export const Process: React.FC = () => {
  const { content } = useSiteContent();
  const processSteps = content.process || [];

  return (
    <section id="process" className="section relative z-10 container-custom">
      <div className="section-tag">How We Work</div>
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-12">
        Creative Process
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step) => (
          <ProcessStepCard key={step.num} step={step} />
        ))}
      </div>
    </section>
  );
};
