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
      className={`sticky top-0 z-50 w-full bg-[#101c30]/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled
          ? 'shadow-[0_10px_30px_-14px_rgba(16,28,48,0.55)] border-b border-white/15'
          : 'border-b border-white/10'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[74px] lg:px-8">
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
          <span className="text-[#f47721]">SUNIL</span> MUNESHWAR
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
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive ? 'text-[#f47721]' : 'text-white/90 hover:text-[#f47721]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#f47721] transition-transform duration-200 origin-left ${
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
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#f47721] px-5 py-2.5 text-sm font-semibold text-[#101c30] whitespace-nowrap shrink-0 shadow-[0_8px_20px_-6px_rgba(244,119,33,0.45)] transition-all duration-150 hover:bg-[#ff8a3a] hover:-translate-y-0.5 cursor-pointer"
          >
            Hire Me
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-[#172942] text-white transition-colors hover:border-[#f47721] hover:text-[#f47721] lg:hidden cursor-pointer"
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
        className={`overflow-hidden border-t border-white/10 bg-[#172942] transition-[max-height,opacity] duration-250 ease-out lg:hidden ${
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
                    ? 'bg-[#101c30] text-[#f47721] font-semibold'
                    : 'text-white/90 hover:bg-[#101c30]/70 hover:text-[#f47721]'
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
            className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#f47721] px-5 py-2.5 text-sm font-semibold text-[#101c30] transition-colors hover:bg-[#ff8a3a] cursor-pointer"
          >
            Hire Me
          </button>
        </nav>
      </div>
    </header>
  );
}
