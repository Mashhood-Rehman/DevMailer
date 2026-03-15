import React from 'react';

const Navbar = () => {
  return (
    <header className="col-span-full sticky top-0 z-50 w-full border-b border-primary/20 bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 items-center h-16">
        {/* Logo and Brand */}
        <div className="col-span-6 md:col-span-3 flex items-center gap-3">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl">terminal</span>
          </div>
          <h2 className="text-slate-100 text-xl font-bold tracking-tight">DevMailer</h2>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex col-span-6 justify-center items-center gap-8">
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#features">Features</a>
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#workflow">Workflow</a>
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#pricing">Pricing</a>
          <a className="text-slate-300 hover:text-primary text-sm font-medium transition-colors" href="#">Docs</a>
        </nav>

        {/* Action Buttons */}
        <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-4">
          <button className="hidden sm:flex btn-primary h-10 px-6 text-sm">
            Install Extension
          </button>
          <div className="size-10 rounded-full border border-primary/30 overflow-hidden bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
