import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@zyankov/design-system/tokens.css'
import '@zyankov/design-system/fonts.css'
import '@zyankov/design-system/shell.css'
import './index.css'
import App from './App.tsx'
import WordleSolver from './WordleSolver.tsx'
import { languageFromPath, pageFromPath } from './seo'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    {pageFromPath(window.location.pathname) === 'wordle'
      ? <WordleSolver language={languageFromPath(window.location.pathname)} />
      : <App language={languageFromPath(window.location.pathname)} />}
  </StrictMode>,
)
