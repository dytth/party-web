import React from 'react';

interface FooterProps {
  label?: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ label, className = '' }) => {
  return (
    <footer className={`text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 flex-wrap ${className}`}>
      <span className="font-semibold tracking-wide">{label || 'Circus Cyber Party'}</span>
      <span>•</span>
      <a
        href="https://dytth.is-a.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-75 hover:opacity-100 hover:text-cyan-300 transition lowercase underline underline-offset-2 cursor-pointer"
      >
        built by dytth_young
      </a>
    </footer>
  );
};
