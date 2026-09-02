export type ThemeMode = 'dark' | 'light';

export interface ServiceItem {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: string;
  keyDeliverables: string[];
  timeline: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  year: string;
  link: string;
  tags: string[];
  tall?: boolean;
}

export interface PricingPackage {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ProcessStepItem {
  num: string;
  title: string;
  desc: string;
}

export interface MetricItem {
  num: number;
  label: string;
}

export interface SiteHeroConfig {
  studioBadge: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface SiteContactInfo {
  email: string;
  phone: string;
  address: string;
  location: string;
}

export interface SiteManifestoConfig {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
}

export interface SiteContent {
  hero: SiteHeroConfig;
  contactInfo: SiteContactInfo;
  manifesto: SiteManifestoConfig;
  metrics: MetricItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  pricing: PricingPackage[];
  process: ProcessStepItem[];
  testimonials: Testimonial[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
  status?: 'unread' | 'read' | 'replied' | 'archived';
  adminNotes?: string;
}
