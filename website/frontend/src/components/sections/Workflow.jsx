import React from 'react';

const Workflow = () => {
  return (
    <section className="col-span-full py-24 bg-background-dark relative overflow-hidden" id="workflow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-12 mb-16 px-4">
          <div className="col-span-full text-center">
            <h2 className="text-slate-100 text-3xl md:text-5xl font-black mb-4">The 'No-Browser' Workflow</h2>
            <p className="text-slate-400 max-w-2xl mx-auto italic">Eliminate the "Code, Save, Alt-Tab, Refresh, Repeat" fatigue.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative px-4">
          
          {/* Old Way */}
          <div className="flex flex-col gap-6 p-8 rounded-2xl border border-slate-800 bg-slate-900/50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-400 font-bold text-xl uppercase tracking-widest">The Old Way</h3>
              <span className="material-symbols-outlined text-red-500">cancel</span>
            </div>
            <div className="aspect-video rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt="Messy workflow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_PriUlPDWGVmLW08LrJ-409p25U9ZKmKzKd7dk7Y4xy3ljCTb3au8rp9vtX_ZMDQM7_kDPwCbU-c1v5cz-V-wc7Mv97eL4xFTZhX-pPGjjtEbsaDXmg2IQ2l4mqp-swAOqV5CQSjOUoBiSGlvg-ttxU1ttF_-cuMeg2di2T6OvsmZ4wlkTI9B25vlh7nhCko4dlYqQT-sEnTMUjmSnaKMDrgaMXuGPERh7ck5g4Flj6offG39eOe4sRvwBzeZYquvuY9-okFX4sc" 
              />
            </div>
            <ul className="space-y-3 text-slate-500 text-sm italic">
              <li>• Constant context switching between editor and Chrome</li>
              <li>• Manual cache clearing and forced refreshes</li>
              <li>• Broken mobile layouts only visible after deployment</li>
            </ul>
          </div>

          {/* DevMailer Way */}
          <div className="flex flex-col gap-6 p-8 rounded-2xl border-2 border-primary bg-primary/5 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Recommended
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-primary font-bold text-xl uppercase tracking-widest">DevMailer Way</h3>
              <span className="material-symbols-outlined text-green-500">check_circle</span>
            </div>
            <div className="aspect-video rounded-xl bg-slate-800 flex items-center justify-center border border-primary/30 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt="Clean workflow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkHb9wbxmwuZ3hZg_Ad0L7sNnUBQWh9Z5ZUWOJezawYiKbj6-XZgKFjpwulCMEYSpVlzQiSVQPHcx98U9xlyOKvreaYhG1qOoxWHEZ8WQ_aZ7XMdeKFqEn7DXqM24HYQlHp1o3ryDidct6oBsz4Ywdcu24u4hbmdCUP4go0jemSZJ6Gc2jt8FxIQAEU4vY-tFHB-Ck3GqrObJu3HRL3cKbYQnXdJK3Wmai89fdNWos7ju-83p5RmHwiDAlq-jFZWbZ9pdZFD8ek14" 
              />
            </div>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">bolt</span> Instant Hot Reload on keystroke
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">bolt</span> Side-by-side preview with mobile toggle
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">bolt</span> Full header and payload inspection
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Workflow;
