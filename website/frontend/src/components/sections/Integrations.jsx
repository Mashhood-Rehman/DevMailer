import React from 'react';

const Integrations = () => {
  return (
    <section className="col-span-full py-24 bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Text and Icons */}
        <div className="col-span-1 lg:col-span-6 space-y-8">
          <h2 className="text-slate-100 text-3xl md:text-5xl font-black mb-6">Built to fit your stack.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed max-w-xl">
            DevMailer integrates directly with the services you already use. Configurable in seconds via standard VS Code settings.
          </p>
          
          <div className="grid grid-cols-3 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl">send</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">SendGrid</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl">mail</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Mailchimp</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl">cloud</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">AWS SES</span>
            </div>
          </div>
        </div>

        {/* Right Column: Code Preview */}
        <div className="col-span-1 lg:col-span-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500">settings.json</span>
              <div className="flex gap-1.5">
                <div className="size-2 rounded-full bg-slate-800"></div>
                <div className="size-2 rounded-full bg-slate-800"></div>
                <div className="size-2 rounded-full bg-slate-800"></div>
              </div>
            </div>
            <pre className="text-sm font-mono leading-relaxed overflow-x-auto">
              <span className="text-slate-500">{'{'}</span>
              <br />
              {'  '}
              <span className="text-indigo-400">"devmailer.port"</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="text-amber-400">1025</span>
              <span className="text-slate-500">,</span>
              <br />
              {'  '}
              <span className="text-indigo-400">"devmailer.autoOpen"</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="text-amber-400">true</span>
              <span className="text-slate-500">,</span>
              <br />
              {'  '}
              <span className="text-indigo-400">"devmailer.mjml.minify"</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="text-amber-400">false</span>
              <span className="text-slate-500">,</span>
              <br />
              {'  '}
              <span className="text-indigo-400">"devmailer.theme"</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="text-amber-400">"cyber-night"</span>
              <span className="text-slate-500">,</span>
              <br />
              {'  '}
              <span className="text-indigo-400">"devmailer.data"</span>
              <span className="text-slate-500">:</span>{' '}
              <span className="text-amber-400">"./mocks/user.json"</span>
              <br />
              <span className="text-slate-500">{'}'}</span>
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Integrations;
