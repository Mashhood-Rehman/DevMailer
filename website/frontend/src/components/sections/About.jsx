import React from 'react';

const About = () => {
  return (
    <section className="col-span-full py-24 border-t border-slate-800 bg-background-dark/50" id="about">
      <div className="max-w-4xl mx-auto px-4 text-center grid grid-cols-12 gap-y-8">
        <h2 className="col-span-full text-slate-100 text-3xl md:text-5xl font-black">Built by Devs, for Devs</h2>
        
        <p className="col-span-full text-slate-300 text-lg leading-relaxed px-4 md:px-0">
          We were tired of the "email struggle." The constant switching, the broken CSS, the "did it send?" anxiety. 
          We built DevMailer to be the tool we wanted to use every day. It's not just an extension; it's a productivity 
          hack for the hardest part of transactional development.
        </p>
        
        <div className="col-span-full flex justify-center pt-4">
          <button className="btn-primary h-12 px-10 transition-all">
            Read Our Manifesto
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
