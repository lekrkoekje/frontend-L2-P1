import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Eerst Bootstrap en daarna onze eigen CSS, zo gaan onze eigen regels voor.
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import App from './App.jsx';

// Hier start de website, BrowserRouter zorgt dat we verschillende pagina's met eigen urls kunnen hebben.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
