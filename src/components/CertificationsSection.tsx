import { Award, ExternalLink, ImagePlus, Pencil } from 'lucide-react';
import type { CertificationItem } from '../types/portfolio';
import { sanitizeExternalUrl } from '../types/portfolio';
import { Reveal } from './Reveal';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  onEditCertification: (cert: CertificationItem) => void;
}

export function CertificationsSection({
  certifications,
  onEditCertification,
}: CertificationsSectionProps) {
  return (
    <section id="certifications" className="border-y border-[#97B2DE]/15 bg-[#152c4d] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#97B2DE]">
              Certifications &amp; Learning
            </p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Verified Training &amp; Credential Gallery
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#d8e5f7]">
              Editable slots for your authentic certifications and training records. Upload
              certificate images and attach official verification URLs at any time.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, idx) => {
            const safeUrl = sanitizeExternalUrl(cert.credentialUrl);

            return (
              <Reveal key={cert.id} delayMs={idx * 45}>
                <article className="portfolio-card flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* Certificate Image Preview or Clean Placeholder */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#d3e0f2] bg-[#eef4fc]">
                    {cert.certificateImage ? (
                      <img
                        src={cert.certificateImage}
                        alt={`${cert.trackTitle} certificate`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#092147] text-[#97B2DE] shadow-sm">
                          <Award className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="mt-3 text-xs font-semibold text-[#092147]">
                          Certificate Image Placeholder
                        </p>
                        <p className="mt-0.5 text-xs text-[#4b5c73]">
                          Click Manage to upload badge or scan
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#1A488E]">
                      <span className="font-semibold text-[#1A488E]">{cert.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums text-[#4b5c73]">{cert.issueDate}</span>
                    </div>

                    <h3 className="mt-2 text-lg font-bold text-[#092147]">{cert.trackTitle}</h3>

                    <p className="mt-1 text-xs font-medium text-[#4b5c73]">
                      Issuer: {cert.issuer}
                      {cert.credentialId ? ` · ID: ${cert.credentialId}` : ''}
                    </p>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4b5c73]">
                      {cert.notes}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#d3e0f2] pt-4">
                      <button
                        type="button"
                        onClick={() => onEditCertification(cert)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#d3e0f2] bg-[#eef4fc] px-3.5 py-2 text-xs font-semibold text-[#092147] transition-colors hover:border-[#1A488E] hover:bg-[#dce7f7] cursor-pointer"
                      >
                        {cert.certificateImage ? (
                          <Pencil className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
                        ) : (
                          <ImagePlus className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
                        )}
                        <span>{cert.isPlaceholder ? 'Add Credential' : 'Manage'}</span>
                      </button>

                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-[#092147] hover:text-[#1A488E]"
                        >
                          <span>Verify Credential</span>
                          <ExternalLink className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
