import React, { useState } from 'react';

const Dashboard = ({ user }) => {
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="size-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700">
          <span className="material-symbols-outlined text-4xl text-slate-500">lock</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 max-w-sm mb-8">Please sign in from the navbar to view your account details and API credentials.</p>
        <a 
          href={`http://localhost:3000/auth/google?redirect=${encodeURIComponent(window.location.origin)}`} 
          className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  const limit = user.tier === 'PREMIUM' ? 50 : 10;
  const usagePercent = Math.min((user.emailsSentToday / limit) * 100, 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="col-span-full py-12 bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-white mb-2">Account Settings</h2>
          <p className="text-slate-400">Manage your subscription, view usage, and access API keys.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src={user.avatar || 'https://via.placeholder.com/150'} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-3xl border-4 border-blue-500/20 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white size-8 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm font-bold">verified</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
              <p className="text-slate-400 text-xs mb-6 truncate w-full px-2">{user.email}</p>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.tier === 'PREMIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                {user.tier} Plan
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support</h4>
              <button className="flex items-center gap-3 w-full text-left text-sm text-slate-300 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">help</span> Help Center
              </button>
              <button className="flex items-center gap-3 w-full text-left text-sm text-slate-300 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">mail</span> Contact Support
              </button>
            </div>
          </div>

          {/* Right Column: Usage & API */}
          <div className="lg:col-span-2 space-y-8">
            {/* Usage Card */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Daily Usage</h3>
                <span className="text-slate-500 text-xs font-bold bg-slate-900 px-3 py-1 rounded-lg">RESTORED 00:00 UTC</span>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-400 text-sm font-medium">Emails Sent Today</span>
                  <span className="text-white font-bold text-2xl">{user.emailsSentToday} <span className="text-slate-500 text-lg">/ {limit}</span></span>
                </div>
                
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700/50">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${user.emailsSentToday >= limit ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]'}`}
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {user.tier !== 'PREMIUM' ? (
                    <button 
                      onClick={() => setCopied('redirecting')}
                      className="grow bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                      Upgrade for higher limits
                    </button>
                  ) : (
                    <div className="grow bg-slate-700/30 text-slate-300 py-3.5 rounded-2xl font-bold text-center border border-slate-700">
                      Premium Active 💎
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* API Key Card */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 text-slate-700 select-none group-hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-6xl opacity-20">key</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Personal API Key</h3>
              <p className="text-slate-400 text-sm mb-6">Use this key to authenticate your DevMailer VS Code extension or local CLI.</p>
              
              <div className="relative">
                <div className="bg-slate-900 px-4 py-4 rounded-2xl border border-slate-700 font-mono text-sm text-blue-400 flex items-center justify-between group">
                  <span className="truncate pr-4">{user.id}</span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-slate-600 cursor-pointer"
                  >
                    {copied === true ? (
                      <><span className="material-symbols-outlined text-sm text-green-400">check</span> COPIED</>
                    ) : (
                      <><span className="material-symbols-outlined text-sm">content_copy</span> COPY</>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-red-400/60 mt-4 font-medium uppercase tracking-widest">
                Warning: Never share your API key with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
