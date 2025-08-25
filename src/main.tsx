import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  //! Uncomment for strict mode
  //! webcontainer don't support strict mode 
  // <StrictMode> 
    <App />
  // </StrictMode>
);
