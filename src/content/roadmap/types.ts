// src/content/roadmap/types.ts

export interface PublicationLinks {
  substack?: string;
  lesswrong?: string;
  arxiv?: string;
  youtube?: string;
  github?: string;
  googledocs?: string;
}

export interface Publication {
  id: string;
  title: string;
  type: string;
  image: string | null;
  primaryLink: string;
  links: PublicationLinks;
}

export interface Researcher {
  fullName: string;
  lastName: string;
  image: string;
  bio: string;
}

export interface PhaseDetails {
  tagline: string;
  description: string;
}

// New types for detailed subareas
export type WorkItemStatus = 'published' | 'in-review' | 'active' | 'draft' | 'concept' | 'not-started';

export interface WorkItem {
  title: string;
  status: WorkItemStatus;
  description: string;
  link?: string | null;
}

export interface Subarea {
  id: string;
  number: string; // e.g. "1.1", "1.2"
  title: string;
  summary: string;
  status: WorkItemStatus;
  goal: string;
  why: string;
  work: WorkItem[];
  missing: string[];
  collaboration: string[];
}

export interface RoadmapPhase {
  id: number;
  name: string;
  researcher: Researcher;
  details: PhaseDetails;
  subareasOverview?: string; // Optional narrative connecting the subareas
  publications: Publication[];
  subareas?: Subarea[]; // Optional detailed subareas
}
