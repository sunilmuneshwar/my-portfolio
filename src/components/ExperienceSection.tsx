import { Briefcase, Calendar, MapPin, Pencil, Plus } from 'lucide-react';
import type { ExperienceItem } from '../types/portfolio';
import { Reveal } from './Reveal';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onEditExperience: (item: ExperienceItem) => void;
  onAddExperience: () => void;
}

export function ExperienceSection({
  experiences,
  onEditExperience,
  onAddExperience,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="warm-section-bg py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#f47721]">Professional Experience</p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
                16 Years of Enterprise IT Career Milestones
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#5a6577]">
                Structured timeline ready for your verified employers, dates, responsibilities,
                and technical achievements. Edit any entry directly or add additional roles.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddExperience}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#101c30] px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#172942] cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
              Add Experience
            </button>
          </div>
        </Reveal>

        {/* Vertical Timeline */}
        <div className="relative mt-12 space-y-7 pl-6 sm:pl-10">
          {/* Vertical Spine */}
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-2 w-0.5 bg-[#f47721]/30 sm:left-3.5"
          />

          {experiences.map((exp, idx) => (
            <Reveal key={exp.id} delayMs={idx * 60}>
              <article className="portfolio-card relative rounded-2xl p-6 sm:p-7">
                {/* Timeline Node */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[23px] top-7 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#f47721] bg-white sm:-left-[33px]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f47721]" />
                </span>

                <div className="flex flex-col justify-between gap-4 border-b border-[#f3dfd0] pb-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#172942]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#f47721]" aria-hidden="true" />
                        <span className="tabular-nums">{exp.period}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#f47721]" aria-hidden="true" />
                        {exp.location}
                      </span>
                      {exp.isPlaceholder && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#5a6577]">Editable Placeholder</span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-[#101c30]">{exp.roleTitle}</h3>

                    <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#5a6577]">
                      <Briefcase className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
                      {exp.companyName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditExperience(exp)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 self-start rounded-lg border border-[#f3dfd0] bg-[#fff6ef] px-3.5 py-2 text-xs font-semibold text-[#101c30] whitespace-nowrap shrink-0 transition-colors hover:border-[#f47721] hover:bg-[#ffefe2] cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#f47721]" aria-hidden="true" />
                    Edit Role
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-[#172942]">
                      Key Responsibilities
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-[#64748b]">
                      {exp.responsibilities.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47721]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-[#172942]">
                      Technical Achievements
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-[#64748b]">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47721]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
