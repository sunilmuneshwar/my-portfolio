import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import {
  EditCertificationModal,
  EditContactModal,
  EditExperienceModal,
  EditProjectModal,
  EditSkillCategoryModal,
  PortfolioCustomizerModal,
  ProjectDetailModal,
  ServiceDetailModal,
} from './components/PortfolioModals';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { SkillsSection } from './components/SkillsSection';
import { DEFAULT_PORTFOLIO_STATE } from './data/defaultPortfolio';
import type {
  CertificationItem,
  ExperienceItem,
  PortfolioState,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from './types/portfolio';

const STORAGE_KEY = 'sunil_muneshwar_portfolio_v1';

const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'experience',
  'services',
  'projects',
  'certifications',
  'contact',
];

function loadSavedPortfolio(): PortfolioState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_STATE;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.skillCategories) &&
      Array.isArray(parsed.experiences) &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.certifications) &&
      parsed.contact
    ) {
      const loaded = parsed as PortfolioState;
      return {
        ...loaded,
        profilePhoto: loaded.profilePhoto || DEFAULT_PORTFOLIO_STATE.profilePhoto,
        contact: {
          ...loaded.contact,
          email:
            !loaded.contact?.email || loaded.contact.email === 'your.email@example.com'
              ? DEFAULT_PORTFOLIO_STATE.contact.email
              : loaded.contact.email,
          phone:
            !loaded.contact?.phone || loaded.contact.phone === '+91 00000 00000'
              ? DEFAULT_PORTFOLIO_STATE.contact.phone
              : loaded.contact.phone,
        },
      };
    }
    return DEFAULT_PORTFOLIO_STATE;
  } catch {
    return DEFAULT_PORTFOLIO_STATE;
  }
}

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioState>(() => loadSavedPortfolio());
  const [activeSection, setActiveSection] = useState<string>('home');
  const [prefilledSubject, setPrefilledSubject] = useState<string>('');

  // Active modal states
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editingSkillCategory, setEditingSkillCategory] = useState<SkillCategory | null>(null);
  const [editingExperience, setEditingExperience] = useState<{
    item: ExperienceItem;
    isNew: boolean;
  } | null>(null);
  const [editingProject, setEditingProject] = useState<{
    item: ProjectItem;
    isNew: boolean;
  } | null>(null);
  const [editingCertification, setEditingCertification] = useState<CertificationItem | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Persist user edits locally in browser
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [portfolio]);

  // Active navigation scroll spy
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          const id = visible[0].target.id;
          setActiveSection(id === 'certifications' ? 'projects' : id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.3, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpToContact = (subject?: string) => {
    if (subject) setPrefilledSubject(subject);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-[#101c30]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#f47721] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#101c30]"
      >
        Skip to main content
      </a>

      <Header
        activeSection={activeSection}
        onHireMeClick={() => jumpToContact('Hiring / Consulting Opportunity')}
      />

      <main id="main-content">
        <HeroSection
          profilePhoto={portfolio.profilePhoto}
          contact={portfolio.contact}
          onUploadPhoto={(dataUrl) =>
            setPortfolio((prev) => ({ ...prev, profilePhoto: dataUrl }))
          }
          onRemovePhoto={() =>
            setPortfolio((prev) => ({ ...prev, profilePhoto: undefined }))
          }
          onExploreWork={() =>
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
          onContactClick={() => jumpToContact()}
        />

        <AboutSection onOpenCustomizer={() => setCustomizerOpen(true)} />

        <SkillsSection
          categories={portfolio.skillCategories}
          onEditCategory={(category) => setEditingSkillCategory(category)}
        />

        <ExperienceSection
          experiences={portfolio.experiences}
          onEditExperience={(item) => setEditingExperience({ item, isNew: false })}
          onAddExperience={() =>
            setEditingExperience({
              isNew: true,
              item: {
                id: `exp-${Date.now().toString(36)}`,
                roleTitle: '',
                companyName: '',
                period: '',
                location: 'India',
                isPlaceholder: false,
                responsibilities: [''],
                achievements: [''],
              },
            })
          }
        />

        <ServicesSection onSelectService={(service) => setSelectedService(service)} />

        <ProjectsSection
          projects={portfolio.projects}
          onViewProject={(project) => setSelectedProject(project)}
          onEditProject={(item) => setEditingProject({ item, isNew: false })}
          onAddProject={() =>
            setEditingProject({
              isNew: true,
              item: {
                id: `proj-${Date.now().toString(36)}`,
                title: '',
                category: 'IT Infrastructure',
                shortDescription: '',
                architectureNotes: '',
                outcomes: [''],
                technologies: ['Windows Server'],
                thumbnail: '/src/assets/images/project_it_infrastructure_1795614053074.jpg',
                isSampleTemplate: false,
              },
            })
          }
        />

        <CertificationsSection
          certifications={portfolio.certifications}
          onEditCertification={(cert) => setEditingCertification(cert)}
        />

        <ContactSection
          contact={portfolio.contact}
          prefilledSubject={prefilledSubject}
          onEditContact={() => setEditingContact(true)}
        />
      </main>

      <Footer contact={portfolio.contact} />

      {/* Modals */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onInquire={(subject) => jumpToContact(subject)}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={() => {
            const target = selectedProject;
            setSelectedProject(null);
            setEditingProject({ item: target, isNew: false });
          }}
        />
      )}

      {editingSkillCategory && (
        <EditSkillCategoryModal
          category={editingSkillCategory}
          onClose={() => setEditingSkillCategory(null)}
          onSave={(updated) =>
            setPortfolio((prev) => ({
              ...prev,
              skillCategories: prev.skillCategories.map((cat) =>
                cat.id === updated.id ? updated : cat
              ),
            }))
          }
        />
      )}

      {editingExperience && (
        <EditExperienceModal
          experience={editingExperience.item}
          isNew={editingExperience.isNew}
          onClose={() => setEditingExperience(null)}
          onSave={(saved) =>
            setPortfolio((prev) => ({
              ...prev,
              experiences: editingExperience.isNew
                ? [saved, ...prev.experiences]
                : prev.experiences.map((e) => (e.id === saved.id ? saved : e)),
            }))
          }
          onDelete={(id) =>
            setPortfolio((prev) => ({
              ...prev,
              experiences: prev.experiences.filter((e) => e.id !== id),
            }))
          }
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject.item}
          isNew={editingProject.isNew}
          onClose={() => setEditingProject(null)}
          onSave={(saved) =>
            setPortfolio((prev) => ({
              ...prev,
              projects: editingProject.isNew
                ? [saved, ...prev.projects]
                : prev.projects.map((p) => (p.id === saved.id ? saved : p)),
            }))
          }
          onDelete={(id) =>
            setPortfolio((prev) => ({
              ...prev,
              projects: prev.projects.filter((p) => p.id !== id),
            }))
          }
        />
      )}

      {editingCertification && (
        <EditCertificationModal
          certification={editingCertification}
          onClose={() => setEditingCertification(null)}
          onSave={(saved) =>
            setPortfolio((prev) => ({
              ...prev,
              certifications: prev.certifications.map((c) =>
                c.id === saved.id ? saved : c
              ),
            }))
          }
        />
      )}

      {editingContact && (
        <EditContactModal
          contact={portfolio.contact}
          onClose={() => setEditingContact(false)}
          onSave={(updated) =>
            setPortfolio((prev) => ({ ...prev, contact: updated }))
          }
        />
      )}

      {customizerOpen && (
        <PortfolioCustomizerModal
          state={portfolio}
          onClose={() => setCustomizerOpen(false)}
          onImportState={(next) => setPortfolio(next)}
          onResetState={() => setPortfolio(DEFAULT_PORTFOLIO_STATE)}
        />
      )}
    </div>
  );
}
