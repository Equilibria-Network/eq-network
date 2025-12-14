// src/content/roadmap/types.ts

export interface PublicationLinks {
  substack?: string;
  lesswrong?: string;
  arxiv?: string;
  youtube?: string;
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

export interface RoadmapPhase {
  id: number;
  name: string;
  researcher: Researcher;
  details: PhaseDetails;
  publications: Publication[];
}
