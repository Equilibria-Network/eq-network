export interface PageSeo {
  /** Search/social title. This may be more descriptive than the visible page heading. */
  title: string;
  /** Search result and social-card summary. */
  description: string;
  canonicalPath?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export interface PageHeaderContent {
  eyebrow: string;
  title: string;
  /** A concise subtitle beneath the visible page title. */
  subtitle?: string;
  /** One or two sentences that summarize the page's argument or takeaway. */
  summary?: string;
  prompt?: string;
}
