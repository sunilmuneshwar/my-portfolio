import { useEffect, useState } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import type { ContactDetails } from '../types/portfolio';
import { sanitizeExternalUrl } from '../types/portfolio';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from './BrandIcons';

interface FooterProps {
  contact: ContactDetails;
}

const QUICK_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export function Footer({ contact }: FooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const safeLinkedIn = sanitizeExternalUrl(contact.linkedinUrl) || 'https://www.linkedin.com';
  const safeGitHub = sanitizeExternalUrl(contact.githubUrl) || 'https://github.com';
  const cleanWhatsApp = contact.whatsappNumber.replace(/[^\d]/g, '');

  return (
    <footer className="bg-[#101c30] text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Summary */}
          <div className="md:col-span-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="text-xl font-bold tracking-tight text-white"
            >
              <span className="text-[#f47721]">SUNIL</span> MUNESHWAR
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#cbd5e1]">
              IT Infrastructure Specialist with 16 years of enterprise experience across
              Windows Server, VMware virtualization, Azure Cloud, networking, SAP Basis, and
              modern digital marketing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h2 className="text-sm font-semibold text-[#f47721]">Quick Navigation</h2>
            <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#cbd5e1]">
              {QUICK_LINKS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="transition-colors hover:text-[#f47721]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-[#f47721]">Connect</h2>
            <div className="mt-4 flex items-center gap-2.5">
              <a
                href={safeLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#172942] text-white transition-colors hover:bg-[#f47721] hover:text-[#101c30]"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={safeGitHub}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#172942] text-white transition-colors hover:bg-[#f47721] hover:text-[#101c30]"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={cleanWhatsApp ? `https://wa.me/${cleanWhatsApp}` : '#contact'}
                target={cleanWhatsApp ? '_blank' : undefined}
                rel={cleanWhatsApp ? 'noopener noreferrer' : undefined}
                aria-label="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#172942] text-white transition-colors hover:bg-[#f47721] hover:text-[#101c30]"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#172942] text-white transition-colors hover:bg-[#f47721] hover:text-[#101c30]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-white/15 bg-[#172942] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#f47721] hover:text-[#f47721] cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5 text-[#f47721]" aria-hidden="true" />
              Back to Top
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#94a3b8] sm:flex-row">
          <p className="tabular-nums">
            &copy; {currentYear} Sunil Muneshwar. All rights reserved.
          </p>
          <p>IT Infrastructure Specialist · VMware · Azure Cloud · Digital Marketing</p>
        </div>
      </div>

      {/* Floating Back-to-Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed right-5 bottom-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f47721] text-[#101c30] shadow-[0_12px_24px_-6px_rgba(16,28,48,0.55)] transition-all duration-200 hover:bg-[#ff8a3a] hover:-translate-y-0.5 cursor-pointer ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </footer>
  );
}
