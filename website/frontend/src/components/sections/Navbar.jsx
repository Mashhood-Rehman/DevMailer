import React, { useState, useRef, useEffect } from 'react';

const Navbar = ({ user, setView, currentView }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  return (
    <header className="col-span-full sticky top-0 z-50 w-full border-b border-blue-500/20 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="text-blue-500 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">terminal</span>
          </div>
          <h2 className="text-slate-100 text-xl font-bold tracking-tight">DevMailer</h2>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setView('home')} 
            className={`text-sm font-medium transition-colors cursor-pointer ${currentView === 'home' ? 'text-blue-500' : 'text-slate-300 hover:text-blue-500'}`}
          >
            Home
          </button>
          <a className="text-slate-300 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" href="#features">Features</a>
          <a className="text-slate-300 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" href="#pricing">Pricing</a>
          <a className="text-slate-300 hover:text-blue-500 text-sm font-medium transition-colors cursor-pointer" href="#">Docs</a>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex bg-blue-600 hover:bg-blue-500 text-white h-10 px-6 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20 cursor-pointer">
            Install Extension
          </button>
          
          {/* Profile Wrapper with Ref and Hover events */}
          <div 
            ref={containerRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`size-10 rounded-full border-2 transition-all cursor-pointer overflow-hidden flex items-center justify-center bg-slate-800 ${showTooltip ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-700 hover:border-slate-500'}`}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-slate-400 text-2xl">account_circle</span>
              )}
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div 
                className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 transform animate-in fade-in slide-in-from-top-2 duration-200 z-[60]"
              >
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-600" alt="" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => { setView('dashboard'); setShowTooltip(false); }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">person</span>
                        View Profile
                      </button>
                      <a 
                        href="http://localhost:3000/auth/logout"
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-slate-400 mb-3">Sign in to sync your progress</p>
                    <a 
                      href="http://localhost:3000/auth/google?redirect=http://localhost:5173"
                      className="inline-flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="" />
                      Sign in with Google
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
