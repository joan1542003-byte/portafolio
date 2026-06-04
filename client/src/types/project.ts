export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  backgroundColor: string;
  description: string;
  tags: string[];
  gallery: string[];
  heroTitle?: string;
  order: number;
  featured: boolean;
  isNew: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    titleWords: string[];
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  about: {
    title: string;
    lead: string;
    body: string;
    highlights: string[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    linkedin: string;
    location: string;
  };
  toolsTitle: string;
  toolsSubtitle: string;
}
