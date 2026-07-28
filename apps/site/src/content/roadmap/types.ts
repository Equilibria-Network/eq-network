// src/content/roadmap/types.ts

export interface PublicationLinks {
  substack?: string;
  lesswrong?: string;
  arxiv?: string;
  youtube?: string;
  [key: string]: string | undefined; // Add index signature for compatibility
}

export interface Publication {
  id: string;
  title: string;
  status: 'published' | 'ongoing' | 'draft' | 'active' | 'concept';
  medium: string; // 'Blog Post', 'Research Paper', 'Report', etc.
  description: string;
  image: string | null;
  primaryLink: string | null;
  links?: PublicationLinks;
}

export interface ResearchArea {
  id: string;
  name: string;
  description: string;
  publications: Publication[];
}

export interface Researcher {
  fullName: string;
  lastName: string;
  image: string;
  bio: string;
}

export interface PhaseDetails {
  tagline: string;
  description: string; // Can contain \n for multiple paragraphs
}

export interface RoadmapPhase {
  id: number;
  name: string;
  researcher: Researcher;
  details: PhaseDetails;
  researchAreas?: ResearchArea[]; // Make optional with ?
  publications?: Publication[]; // Make optional with ?
}
