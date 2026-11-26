import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Server, SlidersHorizontal } from 'lucide-react';
import { ABOUT_HIGHLIGHTS, ABOUT_STUDIO_IMAGE } from '../data/defaultPortfolio';
import { Reveal } from './Reveal';

interface AboutSectionProps {
  onOpenCustomizer: () => void;
}

export function AboutSection({ onOpenCustomizer }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="about" className="warm-section-bg py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#f47721]">About Me</p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
              Discover My Professional Journey
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Visual Column */}
          <Reveal className="lg:col-span-5">
            <div className="h-full overflow-hidden rounded-2xl border border-[#f3dfd0] bg-white p-2.5 shadow-[0_14px_34px_-16px_rgba(244,119,33,0.18)]">
              {!imgFailed ? (
                <img
                  src={ABOUT_STUDIO_IMAGE}
                  alt="Modern enterprise IT infrastructure and data center operations environment"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full min-h-[260px] w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[260px] w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#101c30] to-[#172942] p-8 text-center">
                  <Server className="h-10 w-10 text-[#f47721]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Enterprise IT Infrastructure
                  </p>
                  <p className="mt-1 text-xs text-[#cbd5e1]">
                    16 Years of Systems, Virtualization &amp; Cloud Operations
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Right Summary Column */}
          <Reveal delayMs={80} className="flex flex-col justify-center lg:col-span-7">
            <div className="rounded-2xl border border-[#f3dfd0] bg-white p-6 shadow-[0_14px_34px_-16px_rgba(244,119,33,0.16)] sm:p-8">
              <p className="text-base leading-relaxed text-[#172942]">
                I am an IT Infrastructure Professional with 16 years of experience in system
                administration, virtualization, cloud infrastructure, networking, and technical
                support. My expertise includes Windows Server administration, VMware environments,
                Azure Cloud, and enterprise IT operations. I am also developing my expertise in
                digital marketing and modern web technologies.
              </p>

              {/* Expanded Journey Narrative */}
              {expanded && (
                <div className="mt-4 space-y-3 border-t border-[#f3dfd0] pt-4 text-sm leading-relaxed text-[#5a6577]">
                  <p>
                    Across 16 years in enterprise technology, my focus has remained consistent:
                    keeping mission-critical infrastructure resilient, secure, and straightforward
                    for business teams to rely on every day. From Active Directory governance and
                    VMware vSphere cluster operations to Azure Cloud administration and SAP Basis
                    monitoring, I value disciplined change management and proactive troubleshooting.
                  </p>
                  <p>
                    Alongside infrastructure engineering, I apply modern web development, technical
                    SEO, and performance marketing practices to help organizations and independent
                    businesses establish a fast, trustworthy online presence.
                  </p>
                </div>
              )}

              {/* Professional Highlights */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ABOUT_HIGHLIGHTS.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2.5 rounded-lg bg-[#fff6ef] px-3.5 py-2.5 border border-[#f3dfd0]/70"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#f47721]"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-[#101c30]">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#101c30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#172942] cursor-pointer"
                  aria-expanded={expanded}
                >
                  {expanded ? 'Show Less' : 'Read More'}
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#f3dfd0] bg-[#fff6ef] px-4 py-2.5 text-sm font-medium text-[#101c30] transition-colors hover:border-[#f47721] hover:bg-[#ffefe2] cursor-pointer"
                >
                  <SlidersHorizontal className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
                  Portfolio Editor &amp; Export
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
