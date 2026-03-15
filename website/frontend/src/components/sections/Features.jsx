import React from 'react';

const featuresData = [
  {
    icon: 'code',
    title: 'MJML First-Class Support',
    description: 'Full syntax highlighting, linting, and instant transpilation for MJML files. No external CLI needed.'
  },
  {
    icon: 'database',
    title: 'Dynamic Data Injection',
    description: 'Mock your Handlebars, Liquid, or EJS variables with a simple local JSON file. Preview logic real-time.'
  },
  {
    icon: 'info',
    title: 'Header Inspection',
    description: "Verify MIME types, Subject lines, and 'From' headers exactly as they will appear in the recipient inbox."
  },
  {
    icon: 'devices',
    title: 'Responsive Multi-View',
    description: 'See Desktop, Mobile, and Tablet previews simultaneously. Support for Dark Mode email overrides.'
  },
  {
    icon: 'cloud_sync',
    title: 'SMTP Sink Integration',
    description: 'Built-in SMTP server to catch emails from your local app and display them instantly in VS Code.'
  },
  {
    icon: 'share',
    title: 'Cloud Share Links',
    description: 'Generate a temporary public URL to share your current preview with clients or designers for feedback.'
  }
];

const Features = () => {
  return (
    <section className="col-span-full py-24 bg-background-dark/30" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Grid */}
        <div className="grid grid-cols-12 md:items-end justify-between mb-12 gap-6">
          <div className="col-span-12 md:col-span-8 lg:col-span-6">
            <h2 className="text-slate-100 text-3xl md:text-5xl font-black mb-4">Beyond Just Previews</h2>
            <p className="text-slate-400">Everything you need to ship bulletproof emails faster than ever.</p>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-6 flex md:justify-end">
            <button className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
              Explore all 40+ features <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <div key={index} className="glass-panel p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="size-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
