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
}
