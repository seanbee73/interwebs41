import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useSiteContent } from '../context/SiteContentContext';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#$0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const Hero: React.FC = () => {
  const { content } = useSiteContent();
  const targetText = content.hero?.title || 'InterWebs41';

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const [displayedChars, setDisplayedChars] = useState<string[]>(targetText.split(''));
  const [isScrambling, setIsScrambling] = useState<boolean[]>(new Array(targetText.length).fill(false));
  const isAnimatingRef = useRef<boolean>(false);

  // Sync displayedChars when targetText changes
  useEffect(() => {
    setDisplayedChars(targetText.split(''));
    setIsScrambling(new Array(targetText.length).fill(false));
  }, [targetText]);

  // Full heading scramble logic
  const triggerScramble = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const length = targetText.length;
    const totalFrames = 28;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      const nextChars = targetText.split('').map((targetChar, index) => {
        const lockFrame = Math.floor((index / length) * 18) + 8;
        if (frame >= lockFrame) {
          return targetChar;
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });

      const nextScrambling = targetText.split('').map((_, index) => {
        const lockFrame = Math.floor((index / length) * 18) + 8;
        return frame < lockFrame;
      });

      setDisplayedChars(nextChars);
      setIsScrambling(nextScrambling);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayedChars(targetText.split(''));
        setIsScrambling(new Array(length).fill(false));
        isAnimatingRef.current = false;
      }
    }, 35);
  }, [targetText]);

  // Single character scramble logic on hover
  const scrambleSingleChar = (index: number) => {
    if (isAnimatingRef.current) return;

    let count = 0;
    const maxCount = 7;

    const interval = setInterval(() => {
      count++;

      setDisplayedChars((prev) => {
        const updated = [...prev];
        if (count < maxCount) {
          updated[index] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          updated[index] = targetText[index] || '';
        }
        return updated;
      });

      setIsScrambling((prev) => {
        const updated = [...prev];
        updated[index] = count < maxCount;
        return updated;
      });

      if (count >= maxCount) {
        clearInterval(interval);
      }
    }, 40);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (tagRef.current) {
        gsap.fromTo(
          tagRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.1,
            onComplete: () => {
              triggerScramble();
            },
          }
        );
      }

      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 }
        );
      }

      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.5 }
        );
      }
    });

    return () => ctx.revert();
  }, [triggerScramble]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 pb-12 z-10">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center hero-glass-panel p-6 sm:p-10 md:p-14 rounded-3xl overflow-hidden">
        {/* Pill Tag */}
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-[0.25em] uppercase text-[var(--accent)] px-4 py-1.5 rounded-full bg-[var(--bg)]/60 border border-[var(--accent)]/20 backdrop-blur-md mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>{content.hero?.studioBadge || 'AI Web Development Studio'}</span>
        </div>

        {/* Hero Title with Interactive Data Scramble */}
        <h1
          ref={titleRef}
          onMouseEnter={triggerScramble}
          className="font-display font-extrabold text-[clamp(1.4rem,5.2vw,4.8rem)] leading-none tracking-tight text-[var(--text)] drop-shadow-[0_0_50px_var(--accent-glow)] select-none whitespace-nowrap max-w-full px-2 cursor-pointer group text-stroke-subtle"
          title="Click or hover to scramble"
          onClick={triggerScramble}
        >
          {displayedChars.map((char, index) => {
            const activeScramble = isScrambling[index];
            return (
              <span
                key={index}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  scrambleSingleChar(index);
                }}
                className={`hero-char inline-block transition-all duration-150 text-stroke-subtle ${
                  activeScramble
                    ? 'text-[var(--accent)] font-mono scale-110 drop-shadow-[0_0_15px_var(--accent-glow)]'
                    : 'hover:text-[var(--accent)] hover:scale-105'
                }`}
              >
                {char}
              </span>
            );
          })}
        </h1>

        {/* Hero Subtitle */}
        <p
          ref={subRef}
          className="text-lg sm:text-xl md:text-2xl text-[var(--text)] font-normal max-w-2xl mt-6 leading-relaxed drop-shadow-md text-stroke-subtle"
        >
          {content.hero?.subtitle}
        </p>

        {/* Action Buttons */}
        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <a
            href="#work"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wider uppercase text-[var(--bg)] bg-[var(--accent)] px-8 py-3.5 rounded-full shadow-lg hover:shadow-[0_0_30px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-1"
          >
            <span>{content.hero?.secondaryCtaText || 'Explore Capabilities'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wider uppercase text-[var(--text)] border border-[var(--glass-border)] bg-[var(--glass)] px-8 py-3.5 rounded-full backdrop-blur-md hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 hover:-translate-y-1"
          >
            <span>{content.hero?.primaryCtaText || 'Start Project'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
