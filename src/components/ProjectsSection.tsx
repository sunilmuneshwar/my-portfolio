import { useState } from 'react';
import { ArrowUpRight, FolderKanban, Pencil, Plus } from 'lucide-react';
import type { ProjectCategory, ProjectItem } from '../types/portfolio';
import { Reveal } from './Reveal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onViewProject: (project: ProjectItem) => void;
  onEditProject: (project: ProjectItem) => void;
  onAddProject: () => void;
}

const FILTER_CATEGORIES: Array<'All' | ProjectCategory> = [
  'All',
  'IT Infrastructure',
  'VMware',
  'Azure Cloud',
  'Web Development',
  'Digital Marketing',
];

export function ProjectsSection({
  projects,
  onViewProject,
  onEditProject,
  onAddProject,
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <section id="projects" className="warm-section-bg py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#f47721]">My Latest Projects</p>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
                Explore My Technical and Digital Projects
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#5a6577]">
                Editable project templates clearly labeled until replaced with your completed
                case studies and live deployments.
              </p>
            </div>
            <button
              type="button"
              onClick={onAddProject}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#101c30] px-4 py-2.5 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#172942] cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
              Add Project
            </button>
          </div>
        </Reveal>

        {/* Functional Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {FILTER_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer sm:text-sm ${
                  isActive
                    ? 'bg-[#f47721] text-[#101c30] shadow-[0_8px_18px_-8px_rgba(244,119,33,0.55)]'
                    : 'border border-[#f3dfd0] bg-white text-[#101c30] hover:border-[#f47721] hover:bg-[#ffefe2]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Project Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#f3dfd0] bg-white p-10 text-center">
            <p className="text-sm font-medium text-[#5a6577]">
              No projects listed in {selectedCategory} yet. Add a project to showcase your work.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, idx) => (
              <Reveal key={project.id} delayMs={idx * 45}>
                <article className="portfolio-card group flex h-full flex-col overflow-hidden rounded-2xl">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fff6ef]">
                    {project.thumbnail && !failedImages[project.id] ? (
                      <img
                        src={project.thumbnail}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#101c30] to-[#172942] p-6 text-center">
                        <FolderKanban className="h-9 w-9 text-[#f47721]" aria-hidden="true" />
                        <p className="mt-2 text-xs font-semibold text-white">
                          {project.category}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Clean unboxed metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#172942]">
                      <span className="font-semibold text-[#f47721]">{project.category}</span>
                      {project.isSampleTemplate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#5a6577]">Sample Template</span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-bold leading-snug text-[#101c30]">
                      {project.title}
                    </h3>

                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#5a6577]">
                      {project.shortDescription}
                    </p>

                    {/* Clean unboxed technology list */}
                    <p className="mt-4 border-t border-[#f3dfd0] pt-3.5 text-xs font-medium text-[#5a6577]">
                      {project.technologies.join(' · ')}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onViewProject(project)}
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg bg-[#101c30] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#172942] cursor-pointer sm:text-sm"
                      >
                        <span>View Project</span>
                        <ArrowUpRight className="h-4 w-4 text-[#f47721]" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProject(project)}
                        aria-label={`Edit ${project.title}`}
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-[#f3dfd0] bg-[#fff6ef] px-3 py-2 text-xs font-semibold text-[#101c30] transition-colors hover:border-[#f47721] hover:bg-[#ffefe2] cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#f47721]" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
