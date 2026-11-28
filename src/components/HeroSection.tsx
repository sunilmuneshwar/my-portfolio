import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Camera,
  Cloud,
  Download,
  FileUp,
  Mail,
  Network,
  Phone,
  Server,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { DEFAULT_RESUME_URL, HERO_ROLES } from '../data/defaultPortfolio';
import type { ContactDetails } from '../types/portfolio';
import {
  formatPhoneForTel,
  formatPhoneForWhatsApp,
  sanitizeExternalUrl,
  sanitizeResumeUrl,
} from '../types/portfolio';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from './BrandIcons';

interface HeroSectionProps {
  profilePhoto?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  contact: ContactDetails;
  onUploadPhoto: (dataUrl: string) => void;
  onRemovePhoto: () => void;
  onManageResume: () => void;
  onExploreWork: () => void;
  onContactClick: () => void;
}

export function HeroSection({
  profilePhoto,
  resumeUrl,
  resumeFileName,
  contact,
  onUploadPhoto,
  onRemovePhoto,
  onManageResume,
  onExploreWork,
  onContactClick,
}: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(HERO_ROLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayedText(HERO_ROLES[0]);
      return;
    }

    const currentRole = HERO_ROLES[roleIndex];
    let timeoutId: number;

    if (!isDeleting && displayedText === currentRole) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), 1900);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % HERO_ROLES.length);
    } else {
      const nextText = isDeleting
        ? currentRole.slice(0, Math.max(0, displayedText.length - 1))
        : currentRole.slice(0, displayedText.length + 1);
      timeoutId = window.setTimeout(
        () => setDisplayedText(nextText),
        isDeleting ? 34 : 62
      );
    }

    return () => window.clearTimeout(timeoutId);
  }, [displayedText, isDeleting, roleIndex]);

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Image must be 2 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const safeLinkedIn = sanitizeExternalUrl(contact.linkedinUrl) || 'https://www.linkedin.com';
  const safeGitHub = sanitizeExternalUrl(contact.githubUrl) || 'https://github.com';
  const safeResumeUrl = sanitizeResumeUrl(resumeUrl) || DEFAULT_RESUME_URL;
  const isExternalResume = /^https?:\/\//i.test(safeResumeUrl);
  const telHref = formatPhoneForTel(contact.phone);
  const whatsAppHref = formatPhoneForWhatsApp(contact.whatsappNumber, contact.phone);

  return (
    <section
      id="home"
      className="hero-orange-bg relative overflow-hidden pt-10 pb-16 text-white sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      {/* Cobalt Blue Ambient Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#97B2DE]/22 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 -left-24 h-80 w-80 rounded-full bg-[#1A488E]/45 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Introduction & Animated Roles */}
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold tracking-wide text-[#97B2DE]">
              Hello, I&apos;m
            </p>

            <h1 className="mt-2 text-[clamp(2.25rem,4.5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-white">
              Sunil Muneshwar
            </h1>

            <p className="mt-4 max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl">
              Building Reliable{' '}
              <span className="accent-gradient-text">
                IT Infrastructure &amp; Digital Experiences.
              </span>
            </p>

            {/* Animated Typing Role Line */}
            <div
              className="mt-4 flex min-h-[2.25rem] items-center text-base font-medium text-white/80 sm:text-lg"
              aria-live="polite"
            >
              <span className="mr-2 text-white/70">Role:</span>
              <span className="font-semibold text-[#97B2DE]">{displayedText}</span>
              <span
                aria-hidden="true"
                className="typing-caret ml-0.5 inline-block h-5 w-0.5 bg-[#97B2DE]"
              />
            </div>

            <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[#dbe7f8] sm:text-base">
              Experienced IT professional with 16 years of experience in IT infrastructure
              management, virtualization, Windows Server administration, cloud technologies,
              networking, and digital solutions. Passionate about building reliable IT
              environments and creating modern digital experiences.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreWork}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#97B2DE] px-6 py-3 text-sm font-semibold text-[#092147] whitespace-nowrap shrink-0 shadow-[0_12px_26px_-10px_rgba(9,33,71,0.55)] transition-all duration-150 hover:bg-[#b2c7ea] hover:-translate-y-0.5 cursor-pointer"
              >
                Explore My Work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="inline-flex items-stretch">
                <a
                  href={safeResumeUrl}
                  download={isExternalResume ? undefined : resumeFileName || 'Sunil-Govind-Muneshwar-Resume.pdf'}
                  target={isExternalResume ? '_blank' : undefined}
                  rel={isExternalResume ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-l-lg border border-[#97B2DE]/40 bg-[#1A488E] px-5 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:border-[#97B2DE] hover:bg-[#092147]"
                >
                  <Download className="h-4 w-4 text-[#97B2DE]" aria-hidden="true" />
                  Download Resume
                </a>
                <button
                  type="button"
                  onClick={onManageResume}
                  aria-label="Upload or link a different resume PDF"
                  title="Upload or link a custom resume PDF"
                  className="inline-flex min-h-[46px] w-11 items-center justify-center rounded-r-lg border border-l-0 border-[#97B2DE]/40 bg-[#092147] text-[#97B2DE] transition-colors hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147] cursor-pointer"
                >
                  <FileUp className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-[#97B2DE]/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:border-[#97B2DE] hover:bg-white/18 cursor-pointer"
              >
                Contact Me
              </button>
            </div>

            {/* Direct Call, WhatsApp Call & Social Links */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {telHref && (
                <a
                  href={telHref}
                  aria-label={`Call ${contact.phone}`}
                  className="group inline-flex h-11 items-center gap-2 rounded-lg border border-[#97B2DE]/45 bg-[#1A488E] px-3.5 text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147]"
                >
                  <Phone className="h-4 w-4 text-[#97B2DE] transition-colors group-hover:text-[#092147]" aria-hidden="true" />
                  <span>Call Now</span>
                </a>
              )}
              {whatsAppHref && (
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Call and Chat"
                  className="group inline-flex h-11 items-center gap-2 rounded-lg border border-[#97B2DE]/45 bg-[#1A488E] px-3.5 text-xs font-semibold text-white whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#97B2DE] transition-colors group-hover:text-[#092147]" />
                  <span>WhatsApp Call</span>
                </a>
              )}
              <a
                href={safeLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#97B2DE]/30 bg-[#1A488E] text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147]"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href={safeGitHub}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#97B2DE]/30 bg-[#1A488E] text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147]"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${contact.email}`}
                aria-label="Send Email"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#97B2DE]/30 bg-[#1A488E] text-white transition-all duration-150 hover:-translate-y-0.5 hover:border-[#97B2DE] hover:bg-[#97B2DE] hover:text-[#092147]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Profile Portrait Frame & Floating Info Cards */}
          <div className="relative flex flex-col items-center lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[390px] pt-4 pb-6 sm:px-4">
              {/* Subtle Decorative Rings */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-2 h-28 w-28 rounded-full border border-[#97B2DE]/45"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-0 h-20 w-20 rounded-full bg-[#97B2DE]/20"
              />

              {/* Floating Tech Icons (Desktop/Tablet) */}
              <div
                aria-hidden="true"
                className="animate-float-subtle pointer-events-none absolute top-4 left-1 z-20 hidden h-11 w-11 items-center justify-center rounded-xl border border-[#97B2DE]/40 bg-[#092147]/90 text-[#97B2DE] shadow-lg sm:flex"
              >
                <Server className="h-5 w-5" />
              </div>
              <div
                aria-hidden="true"
                className="animate-float-subtle-delayed pointer-events-none absolute top-16 right-0 z-20 hidden h-11 w-11 items-center justify-center rounded-xl border border-[#97B2DE]/40 bg-[#1A488E] text-white shadow-lg sm:flex"
              >
                <Cloud className="h-5 w-5" />
              </div>
              <div
                aria-hidden="true"
                className="animate-float-subtle pointer-events-none absolute bottom-20 left-0 z-20 hidden h-10 w-10 items-center justify-center rounded-xl border border-[#97B2DE]/40 bg-[#092147]/90 text-[#97B2DE] shadow-lg sm:flex"
              >
                <Network className="h-4 w-4" />
              </div>

              {/* Main Portrait Container */}
              <div className="animate-float-slow group relative z-10 mx-auto aspect-[4/4.4] w-full max-w-[320px] overflow-hidden rounded-3xl border-2 border-[#97B2DE] bg-gradient-to-br from-[#1A488E] via-[#092147] to-[#1A488E] p-2 shadow-[0_24px_48px_-16px_rgba(9,33,71,0.65)] ring-4 ring-[#97B2DE]/25">
                <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#1A488E]">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Sunil Muneshwar"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-[62%_32%]"
                    />
                  ) : (
                    /* Honest Professional Studio Portrait Placeholder */
                    <div className="flex h-full w-full flex-col items-center justify-between px-6 py-7 text-center">
                      <span className="text-xs font-medium text-[#97B2DE]">
                        Portrait Placeholder
                      </span>

                      <div className="relative flex flex-col items-center">
                        <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#97B2DE]/45 bg-[#092147] shadow-lg">
                          <svg
                            viewBox="0 0 120 120"
                            className="h-28 w-28 text-[#97B2DE]"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="60"
                              cy="42"
                              r="21"
                              fill="#97B2DE"
                              fillOpacity="0.16"
                              stroke="#97B2DE"
                              strokeWidth="2.5"
                            />
                            <path
                              d="M24 102C24 81.5 39.5 68 60 68C80.5 68 96 81.5 96 102"
                              fill="#97B2DE"
                              fillOpacity="0.14"
                              stroke="#97B2DE"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <text
                              x="60"
                              y="49"
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="16"
                              fontWeight="700"
                              fontFamily="Poppins, sans-serif"
                            >
                              SM
                            </text>
                          </svg>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-white">
                          Sunil Muneshwar
                        </p>
                        <p className="mt-1 text-xs text-[#dbe7f8]">
                          Upload your real portrait photo
                        </p>
                      </div>

                      <div className="h-6" aria-hidden="true" />
                    </div>
                  )}

                  {/* Interactive Photo Upload Control */}
                  <div
                    className={`absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 transition-opacity duration-200 ${
                      profilePhoto
                        ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
                        : 'opacity-100'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#092147]/95 px-3.5 py-2 text-xs font-semibold text-white shadow-sm border border-[#97B2DE]/40 transition-colors hover:bg-[#97B2DE] hover:text-[#092147] hover:border-[#97B2DE] cursor-pointer"
                    >
                      <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                      {profilePhoto ? 'Replace Photo' : 'Upload Photo'}
                    </button>
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={onRemovePhoto}
                        aria-label="Remove portrait photo"
                        className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#092147]/95 text-white border border-[#97B2DE]/40 shadow-sm transition-colors hover:bg-[#1A488E] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
                aria-label="Upload your portrait photo"
              />
              {photoError && (
                <p role="alert" className="mt-2 text-center text-xs font-medium text-[#97B2DE]">
                  {photoError}
                </p>
              )}
            </div>

            {/* Three Floating Information Cards — Responsive Clean Grid */}
            <div className="mt-2 grid w-full max-w-[420px] grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="glass-navy-card rounded-xl px-3.5 py-3 text-center sm:text-left">
                <p className="text-sm font-bold text-[#97B2DE] tabular-nums">16+ Years</p>
                <p className="mt-0.5 text-xs font-medium text-[#dbe7f8]">Experience</p>
              </div>
              <div className="glass-navy-card rounded-xl px-3.5 py-3 text-center sm:text-left">
                <p className="text-sm font-bold text-[#97B2DE]">IT Infrastructure</p>
                <p className="mt-0.5 text-xs font-medium text-[#dbe7f8]">Professional</p>
              </div>
              <div className="glass-navy-card rounded-xl px-3.5 py-3 text-center sm:text-left">
                <p className="text-sm font-bold text-[#97B2DE]">Cloud &amp; VMware</p>
                <p className="mt-0.5 text-xs font-medium text-[#dbe7f8]">Virtualization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Scroll Indicator */}
        <div className="mt-12 flex justify-center lg:mt-14">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#dbe7f8] transition-colors hover:text-[#97B2DE]"
          >
            <ShieldCheck className="h-4 w-4 text-[#97B2DE]" aria-hidden="true" />
            <span>Scroll to explore</span>
            <ArrowDown className="h-3.5 w-3.5 text-[#97B2DE]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
