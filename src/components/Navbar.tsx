import React, { useState, useEffect } from 'react';
import { ArrowRight, Sun, Moon, Menu, X } from 'lucide-react';
import { ThemeMode } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#manifesto' },
    { name: 'Services', href: '#capabilities' },
    { name: 'Work', href: '#work' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-5 sm:px-8 py-4 flex items-center justify-between ${
        scrolled
          ? 'bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--glass-border)] py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Brand Logo */}
      <a
        href="#"
        className="font-display text-xl font-bold tracking-widest flex items-center transition-opacity hover:opacity-80"
        aria-label={`${content.hero?.title || 'InterWebs41'} Homepage`}
      >
        <span>{content.hero?.title || 'InterWebs41'}</span>
        <span className="text-[var(--accent)] font-extrabold text-2xl leading-none">.</span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm font-light text-[var(--text-muted)] hover:text-[var(--text)] transition-colors relative group py-1"
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      {/* Action Buttons & Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--accent)] text-[var(--text)] transition-all duration-300 hover:scale-105"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[var(--accent)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--accent)]" />
          )}
        </button>

        {/* CTA Button */}
        <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[var(--bg)] bg-[var(--accent)] px-4 py-2.5 rounded-full hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-300 hover:-translate-y-0.5"
        >
          <span>Start Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        {/* Hamburger Menu Toggle Button (Visible on ALL screens) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 p-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--accent)] text-[var(--text)] transition-all duration-300 hover:scale-105"
          aria-label="Toggle navigation menu"
          title="Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[var(--accent)]" />
          ) : (
            <Menu className="w-5 h-5 text-[var(--accent)]" />
          )}
          <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline text-[var(--text-muted)] pl-0.5 pr-1">
            Menu
          </span>
        </button>
      </div>

      {/* Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[70px] bg-black/70 backdrop-blur-md z-40 flex justify-end animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[var(--bg)] border-l border-[var(--glass-border)] p-8 h-[calc(100vh-70px)] overflow-y-auto flex flex-col justify-between shadow-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                  Site Navigation
                </span>
                <span className="text-xs font-mono text-[var(--accent)]">
                  7 Sections
                </span>
              </div>

              <div className="grid gap-2">
                {[
                  { num: '01', name: 'Home / Hero', href: '#' },
                  { num: '02', name: 'Our Philosophy', href: '#manifesto' },
                  { num: '03', name: 'Services Offered', href: '#capabilities' },
                  { num: '04', name: 'Work & Portfolio', href: '#work' },
                  { num: '05', name: 'Development Process', href: '#process' },
                  { num: '06', name: 'Pricing Packages', href: '#pricing' },
                  { num: '07', name: 'Contact & Inquiry', href: '#contact' },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--glass)] border border-transparent hover:border-[var(--glass-border)] group transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[var(--accent)] opacity-80 font-bold">
                        {item.num}
                      </span>
                      <span className="font-display font-medium text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--glass-border)] space-y-4">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--accent)] text-[#060606] font-mono text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_var(--accent-glow)] transition-all"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-2">
                <span>{content.contactInfo?.email || 'interwebs41@gmail.com'}</span>
                <span>{content.contactInfo?.phone || '647-894-6964'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
