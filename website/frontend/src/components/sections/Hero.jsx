import React from 'react';

const Hero = () => {
  return (
    <section className="col-span-full relative overflow-hidden py-20 lg:py-32 bg-background-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(127,13,242,0.15),transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Left Column: Text and Actions */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            v2.4.0 Now Live
          </div>

          <h1 className="text-slate-100 text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
            Emails, <span className="text-primary italic">Decoded</span> inside VS Code.
          </h1>

          <p className="text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed">
            Stop context-switching. Preview, test, and debug your transactional emails without ever leaving your editor. Built for the modern developer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary h-14 px-8 text-lg shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">shopping_cart</span>
              Install from Marketplace
            </button>
            <button className="btn-outline h-14 px-8 text-lg glass-panel">
              View Documentation
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-8 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">person</span>
                </div>
              ))}
            </div>
            <span>Trusted by 50k+ developers</span>
          </div>
        </div>

        {/* Right Column: Preview Image */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/50"></div>
                <div className="size-3 rounded-full bg-yellow-500/50"></div>
                <div className="size-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono ml-4 uppercase tracking-tighter">
                devmailer_preview.js
              </div>
            </div>
            <div className="aspect-video bg-slate-950 flex items-center justify-center relative">
              <img
                className="w-full h-full object-cover opacity-80"
                alt="DevMailer Preview"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXW7usCC2PNGfe7awqux9deSWV95PupW48hmkcxMmcUweh7vAn3cbpAgsurcxLECKjFQTnhojH6beibSk4GZrsvYijHdVpctf8FzCD4dQX-afqHDFEL60itRbxdJpxG3v7ZnVLCI_aU6-uZvfAbFEYUkWOjzytMl0JbL2zx8s5MHkb3vS5tjU5m0riBV-AyH5B_y-LhfdIE_smd1-uDYyfbxMCvSDjd7yGyz6H-rdL4SXlcDjO4Mro9te8BohM3ITGm56eEwogeLQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel border border-primary/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  <div className="text-xs font-mono text-slate-300">Real-time MJML Rendering Active...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
