export interface SkillItem {
  id: string;
  name: string;
  /** Optional numeric proficiency (1-100). Animated indicator renders only when supplied. */
  level?: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  iconKey: 'windows' | 'virtualization' | 'azure' | 'network' | 'sap' | 'digital';
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  roleTitle: string;
  companyName: string;
  period: string;
  location: string;
  isPlaceholder: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedOverview: string;
  deliverables: string[];
  iconKey:
    | 'infrastructure'
    | 'vmware'
    | 'windows'
    | 'azure'
    | 'network'
    | 'm365'
    | 'web'
    | 'marketing';
}

export type ProjectCategory =
  | 'IT Infrastructure'
  | 'VMware'
  | 'Azure Cloud'
  | 'Web Development'
  | 'Digital Marketing';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  architectureNotes: string;
  outcomes: string[];
  technologies: string[];
  thumbnail: string;
  isSampleTemplate: boolean;
  liveUrl?: string;
  repoUrl?: string;
}

export interface CertificationItem {
  id: string;
  trackTitle: string;
  category: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  certificateImage?: string;
  isPlaceholder: boolean;
  notes: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappNumber: string;
}

export interface PortfolioState {
  profilePhoto?: string;
  skillCategories: SkillCategory[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  contact: ContactDetails;
}

/** Validates external links to allow only http(s) URLs and prevent unsafe URI schemes. */
export function sanitizeExternalUrl(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}
