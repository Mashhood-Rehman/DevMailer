import React from 'react';

const About = () => {
  return (
    <section className="col-span-full py-24 border-t border-slate-800 bg-background-dark/50" id="about">
      <div className="max-w-4xl mx-auto px-4 text-center grid grid-cols-12 gap-y-8">
        <h2 className="col-span-full text-white text-3xl md:text-5xl font-black mb-4">Built by Devs, for Devs</h2>
        
        <div className="col-span-full space-y-6 text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
          <p>
            We were tired of the "email struggle." The constant context switching, the broken CSS previews, and the "did it actually send?" anxiety. Every time we had to test a password reset or an onboarding flow, we had to leave our IDE, find a temp mail site, and deal with intrusive ads.
          </p>
          <p>
            We built **DevMailer** to be the tool we wanted to use every day. It's not just an extension; it's a productivity hack that keeps you in the flow. By bringing your temporary inbox directly into VS Code, we've turned a 2-minute distraction into a 5-second task.
          </p>
        </div>
        
        <div className="col-span-full flex flex-col md:flex-row justify-center items-center gap-6 pt-8">
          <div className="text-center">
            <div className="text-blue-500 font-bold text-2xl">50,000+</div>
            <div className="text-slate-500 text-sm">Emails Caught</div>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
          <div className="text-center">
            <div className="text-blue-500 font-bold text-2xl">100%</div>
            <div className="text-slate-500 text-sm">Open Source</div>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
          <div className="text-center">
            <div className="text-blue-500 font-bold text-2xl">0</div>
            <div className="text-slate-500 text-sm">Context Switches</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
