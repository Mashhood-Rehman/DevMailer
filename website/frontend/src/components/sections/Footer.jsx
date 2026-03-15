import React from 'react';

const Footer = () => {
  return (
    <footer className="col-span-full bg-background-dark py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-y-8 items-center">
        
        {/* Brand */}
        <div className="col-span-12 md:col-span-4 flex items-center justify-center md:justify-start gap-3">
          <span className="material-symbols-outlined text-primary">terminal</span>
          <span className="text-slate-100 font-bold">DevMailer</span>
        </div>

        {/* Links */}
        <nav className="col-span-12 md:col-span-4 flex justify-center gap-10 text-sm text-slate-500 font-medium">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">GitHub</a>
          <a className="hover:text-primary transition-colors" href="#">Changelog</a>
        </nav>

        {/* Copyright */}
        <div className="col-span-12 md:col-span-4 flex justify-center md:justify-end text-slate-600 text-xs text-center md:text-right">
          © {new Date().getFullYear()} DevMailer Inc. Built with passion and MJML.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
