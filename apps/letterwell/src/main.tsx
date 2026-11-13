import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@zyankov/design-system/tokens.css'
import '@zyankov/design-system/fonts.css'
import '@zyankov/design-system/shell.css'
import './index.css'
import App from './App.tsx'
import WordleSolver from './WordleSolver.tsx'
import CrosswordSolver from './CrosswordSolver.tsx'
import BeeSolver from './BeeSolver.tsx'
import DailyWord from './DailyWord.tsx'
import DailyHints from './DailyHints.tsx'
import AnagramGame from './AnagramGame.tsx'
import { languageFromPath, pageFromPath } from './seo'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    {{
      wordle: <WordleSolver language={languageFromPath(window.location.pathname)} />,
      crossword: <CrosswordSolver language={languageFromPath(window.location.pathname)} />,
      daily: <DailyWord language={languageFromPath(window.location.pathname)} />,
      hints: <DailyHints language={languageFromPath(window.location.pathname)} />,
      anagram: <AnagramGame language={languageFromPath(window.location.pathname)} />,
      bee: <BeeSolver language={languageFromPath(window.location.pathname)} />,
      finder: <App language={languageFromPath(window.location.pathname)} />,
    }[pageFromPath(window.location.pathname)]}
  </StrictMode>,
)
