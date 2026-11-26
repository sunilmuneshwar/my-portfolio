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
  resumeUrl?: string;
  resumeFileName?: string;
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

/** Validates hosted PDF URLs, local /assets/ paths, or uploaded PDF data URIs. */
export function sanitizeResumeUrl(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/assets/') && !trimmed.includes('..')) {
    return trimmed;
  }
  if (trimmed.startsWith('data:application/pdf;base64,')) {
    return trimmed;
  }
  return sanitizeExternalUrl(trimmed);
}

/** Formats a phone number into a dialable tel: URI (defaults 10-digit numbers to +91). */
export function formatPhoneForTel(phone: string | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return `tel:${cleaned}`;
  if (cleaned.length === 10) return `tel:+91${cleaned}`;
  return `tel:+${cleaned}`;
}

/** Formats a WhatsApp number (falling back to phone) into a wa.me link. */
export function formatPhoneForWhatsApp(
  whatsappNumber: string | undefined,
  fallbackPhone?: string
): string {
  const source =
    whatsappNumber && whatsappNumber.replace(/[^\d]/g, '') !== '910000000000'
      ? whatsappNumber
      : fallbackPhone || '';
  const digits = source.replace(/[^\d]/g, '');
  if (!digits || /^0+$/.test(digits)) return '';
  const international = digits.length === 10 ? `91${digits}` : digits;
  const presetText = encodeURIComponent(
    'Hello Sunil, I saw your portfolio and would like to connect.'
  );
  return `https://wa.me/${international}?text=${presetText}`;
}
