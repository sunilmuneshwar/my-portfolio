import {
  Cloud,
  Database,
  Globe,
  Layers,
  MonitorCog,
  Network,
  Pencil,
} from 'lucide-react';
import type { SkillCategory } from '../types/portfolio';
import { Reveal } from './Reveal';

interface SkillsSectionProps {
  categories: SkillCategory[];
  onEditCategory: (category: SkillCategory) => void;
}

function CategoryIcon({ iconKey }: { iconKey: SkillCategory['iconKey'] }) {
  const iconClass = 'h-5 w-5 text-[#f47721]';
  switch (iconKey) {
    case 'windows':
      return <MonitorCog className={iconClass} aria-hidden="true" />;
    case 'virtualization':
      return <Layers className={iconClass} aria-hidden="true" />;
    case 'azure':
      return <Cloud className={iconClass} aria-hidden="true" />;
    case 'network':
      return <Network className={iconClass} aria-hidden="true" />;
    case 'sap':
      return <Database className={iconClass} aria-hidden="true" />;
    case 'digital':
      return <Globe className={iconClass} aria-hidden="true" />;
  }
}

export function SkillsSection({ categories, onEditCategory }: SkillsSectionProps) {
  return (
    <section id="skills" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#f47721]">My Technical Skills</p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
                Technologies and Tools I Work With
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#64748b] sm:text-right">
              Proficiency indicators are editable and appear only when verified proficiency
              values are supplied.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <Reveal key={category.id} delayMs={idx * 45}>
              <article className="portfolio-card flex h-full flex-col rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#101c30]">
                      <CategoryIcon iconKey={category.iconKey} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#101c30]">{category.title}</h3>
                      <p className="mt-0.5 text-xs text-[#64748b]">{category.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditCategory(category)}
                    aria-label={`Edit ${category.title} skill values`}
                    title="Edit skills & proficiency"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#f3dfd0] bg-[#fff6ef] text-[#172942] transition-colors hover:border-[#f47721] hover:bg-[#ffefe2] hover:text-[#f47721] cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <ul className="mt-6 flex-1 space-y-3 border-t border-[#f3dfd0] pt-5">
                  {category.skills.map((skill) => {
                    const hasLevel =
                      typeof skill.level === 'number' &&
                      !Number.isNaN(skill.level) &&
                      skill.level > 0;
                    const clampedLevel = hasLevel
                      ? Math.min(100, Math.max(1, Math.round(skill.level!)))
                      : 0;

                    return (
                      <li key={skill.id} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-medium text-[#101c30]">{skill.name}</span>
                          {hasLevel && (
                            <span className="text-xs font-semibold text-[#172942] tabular-nums">
                              {clampedLevel}%
                            </span>
                          )}
                        </div>
                        {hasLevel && (
                          <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-[#ffefe2]"
                            role="progressbar"
                            aria-valuenow={clampedLevel}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${skill.name} proficiency ${clampedLevel}%`}
                          >
                            <div
                              className="h-full rounded-full bg-[#f47721] transition-[width] duration-500 ease-out"
                              style={{ width: `${clampedLevel}%` }}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
