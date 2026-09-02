import React, { useEffect, useRef } from 'react';

interface CursorTrailProps {
  theme?: 'dark' | 'light';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const CursorTrail: React.FC<CursorTrailProps> = ({ theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if device is touch-only or prefers reduced motion
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let headX = mouseX;
    let headY = mouseY;
    let isVisible = false;
    let isHovered = false;
    let ringSize = 22;
    let targetRingSize = 22;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const trailHistory: { x: number; y: number }[] = [];
    const MAX_TRAIL = 18;

    // Get accent colors dynamically based on document root theme
    const getAccentColors = () => {
      const isDark = document.documentElement.classList.contains('dark') || theme === 'dark';
      return {
        primary: isDark ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, ',
        glow: isDark ? 'rgba(96, 165, 250, ' : 'rgba(59, 130, 246, ',
        core: isDark ? '#ffffff' : '#1d4ed8',
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        headX = mouseX;
        headY = mouseY;
      }

      // Check if mouse is over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, textarea, select, [role="button"], .cursor-pointer, .glass-card, [onClick]'
        );
        isHovered = isInteractive;
        targetRingSize = isInteractive ? 38 : 22;
      }

      // Add trail history
      trailHistory.push({ x: mouseX, y: mouseY });
      if (trailHistory.length > MAX_TRAIL) {
        trailHistory.shift();
      }

      // Emit glowing particle along movement path
      const colors = getAccentColors();
      const speed = Math.hypot(mouseX - headX, mouseY - headY);
      const numToEmit = Math.min(3, Math.max(1, Math.floor(speed / 5)));

      for (let i = 0; i < numToEmit; i++) {
        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 0.7 + 0.2;
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 4,
          y: mouseY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * pSpeed,
          vy: Math.sin(angle) * pSpeed,
          size: Math.random() * 2.5 + (isHovered ? 2.5 : 1.2),
          alpha: 0.8,
          life: 0,
          maxLife: Math.random() * 22 + 18,
          color: colors.glow,
        });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleClick = (e: MouseEvent) => {
      const colors = getAccentColors();
      // Burst ripple effect on click
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.2;
        const pSpeed = Math.random() * 2.2 + 1.2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * pSpeed,
          vy: Math.sin(angle) * pSpeed,
          size: Math.random() * 3.5 + 1.5,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 28 + 20,
          color: colors.primary,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick, { passive: true });

    const render = () => {
      animId = requestAnimationFrame(render);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (!isVisible && particles.length === 0) return;

      const colors = getAccentColors();

      // Smooth lerp head cursor position towards actual mouse position
      headX += (mouseX - headX) * 0.35;
      headY += (mouseY - headY) * 0.35;

      // Lerp ring size
      ringSize += (targetRingSize - ringSize) * 0.15;

      // 1. Draw smooth ribbon/trail curve connecting historic mouse points
      if (trailHistory.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailHistory[0].x, trailHistory[0].y);
        for (let i = 1; i < trailHistory.length - 1; i++) {
          const xc = (trailHistory[i].x + trailHistory[i + 1].x) / 2;
          const yc = (trailHistory[i].y + trailHistory[i + 1].y) / 2;
          ctx.quadraticCurveTo(trailHistory[i].x, trailHistory[i].y, xc, yc);
        }
        ctx.lineTo(headX, headY);

        ctx.lineWidth = isHovered ? 2.2 : 1.4;
        ctx.strokeStyle = `${colors.primary}0.35)`;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // 2. Render & update floating spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * 0.7})`;
        ctx.fill();
      }

      // 3. Render glowing core dot if mouse is inside window
      if (isVisible) {
        // Central core dot
        ctx.beginPath();
        ctx.arc(headX, headY, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.core;
        ctx.shadowColor = `${colors.primary}0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};
