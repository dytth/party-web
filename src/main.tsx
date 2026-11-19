import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { getSavedLanguage } from './utils/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <React.Suspense fallback={
      <main className="grid min-h-screen place-items-center text-slate-100" role="status">
        {getSavedLanguage() === 'vi' ? 'Đang tải trò chơi…' : 'Loading game…'}
      </main>
    }>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
