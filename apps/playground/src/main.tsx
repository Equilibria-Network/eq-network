import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './embed';

createRoot(document.getElementById('playground-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
