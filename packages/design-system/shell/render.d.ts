export interface Project {
  slug: string
  name: string
  tagline: string
  tagline_bg?: string
  symbol: string
  category: string
  eyebrow: string
  description: string
  description_bg?: string
  href: string
  image: string
  imageAlt: string
  linkLabel: string
  category_bg?: string
  eyebrow_bg?: string
  linkLabel_bg?: string
  href_bg?: string
  /** Site-bar section label ("Word games") and its Bulgarian version and link. */
  nav?: string
  nav_bg?: string
  nav_href_bg?: string
}
export declare const projects: Project[]
export declare const config: { adsense?: { client?: string }; analytics?: Record<string, string> }
export declare const analyticsEnabled: boolean
export declare function renderHead(options?: { ads?: boolean }): string
export declare function renderPrivacyAnalytics(): string
export declare function renderBar(options?: { project?: string; main?: string; lang?: string; alternates?: Record<string, string> }): string
export declare function renderFooter(options?: { project?: string; lang?: string; year?: number }): string
