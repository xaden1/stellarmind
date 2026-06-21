import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Inject aurora backdrop blobs into the DOM before React mounts.
// They sit behind everything (z-index: 0) and provide the colorful
// backdrop that makes glassmorphism read as premium.
const aurora = document.createElement('div');
aurora.id = 'aurora';
aurora.innerHTML = `
  <div class="aurora-blob aurora-blob-1"></div>
  <div class="aurora-blob aurora-blob-2"></div>
  <div class="aurora-blob aurora-blob-3"></div>
  <div class="aurora-blob aurora-blob-4"></div>
`;
document.body.prepend(aurora);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
