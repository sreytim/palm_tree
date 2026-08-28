export type Category =
  | "Palm Leaf Preparation"
  | "Weaving Techniques"
  | "House Construction"
  | "Attachment Techniques"
  | "Maintenance & Repair"
  | "Personal Stories"
  | "Traditional Houses";

export interface ArchiveStep {
  title: string;
  description: string;
}

export interface ArchiveItem {
  id: string;
  slug: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  imageAlt: string;
  contributor: string;
  location: string;
  date: string;
  introduction: string;
  steps: ArchiveStep[];
  tips: string[];
  contributorStory: string;
  relatedImages: { src: string; alt: string }[];
  featured?: boolean;
  isSample?: boolean;
}

export interface Story {
  id: string;
  slug: string;
  name: string;
  generation: string;
  location: string;
  quote: string;
  title: string;
  portrait: string;
  excerpt: string;
  fullStory: string[];
  isSample?: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  contributor: string;
  location?: string;
  category: string;
}

export interface TechniqueStep {
  number: string;
  title: string;
  slug: string;
  image: string;
  imageAlt: string;
  description: string;
  tip: string;
}
