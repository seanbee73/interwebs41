import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteContent } from '../context/SiteContentContext';

gsap.registerPlugin(ScrollTrigger);

export const Manifesto: React.FC = () => {
  const { content } = useSiteContent();
  const manifestoRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const manifestoParagraph = content.manifesto?.title ||
    `From discovery to launch, every pixel, line of code, and interaction is engineered with purpose. We transform your ideas into immersive realities through research, design, and meticulous development — ensuring your brand stands out, performs flawlessly, and leaves a lasting impact.`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current || !manifestoRef.current) return;

      const words = textRef.current.querySelectorAll('.manifesto-word');
      gsap.set(words, { opacity: 0.15 });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: 'top 70%',
          end: 'bottom 45%',
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, [manifestoParagraph]);

  return (
    <section
      id="manifesto"
      ref={manifestoRef}
      className="relative z-10 min-h-[70vh] flex flex-col justify-center items-center py-20 px-5 sm:px-8 space-y-12"
    >
      <div className="max-w-4xl mx-auto text-center glass-card p-8 sm:p-12 md:p-14 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-2xl shadow-2xl">
        <p
          ref={textRef}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-normal leading-relaxed sm:leading-loose tracking-normal text-[var(--text)] select-none"
        >
          {manifestoParagraph.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              <span className="manifesto-word inline-block transition-opacity duration-200">
                {word}
              </span>
              {' '}
            </React.Fragment>
          ))}
        </p>

        {content.manifesto?.paragraph1 && (
          <p className="mt-8 text-base sm:text-lg text-[var(--text-muted)] font-light leading-relaxed max-w-2xl mx-auto">
            {content.manifesto.paragraph1}
          </p>
        )}
      </div>

      {/* Metrics Row */}
      {content.showMetrics !== false && content.metrics && content.metrics.length > 0 && (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {content.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center backdrop-blur-md hover:border-[var(--accent)]/40 transition-all"
            >
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--accent)] font-mono">
                {metric.num}+
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-[var(--text-muted)] mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
