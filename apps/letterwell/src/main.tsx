import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@zyankov/design-system/tokens.css'
import '@zyankov/design-system/fonts.css'
import '@zyankov/design-system/shell.css'
import './index.css'
import App from './App.tsx'
import { languageFromPath } from './seo'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App language={languageFromPath(window.location.pathname)} />
  </StrictMode>,
)
