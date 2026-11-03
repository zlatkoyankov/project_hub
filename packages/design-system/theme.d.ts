export type Theme = 'light' | 'dark'
export declare const THEME_KEY: 'zyankov-theme'
export declare const THEME_EVENT: 'zyankov-theme-change'
export declare function getTheme(): Theme
export declare function setTheme(theme: Theme): void
export declare function toggleTheme(): void
export declare function subscribeTheme(listener: (theme: Theme) => void): () => void
