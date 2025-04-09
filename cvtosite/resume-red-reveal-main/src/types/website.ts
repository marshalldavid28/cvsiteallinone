
export interface CustomSectionItem {
  name: string;
  description?: string;
  date?: string;
  url?: string;
}

export interface CustomSection {
  title: string;
  items: CustomSectionItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Contact {
  email?: string;
  phone?: string;
  location?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  details?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface WebsiteData {
  id?: string;
  name: string;
  title: string;
  bio: string;
  headline: string;
  contact?: Contact;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  languages?: string[];
  socialLinks?: SocialLink[];
  customSections?: CustomSection[];
  designStyle?: string;
  colorScheme?: string[];
  fontPairings?: {
    heading?: string;
    body?: string;
  };
  optimizationNotes?: string;
  displayPicture?: string; // New field for profile picture URL
}
