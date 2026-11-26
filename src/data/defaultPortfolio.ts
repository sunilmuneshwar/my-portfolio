import type { PortfolioState, ServiceItem } from '../types/portfolio';

export const HERO_ROLES: string[] = [
  'IT Infrastructure Specialist',
  'VMware Administrator',
  'Azure Cloud Administrator',
  'Windows Server Administrator',
  'Network Support Engineer',
  'SAP Basis Administrator',
  'Digital Marketing Specialist',
];

export const ABOUT_HIGHLIGHTS: string[] = [
  '16 Years of IT Experience',
  'Infrastructure Administration',
  'VMware Virtualization',
  'Azure Cloud Technologies',
  'Network Administration',
  'Digital Marketing & Web Development',
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'srv-infra',
    title: 'IT Infrastructure Management',
    shortDescription:
      'End-to-end administration, availability planning, patching, and operational resilience for enterprise server and workplace environments.',
    detailedOverview:
      'Structured day-to-day governance and modernization of on-premises and hybrid IT infrastructure, focusing on uptime, security baselines, proactive monitoring, and documentation.',
    deliverables: [
      'Server lifecycle & patch management frameworks',
      'Backup verification & disaster recovery readiness',
      'Incident escalation & root-cause documentation',
      'Infrastructure health audits & capacity planning',
    ],
    iconKey: 'infrastructure',
  },
  {
    id: 'srv-vmware',
    title: 'VMware Virtualization Administration',
    shortDescription:
      'Design, deployment, and cluster management across VMware vSphere, ESXi hosts, vCenter Server, and Hyper-V workloads.',
    detailedOverview:
      'Reliable virtualized infrastructure operations covering host provisioning, high availability clusters, resource optimization, snapshots, and zero-disruption migrations.',
    deliverables: [
      'vSphere, ESXi & vCenter administration',
      'VM provisioning, templates & resource pooling',
      'HA/DRS tuning & datastore optimization',
      'Hyper-V & physical-to-virtual workload support',
    ],
    iconKey: 'vmware',
  },
  {
    id: 'srv-windows',
    title: 'Windows Server Administration',
    shortDescription:
      'Core identity and directory services management spanning Windows Server, Active Directory, DNS, DHCP, Group Policy, and IIS.',
    detailedOverview:
      'Hardened Windows Server architectures built around clean Active Directory topologies, standardized Group Policy Objects, and reliable network core services.',
    deliverables: [
      'Active Directory & Group Policy standardization',
      'DNS, DHCP & IIS configuration and maintenance',
      'Role-based access & server security hardening',
      'OS upgrades, service health & event auditing',
    ],
    iconKey: 'windows',
  },
  {
    id: 'srv-azure',
    title: 'Azure Cloud Administration',
    shortDescription:
      'Provisioning and governance of Azure Virtual Machines, Virtual Networking, Storage, Microsoft Entra ID, and Azure Backup.',
    detailedOverview:
      'Pragmatic cloud administration helping organizations run secure, well-governed hybrid workloads on Microsoft Azure with predictable operational controls.',
    deliverables: [
      'Azure VM sizing, availability & storage configuration',
      'Azure Virtual Networks, NSGs & hybrid connectivity',
      'Microsoft Entra ID identity & conditional access basics',
      'Azure Backup policies & recovery vault monitoring',
    ],
    iconKey: 'azure',
  },
  {
    id: 'srv-network',
    title: 'Network Administration',
    shortDescription:
      'Enterprise connectivity support including TCP/IP architecture, VLAN segmentation, routing, switching, firewalls, and VPNs.',
    detailedOverview:
      'Dependable LAN, WAN, and remote access networking engineered for clean traffic segmentation, fault isolation, and fast troubleshooting.',
    deliverables: [
      'VLAN planning, switching & routing configuration',
      'Firewall rule reviews & site-to-site / client VPNs',
      'TCP/IP subnetting & latency troubleshooting',
      'Network uptime diagnostics & documentation',
    ],
    iconKey: 'network',
  },
  {
    id: 'srv-m365',
    title: 'Microsoft 365 Administration',
    shortDescription:
      'Tenant administration, user lifecycle provisioning, licensing alignment, and cloud productivity support for distributed teams.',
    detailedOverview:
      'Streamlined Microsoft 365 operations combining Microsoft Entra ID governance with smooth onboarding, security hygiene, and workplace collaboration support.',
    deliverables: [
      'User & license lifecycle management',
      'Microsoft Entra ID & MFA readiness',
      'Exchange Online & Teams administration basics',
      'Backup hygiene & tenant security posture reviews',
    ],
    iconKey: 'm365',
  },
  {
    id: 'srv-web',
    title: 'Website Development',
    shortDescription:
      'Clean, mobile-responsive business websites and personal brand portals crafted with HTML5, CSS3, JavaScript, Bootstrap, and WordPress.',
    detailedOverview:
      'Fast-loading, structured websites built with semantic HTML5, responsive layouts, accessible navigation, and straightforward maintenance.',
    deliverables: [
      'Responsive corporate & portfolio websites',
      'WordPress setup, customization & speed hygiene',
      'Landing pages aligned with conversion goals',
      'On-page technical SEO & mobile responsiveness',
    ],
    iconKey: 'web',
  },
  {
    id: 'srv-marketing',
    title: 'Digital Marketing & SEO',
    shortDescription:
      'Search engine optimization and performance marketing foundations designed to improve visibility, search rankings, and qualified enquiries.',
    detailedOverview:
      'Data-informed digital growth support connecting clean website architecture with targeted search optimization and measurable campaign execution.',
    deliverables: [
      'Technical & on-page SEO audits and optimization',
      'Keyword research & content structure planning',
      'Performance marketing campaign setup & tracking',
      'Analytics reporting for continuous improvement',
    ],
    iconKey: 'marketing',
  },
];

export const DEFAULT_PORTFOLIO_STATE: PortfolioState = {
  profilePhoto: '/assets/aistudio/sunil_d9b21534.jpeg',
  skillCategories: [
    {
      id: 'cat-windows',
      title: 'Windows Infrastructure',
      subtitle: 'Enterprise directory, core services & server administration',
      iconKey: 'windows',
      skills: [
        { id: 'sk-win-server', name: 'Windows Server' },
        { id: 'sk-ad', name: 'Active Directory' },
        { id: 'sk-dns', name: 'DNS' },
        { id: 'sk-dhcp', name: 'DHCP' },
        { id: 'sk-gpo', name: 'Group Policy' },
        { id: 'sk-iis', name: 'IIS' },
        { id: 'sk-win-admin', name: 'Windows Administration' },
      ],
    },
    {
      id: 'cat-virtualization',
      title: 'Virtualization',
      subtitle: 'Cluster compute, hypervisors & virtual workload operations',
      iconKey: 'virtualization',
      skills: [
        { id: 'sk-vsphere', name: 'VMware vSphere' },
        { id: 'sk-esxi', name: 'ESXi' },
        { id: 'sk-vcenter', name: 'vCenter Server' },
        { id: 'sk-hyperv', name: 'Hyper-V' },
        { id: 'sk-vmm', name: 'Virtual Machine Management' },
      ],
    },
    {
      id: 'cat-azure',
      title: 'Azure Cloud',
      subtitle: 'Hybrid cloud compute, identity, storage & continuity',
      iconKey: 'azure',
      skills: [
        { id: 'sk-az-vm', name: 'Azure Virtual Machines' },
        { id: 'sk-az-net', name: 'Azure Networking' },
        { id: 'sk-az-stor', name: 'Azure Storage' },
        { id: 'sk-entra', name: 'Microsoft Entra ID' },
        { id: 'sk-az-bak', name: 'Azure Backup' },
        { id: 'sk-m365', name: 'Microsoft 365' },
      ],
    },
    {
      id: 'cat-networking',
      title: 'Networking',
      subtitle: 'Enterprise connectivity, segmentation & perimeter access',
      iconKey: 'network',
      skills: [
        { id: 'sk-tcpip', name: 'TCP/IP' },
        { id: 'sk-vlan', name: 'VLAN' },
        { id: 'sk-routing', name: 'Routing' },
        { id: 'sk-switching', name: 'Switching' },
        { id: 'sk-firewall', name: 'Firewall' },
        { id: 'sk-vpn', name: 'VPN' },
        { id: 'sk-nettshoot', name: 'Network Troubleshooting' },
      ],
    },
    {
      id: 'cat-sap',
      title: 'SAP Basis',
      subtitle: 'Enterprise ERP system monitoring, transports & access control',
      iconKey: 'sap',
      skills: [
        { id: 'sk-sap-basis', name: 'SAP Basis Administration' },
        { id: 'sk-sap-hana', name: 'SAP HANA Fundamentals' },
        { id: 'sk-stms', name: 'STMS' },
        { id: 'sk-sap-user', name: 'User Administration' },
        { id: 'sk-sap-jobs', name: 'Job Monitoring' },
        { id: 'sk-sap-mon', name: 'SAP System Monitoring' },
      ],
    },
    {
      id: 'cat-digital',
      title: 'Digital Technologies',
      subtitle: 'Responsive web interfaces, search visibility & growth',
      iconKey: 'digital',
      skills: [
        { id: 'sk-html', name: 'HTML5' },
        { id: 'sk-css', name: 'CSS3' },
        { id: 'sk-js', name: 'JavaScript' },
        { id: 'sk-bs', name: 'Bootstrap' },
        { id: 'sk-wp', name: 'WordPress' },
        { id: 'sk-seo', name: 'SEO' },
        { id: 'sk-perf', name: 'Performance Marketing' },
      ],
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      roleTitle: 'Senior IT Infrastructure / Systems Administrator (Editable Entry)',
      companyName: '[Add Current or Most Recent Organization]',
      period: '[Start Year – Present]',
      location: 'India',
      isPlaceholder: true,
      responsibilities: [
        'Administer Windows Server infrastructure, Active Directory, DNS, DHCP, and Group Policy across production environments.',
        'Manage VMware vSphere, ESXi hosts, vCenter clusters, and hybrid Microsoft Azure workloads including Azure Backup and Entra ID.',
        'Coordinate network troubleshooting across VLANs, routing, switching, firewalls, and VPN connectivity.',
      ],
      achievements: [
        '[Replace with verified achievement — e.g., uptime milestone, server consolidation, or migration outcome.]',
        '[Replace with verified operational improvement — e.g., backup automation or security hardening initiative.]',
      ],
    },
    {
      id: 'exp-2',
      roleTitle: 'Systems & Virtualization Administrator (Editable Entry)',
      companyName: '[Add Previous Organization]',
      period: '[Start Year – End Year]',
      location: 'India',
      isPlaceholder: true,
      responsibilities: [
        'Supported virtual machine lifecycle management across VMware and Hyper-V environments.',
        'Performed SAP Basis daily health checks, STMS transport support, background job monitoring, and user administration.',
        'Handled Tier-2/Tier-3 infrastructure incident resolution and system documentation.',
      ],
      achievements: [
        '[Replace with verified achievement from your career history.]',
        '[Replace with measurable service-level or reliability improvement.]',
      ],
    },
    {
      id: 'exp-3',
      roleTitle: 'IT Support & Network Engineer (Editable Entry)',
      companyName: '[Add Earlier Organization]',
      period: '[Start Year – End Year]',
      location: 'India',
      isPlaceholder: true,
      responsibilities: [
        'Delivered enterprise technical support covering Windows workstations, server access, and TCP/IP network connectivity.',
        'Maintained structured IT asset records, patching schedules, and user onboarding workflows.',
      ],
      achievements: [
        '[Replace with verified early-career milestone or recognition.]',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-infra',
      title: 'Enterprise Windows Server & Active Directory Blueprint',
      category: 'IT Infrastructure',
      shortDescription:
        'Sample reference architecture for multi-site Active Directory, DNS/DHCP redundancy, and standardized Group Policy governance.',
      architectureNotes:
        'Editable template designed to showcase your real-world Windows Server modernization, domain controller hardening, and automated patch compliance projects.',
      outcomes: [
        'Redundant domain controller & DNS/DHCP failover layout',
        'Tiered OU hierarchy and security-baseline Group Policy templates',
        'Documented runbooks for incident recovery and auditing',
      ],
      technologies: ['Windows Server', 'Active Directory', 'DNS', 'DHCP', 'Group Policy'],
      thumbnail: '/src/assets/images/project_it_infrastructure_1795614053074.jpg',
      isSampleTemplate: true,
    },
    {
      id: 'proj-vmware',
      title: 'VMware vSphere High-Availability Cluster Template',
      category: 'VMware',
      shortDescription:
        'Sample case-study card illustrating ESXi host consolidation, vCenter cluster governance, and resilient VM lifecycle management.',
      architectureNotes:
        'Customize this card with your actual virtualization migration, ESXi cluster upgrade, or datastore optimization deliverables.',
      outcomes: [
        'Structured ESXi host & vCenter Server management layout',
        'High Availability (HA) failover readiness and snapshot hygiene',
        'Resource allocation monitoring for predictable workload performance',
      ],
      technologies: ['VMware vSphere', 'ESXi', 'vCenter Server', 'VM Management'],
      thumbnail: '/src/assets/images/project_vmware_cloud_1795614055192.jpg',
      isSampleTemplate: true,
    },
    {
      id: 'proj-azure',
      title: 'Azure Hybrid Cloud & Backup Continuity Architecture',
      category: 'Azure Cloud',
      shortDescription:
        'Sample cloud infrastructure project template highlighting Azure VMs, Virtual Networking, Microsoft Entra ID, and Azure Backup vaults.',
      architectureNotes:
        'Replace with your real Azure deployment details, hybrid identity integration, or Microsoft 365 administration engagements.',
      outcomes: [
        'Segmented Azure Virtual Network with NSG access baselines',
        'Centralized identity management with Microsoft Entra ID',
        'Scheduled Azure Backup retention and recovery validation',
      ],
      technologies: ['Azure VMs', 'Azure Networking', 'Entra ID', 'Azure Backup', 'Microsoft 365'],
      thumbnail: '/src/assets/images/project_vmware_cloud_1795614055192.jpg',
      isSampleTemplate: true,
    },
    {
      id: 'proj-web',
      title: 'Responsive Business & Personal Brand Web Portal',
      category: 'Web Development',
      shortDescription:
        'Sample web engineering template demonstrating clean semantic HTML5, responsive grid systems, and accessible modern UI architecture.',
      architectureNotes:
        'Edit this project card to feature client websites, WordPress builds, or custom front-end portfolios you have launched.',
      outcomes: [
        'Mobile-first responsive layout verified from 360px to 1440px',
        'Semantic HTML5 structure with clean on-page SEO metadata',
        'Fast-loading visual assets and accessible navigation patterns',
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'WordPress'],
      thumbnail: '/src/assets/images/project_web_digital_1795614053913.jpg',
      isSampleTemplate: true,
    },
    {
      id: 'proj-marketing',
      title: 'Technical SEO & Performance Marketing Framework',
      category: 'Digital Marketing',
      shortDescription:
        'Sample digital growth template covering on-page SEO optimization, structured schema markup, and lead-generation campaign tracking.',
      architectureNotes:
        'Update this sample template with real campaign case studies, search ranking improvements, or conversion optimization outcomes.',
      outcomes: [
        'Comprehensive on-page SEO checklist and metadata alignment',
        'Landing page funnel clarity paired with enquiry form tracking',
        'Structured reporting for organic and paid acquisition channels',
      ],
      technologies: ['SEO', 'Performance Marketing', 'Structured Data', 'Analytics'],
      thumbnail: '/src/assets/images/project_marketing_analytics_1795614056739.jpg',
      isSampleTemplate: true,
    },
  ],
  certifications: [
    {
      id: 'cert-vmware',
      trackTitle: 'VMware Certifications',
      category: 'Virtualization',
      issuer: 'VMware / Broadcom (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Add your VMware certification title, credential ID, verification URL, and certificate image.',
    },
    {
      id: 'cert-azure',
      trackTitle: 'Microsoft Azure Certifications',
      category: 'Cloud Infrastructure',
      issuer: 'Microsoft (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Add your Microsoft Azure Administrator or Fundamentals credential details and badge image.',
    },
    {
      id: 'cert-windows',
      trackTitle: 'Windows Server Training',
      category: 'Systems Administration',
      issuer: 'Microsoft / Training Institute (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Upload your Windows Server, Active Directory, or infrastructure training certificate.',
    },
    {
      id: 'cert-sap',
      trackTitle: 'SAP Basis Training',
      category: 'Enterprise ERP',
      issuer: 'SAP / Authorized Training (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Add SAP Basis & SAP HANA fundamentals training documentation and verification link.',
    },
    {
      id: 'cert-marketing',
      trackTitle: 'Digital Marketing Certifications',
      category: 'Digital Growth & SEO',
      issuer: 'Accredited Provider (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Upload SEO, Google Analytics, or Performance Marketing certifications and credential URLs.',
    },
    {
      id: 'cert-web',
      trackTitle: 'Web Development Training',
      category: 'Frontend & CMS',
      issuer: 'Training Provider (Editable)',
      issueDate: 'Pending Entry',
      credentialId: '',
      credentialUrl: '',
      isPlaceholder: true,
      notes: 'Add your HTML5, CSS3, JavaScript, Bootstrap, or WordPress training certificates.',
    },
  ],
  contact: {
    email: 'sunilmuneshwar33@gmail.com',
    phone: '9666117032',
    location: 'India',
    linkedinUrl: 'https://www.linkedin.com',
    githubUrl: 'https://github.com',
    whatsappNumber: '+910000000000',
  },
};

export const ABOUT_STUDIO_IMAGE =
  '/src/assets/images/about_infrastructure_studio_1795614058416.jpg';
