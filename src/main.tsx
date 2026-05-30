import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// AI / scraper fallback: index.html ships with a #static-fallback div
// containing the full docs index as real HTML (NOT noscript — that gets
// stripped by every HTML-to-markdown converter). When this script runs,
// it means JS is available — remove the fallback so the React app owns the page.
document.getElementById('static-fallback')?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
