import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  Check,
  Download,
  ExternalLink,
  FileText,
  ImagePlus,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { DEFAULT_RESUME_URL } from '../data/defaultPortfolio';
import type {
  CertificationItem,
  ContactDetails,
  ExperienceItem,
  PortfolioState,
  ProjectCategory,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from '../types/portfolio';
import { sanitizeExternalUrl, sanitizeResumeUrl } from '../types/portfolio';

interface ModalShellProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

function ModalShell({ title, subtitle, onClose, children }: ModalShellProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#092147]/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d3e0f2] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#d3e0f2] bg-[#092147] px-6 py-4 text-white">
          <div>
            <h2 id="modal-dialog-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-xs text-[#cbd5e1]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#1A488E] text-white transition-colors hover:border-[#97B2DE] hover:text-[#97B2DE] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* 1. Service Detail Modal */
export function ServiceDetailModal({
  service,
  onClose,
  onInquire,
}: {
  service: ServiceItem;
  onClose: () => void;
  onInquire: (subject: string) => void;
}) {
  return (
    <ModalShell title={service.title} subtitle="Service Overview & Key Deliverables" onClose={onClose}>
      <p className="text-sm leading-relaxed text-[#1A488E]">{service.detailedOverview}</p>

      <h3 className="mt-6 text-xs font-semibold text-[#1A488E]">Core Focus Areas</h3>
      <ul className="mt-3 space-y-2.5">
        {service.deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[#092147]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A488E]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-[#d3e0f2] pt-5">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onInquire(`Service Inquiry: ${service.title}`);
          }}
          className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
        >
          Inquire About This Service
        </button>
      </div>
    </ModalShell>
  );
}

/* 2. Project Detail Modal */
export function ProjectDetailModal({
  project,
  onClose,
  onEdit,
}: {
  project: ProjectItem;
  onClose: () => void;
  onEdit: () => void;
}) {
  const safeLive = sanitizeExternalUrl(project.liveUrl);
  const safeRepo = sanitizeExternalUrl(project.repoUrl);

  return (
    <ModalShell
      title={project.title}
      subtitle={`${project.category}${project.isSampleTemplate ? ' · Editable Sample Template' : ''}`}
      onClose={onClose}
    >
      {project.thumbnail && (
        <div className="overflow-hidden rounded-xl border border-[#d3e0f2]">
          <img
            src={project.thumbnail}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      <p className="mt-5 text-sm leading-relaxed text-[#092147]">{project.shortDescription}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{project.architectureNotes}</p>

      {project.outcomes.length > 0 && (
        <>
          <h3 className="mt-6 text-xs font-semibold text-[#1A488E]">Highlights &amp; Scope</h3>
          <ul className="mt-2.5 space-y-2">
            {project.outcomes.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#092147]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A488E]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-5 border-t border-[#d3e0f2] pt-4">
        <p className="text-xs font-semibold text-[#1A488E]">Technologies</p>
        <p className="mt-1 text-sm text-[#64748b]">{project.technologies.join(' · ')}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#d3e0f2] pt-5">
        <div className="flex flex-wrap items-center gap-3">
          {safeLive && (
            <a
              href={safeLive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#1A488E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#092147]"
            >
              <span>Open Live Link</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          {safeRepo && (
            <a
              href={safeRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#092147] px-4 py-2 text-xs font-semibold text-[#092147] hover:bg-[#eef4fc]"
            >
              <span>Documentation / Repo</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onEdit}
            className="min-h-[40px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-xs font-semibold text-[#092147] hover:border-[#1A488E] hover:bg-[#eef4fc] cursor-pointer"
          >
            Edit Project
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] rounded-lg bg-[#092147] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A488E] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* 3. Edit Skills Category Modal */
export function EditSkillCategoryModal({
  category,
  onSave,
  onClose,
}: {
  category: SkillCategory;
  onSave: (updated: SkillCategory) => void;
  onClose: () => void;
}) {
  const [skills, setSkills] = useState(category.skills);
  const [newSkillName, setNewSkillName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...category, skills: skills.filter((s) => s.name.trim().length > 0) });
    onClose();
  };

  return (
    <ModalShell
      title={`Edit ${category.title}`}
      subtitle="Leave proficiency blank to hide bars, or enter a value from 1 to 100."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2.5">
          {skills.map((skill, idx) => (
            <div key={skill.id} className="flex items-center gap-2.5">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setSkills((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                  );
                }}
                aria-label="Skill name"
                className="flex-1 rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
              />
              <input
                type="number"
                min={1}
                max={100}
                placeholder="%"
                value={skill.level ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed = raw === '' ? undefined : Math.min(100, Math.max(1, Number(raw)));
                  setSkills((prev) =>
                    prev.map((item, i) => (i === idx ? { ...item, level: parsed } : item))
                  );
                }}
                aria-label={`${skill.name} proficiency percentage`}
                className="w-20 rounded-lg border border-[#d3e0f2] px-2.5 py-2 text-sm text-[#092147] tabular-nums focus:border-[#1A488E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSkills((prev) => prev.filter((_, i) => i !== idx))}
                aria-label={`Remove ${skill.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d3e0f2] text-[#092147] hover:border-[#1A488E] hover:bg-[#eef4fc] cursor-pointer"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-[#d3e0f2] pt-4">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add another skill or tool..."
            className="flex-1 rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = newSkillName.trim();
              if (!trimmed) return;
              setSkills((prev) => [
                ...prev,
                { id: `sk-${Date.now().toString(36)}`, name: trimmed },
              ]);
              setNewSkillName('');
            }}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-[#092147] px-3.5 py-2 text-xs font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
            Add
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#d3e0f2] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* 4. Edit Experience Modal */
export function EditExperienceModal({
  experience,
  isNew,
  onSave,
  onDelete,
  onClose,
}: {
  experience: ExperienceItem;
  isNew: boolean;
  onSave: (item: ExperienceItem) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}) {
  const [roleTitle, setRoleTitle] = useState(experience.roleTitle);
  const [companyName, setCompanyName] = useState(experience.companyName);
  const [period, setPeriod] = useState(experience.period);
  const [location, setLocation] = useState(experience.location);
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    experience.responsibilities.join('\n')
  );
  const [achievementsText, setAchievementsText] = useState(
    experience.achievements.join('\n')
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...experience,
      roleTitle: roleTitle.trim() || 'IT Infrastructure Role',
      companyName: companyName.trim() || '[Company Name]',
      period: period.trim() || '[Period]',
      location: location.trim() || 'India',
      isPlaceholder: false,
      responsibilities: responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      achievements: achievementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <ModalShell
      title={isNew ? 'Add Experience Entry' : 'Edit Experience Entry'}
      subtitle="Enter your authentic role title, company name, dates, and accomplishments."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Job Title</label>
            <input
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Employment Period</label>
            <input
              type="text"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g., 2018 – Present"
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Key Responsibilities (one per line)
          </label>
          <textarea
            rows={4}
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Technical Achievements (one per line)
          </label>
          <textarea
            rows={3}
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d3e0f2] pt-4">
          {!isNew && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(experience.id);
                onClose();
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#d3e0f2] px-3.5 py-2 text-xs font-semibold text-[#092147] hover:border-[#1A488E] hover:bg-[#eef4fc] cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete Entry
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
            >
              Save Experience
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* 5. Edit / Add Project Modal */
const PROJECT_CATEGORIES: ProjectCategory[] = [
  'IT Infrastructure',
  'VMware',
  'Azure Cloud',
  'Web Development',
  'Digital Marketing',
];

export function EditProjectModal({
  project,
  isNew,
  onSave,
  onDelete,
  onClose,
}: {
  project: ProjectItem;
  isNew: boolean;
  onSave: (item: ProjectItem) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState<ProjectCategory>(project.category);
  const [shortDescription, setShortDescription] = useState(project.shortDescription);
  const [architectureNotes, setArchitectureNotes] = useState(project.architectureNotes);
  const [outcomesText, setOutcomesText] = useState(project.outcomes.join('\n'));
  const [techText, setTechText] = useState(project.technologies.join(', '));
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || '');
  const [repoUrl, setRepoUrl] = useState(project.repoUrl || '');
  const [isSampleTemplate, setIsSampleTemplate] = useState(project.isSampleTemplate);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (liveUrl.trim() && !sanitizeExternalUrl(liveUrl)) {
      setUrlError('Live URL must begin with https:// or http://');
      return;
    }
    if (repoUrl.trim() && !sanitizeExternalUrl(repoUrl)) {
      setUrlError('Documentation/Repo URL must begin with https:// or http://');
      return;
    }

    onSave({
      ...project,
      title: title.trim() || 'Untitled Project',
      category,
      shortDescription: shortDescription.trim(),
      architectureNotes: architectureNotes.trim(),
      outcomes: outcomesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: techText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl: sanitizeExternalUrl(liveUrl) || undefined,
      repoUrl: sanitizeExternalUrl(repoUrl) || undefined,
      isSampleTemplate,
    });
    onClose();
  };

  return (
    <ModalShell
      title={isNew ? 'Add Project' : 'Edit Project'}
      subtitle="Update with your real project scope, technologies, and verified links."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Project Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] bg-white px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">Short Description</label>
          <textarea
            rows={2}
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Architecture / Overview
          </label>
          <textarea
            rows={2}
            value={architectureNotes}
            onChange={(e) => setArchitectureNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Key Outcomes (one per line)
          </label>
          <textarea
            rows={3}
            value={outcomesText}
            onChange={(e) => setOutcomesText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
            placeholder="VMware vSphere, ESXi, Azure Backup"
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              Live URL (optional, https://)
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              Repo / Case Study URL (optional)
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-xs font-medium text-[#64748b]">
          <input
            type="checkbox"
            checked={!isSampleTemplate}
            onChange={(e) => setIsSampleTemplate(!e.target.checked)}
            className="h-4 w-4 accent-[#1A488E]"
          />
          <span>Mark as my completed project (removes the &ldquo;Sample Template&rdquo; label)</span>
        </label>

        {urlError && (
          <p role="alert" className="text-xs font-semibold text-[#b91c1c]">
            {urlError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d3e0f2] pt-4">
          {!isNew && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(project.id);
                onClose();
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#d3e0f2] px-3.5 py-2 text-xs font-semibold text-[#092147] hover:border-[#1A488E] hover:bg-[#eef4fc] cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete Project
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* 6. Manage Certification Modal */
export function EditCertificationModal({
  certification,
  onSave,
  onClose,
}: {
  certification: CertificationItem;
  onSave: (item: CertificationItem) => void;
  onClose: () => void;
}) {
  const [trackTitle, setTrackTitle] = useState(certification.trackTitle);
  const [issuer, setIssuer] = useState(certification.issuer);
  const [issueDate, setIssueDate] = useState(certification.issueDate);
  const [credentialId, setCredentialId] = useState(certification.credentialId);
  const [credentialUrl, setCredentialUrl] = useState(certification.credentialUrl);
  const [notes, setNotes] = useState(certification.notes);
  const [certificateImage, setCertificateImage] = useState(certification.certificateImage);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP certificate image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Certificate image must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCertificateImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (credentialUrl.trim() && !sanitizeExternalUrl(credentialUrl)) {
      setError('Credential verification URL must start with https:// or http://');
      return;
    }

    onSave({
      ...certification,
      trackTitle: trackTitle.trim() || certification.trackTitle,
      issuer: issuer.trim() || certification.issuer,
      issueDate: issueDate.trim() || 'Pending Entry',
      credentialId: credentialId.trim(),
      credentialUrl: sanitizeExternalUrl(credentialUrl),
      notes: notes.trim(),
      certificateImage,
      isPlaceholder: false,
    });
    onClose();
  };

  return (
    <ModalShell
      title="Manage Certification"
      subtitle="Upload a certificate image and add authentic credential verification details."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Uploader */}
        <div className="rounded-xl border border-[#d3e0f2] bg-[#eef4fc] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#092147]">Certificate Image / Badge</p>
              <p className="text-xs text-[#64748b]">JPG, PNG, or WebP (max 2 MB)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#092147] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1A488E] cursor-pointer"
              >
                <ImagePlus className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
                {certificateImage ? 'Replace Image' : 'Upload Image'}
              </button>
              {certificateImage && (
                <button
                  type="button"
                  onClick={() => setCertificateImage(undefined)}
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-[#d3e0f2] bg-white px-3 py-2 text-xs font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {certificateImage && (
            <img
              src={certificateImage}
              alt="Uploaded certificate preview"
              className="mt-3 max-h-44 w-full rounded-lg border border-[#d3e0f2] object-contain bg-white"
            />
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              Certification Title
            </label>
            <input
              type="text"
              required
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              Issuing Organization
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Issue Date / Year</label>
            <input
              type="text"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              placeholder="e.g., March 2025"
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              Credential ID (optional)
            </label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g., AZ-104-XXXX"
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Credential Verification URL (optional, https://)
          </label>
          <input
            type="url"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://learn.microsoft.com/..."
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">
            Summary / Training Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-xs font-semibold text-[#b91c1c]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-[#d3e0f2] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
          >
            Save Credential
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* 7. Edit Contact Details Modal */
export function EditContactModal({
  contact,
  onSave,
  onClose,
}: {
  contact: ContactDetails;
  onSave: (updated: ContactDetails) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<ContactDetails>(contact);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (values.linkedinUrl.trim() && !sanitizeExternalUrl(values.linkedinUrl)) {
      setError('LinkedIn URL must start with https:// or http://');
      return;
    }
    if (values.githubUrl.trim() && !sanitizeExternalUrl(values.githubUrl)) {
      setError('GitHub URL must start with https:// or http://');
      return;
    }
    onSave({
      ...values,
      email: values.email.trim(),
      phone: values.phone.trim(),
      location: values.location.trim() || 'India',
      linkedinUrl: sanitizeExternalUrl(values.linkedinUrl),
      githubUrl: sanitizeExternalUrl(values.githubUrl),
      whatsappNumber: values.whatsappNumber.trim(),
    });
    onClose();
  };

  return (
    <ModalShell
      title="Edit Contact Details"
      subtitle="Replace contact placeholders with your real email, phone, and social profile URLs."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Email Address</label>
            <input
              type="email"
              required
              value={values.email}
              onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Phone Number</label>
            <input
              type="text"
              value={values.phone}
              onChange={(e) => setValues((p) => ({ ...p, phone: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">Location</label>
            <input
              type="text"
              value={values.location}
              onChange={(e) => setValues((p) => ({ ...p, location: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#092147]">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={values.whatsappNumber}
              onChange={(e) => setValues((p) => ({ ...p, whatsappNumber: e.target.value }))}
              placeholder="+919876543210"
              className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">LinkedIn Profile URL</label>
          <input
            type="url"
            value={values.linkedinUrl}
            onChange={(e) => setValues((p) => ({ ...p, linkedinUrl: e.target.value }))}
            placeholder="https://www.linkedin.com/in/..."
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#092147]">GitHub Profile URL</label>
          <input
            type="url"
            value={values.githubUrl}
            onChange={(e) => setValues((p) => ({ ...p, githubUrl: e.target.value }))}
            placeholder="https://github.com/..."
            className="mt-1 w-full rounded-lg border border-[#d3e0f2] px-3 py-2 text-sm text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-xs font-semibold text-[#b91c1c]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-[#d3e0f2] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] rounded-lg border border-[#d3e0f2] px-4 py-2 text-sm font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-[42px] rounded-lg bg-[#1A488E] px-5 py-2 text-sm font-semibold text-white hover:bg-[#092147] cursor-pointer"
          >
            Save Details
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* 8. Portfolio Resume, Backup / Export / Reset Modal */
export function PortfolioCustomizerModal({
  state,
  onUpdateResume,
  onImportState,
  onResetState,
  onClose,
}: {
  state: PortfolioState;
  onUpdateResume: (resumeUrl: string, resumeFileName?: string) => void;
  onImportState: (next: PortfolioState) => void;
  onResetState: () => void;
  onClose: () => void;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resumeUrlInput, setResumeUrlInput] = useState(
    state.resumeUrl?.startsWith('data:') ? '' : state.resumeUrl || DEFAULT_RESUME_URL
  );
  const [resumeError, setResumeError] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);
  const resumeFileRef = useRef<HTMLInputElement | null>(null);

  const activeResumeUrl = sanitizeResumeUrl(state.resumeUrl) || DEFAULT_RESUME_URL;

  const handleResumeUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setResumeError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setResumeError('Please select a valid PDF file (.pdf).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setResumeError('PDF file must be 4 MB or smaller to save in browser storage.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:application/pdf;base64,')) {
        onUpdateResume(reader.result, file.name);
        setResumeUrlInput('');
        setStatusMessage(`Uploaded "${file.name}" as the active Download Resume PDF.`);
      } else {
        setResumeError('Unable to read the selected PDF file.');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveResumeUrl = (event: FormEvent) => {
    event.preventDefault();
    setResumeError(null);
    const safe = sanitizeResumeUrl(resumeUrlInput);
    if (!safe) {
      setResumeError('Enter a valid hosted PDF link starting with https:// or /assets/...');
      return;
    }
    onUpdateResume(safe, 'Sunil-Govind-Muneshwar-Resume.pdf');
    setStatusMessage('Updated Download Resume link.');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sunil-muneshwar-portfolio-data.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Portfolio data exported as JSON.');
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (
          parsed &&
          Array.isArray(parsed.skillCategories) &&
          Array.isArray(parsed.experiences) &&
          Array.isArray(parsed.projects) &&
          Array.isArray(parsed.certifications) &&
          parsed.contact
        ) {
          onImportState(parsed as PortfolioState);
          setStatusMessage('Portfolio data imported successfully.');
        } else {
          setStatusMessage('Selected JSON does not match the portfolio data structure.');
        }
      } catch {
        setStatusMessage('Unable to read the selected JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <ModalShell
      title="Resume & Portfolio Content Manager"
      subtitle="Upload or link your resume PDF and export or restore your portfolio data."
      onClose={onClose}
    >
      {/* Resume PDF Upload / Hosted Link Section */}
      <div className="rounded-xl border border-[#d3e0f2] bg-[#eef4fc] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#092147] text-[#97B2DE]">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#092147]">Resume PDF File</p>
              <p className="text-xs text-[#64748b]">
                Active file: {state.resumeFileName || 'Sunil-Govind-Muneshwar-Resume.pdf'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => resumeFileRef.current?.click()}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#1A488E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#092147] cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Upload PDF
            </button>
            <a
              href={activeResumeUrl}
              download={
                /^https?:\/\//i.test(activeResumeUrl)
                  ? undefined
                  : state.resumeFileName || 'Sunil-Govind-Muneshwar-Resume.pdf'
              }
              target={/^https?:\/\//i.test(activeResumeUrl) ? '_blank' : undefined}
              rel={/^https?:\/\//i.test(activeResumeUrl) ? 'noopener noreferrer' : undefined}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#092147] bg-white px-3 py-2 text-xs font-semibold text-[#092147] hover:bg-[#eef4fc]"
            >
              <Download className="h-3.5 w-3.5 text-[#1A488E]" aria-hidden="true" />
              Test Download
            </a>
          </div>
        </div>

        <form onSubmit={handleSaveResumeUrl} className="mt-3.5 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={resumeUrlInput}
            onChange={(e) => {
              setResumeUrlInput(e.target.value);
              if (resumeError) setResumeError(null);
            }}
            placeholder="https://example.com/sunil-resume.pdf or /assets/..."
            aria-label="Hosted Resume PDF URL"
            className="flex-1 rounded-lg border border-[#d3e0f2] bg-white px-3 py-2 text-xs text-[#092147] focus:border-[#1A488E] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-[#092147] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A488E] cursor-pointer"
          >
            Save Link
          </button>
          <button
            type="button"
            onClick={() => {
              onUpdateResume(DEFAULT_RESUME_URL, 'Sunil-Govind-Muneshwar-Resume.pdf');
              setResumeUrlInput(DEFAULT_RESUME_URL);
              setResumeError(null);
              setStatusMessage('Restored default Sunil Govind Muneshwar Resume PDF.');
            }}
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg border border-[#d3e0f2] bg-white px-3 py-2 text-xs font-semibold text-[#092147] hover:border-[#1A488E] cursor-pointer"
          >
            Default PDF
          </button>
        </form>

        <input
          ref={resumeFileRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleResumeUpload}
          className="hidden"
          aria-label="Upload resume PDF file"
        />

        {resumeError && (
          <p role="alert" className="mt-2 text-xs font-semibold text-[#b91c1c]">
            {resumeError}
          </p>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#64748b]">
        You can also customize your portrait photo, technical skill proficiency indicators,
        experience entries, project cards, certification credentials, and contact links
        directly on the page using each section&apos;s Edit button.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#092147] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1A488E] cursor-pointer"
        >
          <Download className="h-4 w-4 text-[#1A488E]" aria-hidden="true" />
          Export JSON
        </button>

        <button
          type="button"
          onClick={() => importRef.current?.click()}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#092147] bg-white px-4 py-2.5 text-xs font-semibold text-[#092147] hover:bg-[#eef4fc] cursor-pointer"
        >
          <Upload className="h-4 w-4 text-[#1A488E]" aria-hidden="true" />
          Import JSON
        </button>

        <button
          type="button"
          onClick={() => {
            onResetState();
            setResumeUrlInput(DEFAULT_RESUME_URL);
            setStatusMessage('Restored default portfolio templates.');
          }}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#d3e0f2] bg-white px-4 py-2.5 text-xs font-semibold text-[#092147] hover:border-[#1A488E] hover:bg-[#eef4fc] cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 text-[#1A488E]" aria-hidden="true" />
          Reset Defaults
        </button>
      </div>

      <input
        ref={importRef}
        type="file"
        accept="application/json"
        onChange={handleImport}
        className="hidden"
      />

      {statusMessage && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-[#eef4fc] border border-[#d3e0f2] px-4 py-2.5 text-xs font-medium text-[#092147]"
        >
          {statusMessage}
        </p>
      )}
    </ModalShell>
  );
}
