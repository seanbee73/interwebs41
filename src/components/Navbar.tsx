import React, { useState, useEffect } from 'react';
import { ArrowRight, Sun, Moon, Menu, X, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content, setIsAdminOpen, submissions } = useSiteContent();

  const unreadCount = submissions.filter((s) => s.status === 'unread').length;

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

      {/* Action Buttons & Theme Toggle & Admin Button */}
      <div className="flex items-center gap-3">
        {/* Admin Dashboard Trigger */}
        <button
          onClick={() => setIsAdminOpen(true)}
          title="Open Admin CMS Dashboard (Ctrl+Shift+A)"
          aria-label="Open Admin Dashboard"
          className="relative p-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] hover:border-[var(--accent)] text-[var(--text)] transition-all duration-300 hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

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

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[var(--bg)]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-8 space-y-6 text-center animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsAdminOpen(true);
            }}
            className="w-full max-w-xs inline-flex items-center justify-center gap-2 text-sm font-mono text-[var(--accent)] border border-[var(--accent)]/30 py-3 rounded-full bg-[var(--accent)]/10"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin CMS Panel</span>
          </button>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full max-w-xs mt-2 inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wider uppercase text-[var(--bg)] bg-[var(--accent)] py-3 rounded-full shadow-lg"
          >
            <span>Start Project</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </nav>
  );
};
