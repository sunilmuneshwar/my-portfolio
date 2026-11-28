import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onHireMeClick: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function Header({ activeSection, onHireMeClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#1B365D]/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? 'shadow-[0_10px_28px_-14px_rgba(6,17,36,0.65)] border-b border-[#97B2DE]/25'
          : 'border-b border-[#97B2DE]/15'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 bg-[#1B365D] px-4 text-white sm:px-6 lg:h-[74px] lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 sm:text-xl"
          aria-label="Sunil Muneshwar — Back to top"
        >
          <span className="text-[#97B2DE]">SUNIL</span> MUNESHWAR
        </a>

        {/* Zone 2: Desktop Navigation */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`relative py-2 text-sm whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'font-semibold text-white'
                    : 'font-medium text-white/85 hover:text-[#97B2DE]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#97B2DE] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onHireMeClick();
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#97B2DE] px-5 py-2.5 text-sm font-semibold text-[#092147] whitespace-nowrap shrink-0 shadow-[0_8px_20px_-6px_rgba(6,17,36,0.5)] transition-all duration-150 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
          >
            Hire Me
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#97B2DE]/35 bg-[#152c4d] text-white transition-colors hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147] lg:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        className={`overflow-hidden border-t border-[#97B2DE]/20 bg-[#1B365D] transition-[max-height,opacity] duration-250 ease-out lg:hidden ${
          mobileMenuOpen ? 'max-h-[460px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Mobile Navigation"
          className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4 sm:px-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#122645] text-[#97B2DE] font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onHireMeClick();
            }}
            className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#97B2DE] px-5 py-2.5 text-sm font-semibold text-[#092147] transition-colors hover:bg-white cursor-pointer"
          >
            Hire Me
          </button>
        </nav>
      </div>
    </header>
  );
}
