import React from 'react';

const Pricing = () => {
  const handleCheckout = async () => {
    try {
      // Assuming backend is at localhost:3000
      const response = await fetch('http://localhost:3000/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // In a real app, you'd need credentials/sessions if not using a token
      });
      
      if (response.status === 401) {
        // Redirect to login if not authenticated
        window.location.href = 'http://localhost:3000/auth/google';
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    }
  };

  return (
    <section className="col-span-full py-24 bg-slate-900/40" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 grid grid-cols-12">
          <div className="col-span-full">
            <h2 className="text-slate-100 text-3xl md:text-5xl font-black mb-4">Dev-Friendly Pricing</h2>
            <p className="text-slate-400">Pay for what you need. Support open-source excellence.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          
          {/* Hobbyist Card */}
          <div className="col-span-1 p-1 rounded-2xl bg-slate-800 border border-slate-700">
            <div className="p-8 space-y-6 flex flex-col h-full h-full">
              <h4 className="text-slate-100 font-bold text-xl italic tracking-tighter">Indie Hobbyist</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-100">$0</span>
                <span className="text-slate-500 text-sm">/ forever</span>
              </div>
              <p className="text-slate-400 text-sm">For solo devs and weekend warriors hacking on personal projects.</p>
              <div className="flex-grow space-y-4 border-t border-slate-700 pt-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> 10 Emails per day
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Unlimited Previews
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> MJML Support
                </div>
              </div>
              <button className="w-full h-12 rounded-xl border border-slate-600 font-bold text-slate-300 hover:bg-slate-700 transition-colors">
                Start Free
              </button>
            </div>
          </div>

          {/* Pro Card (Highlighted) */}
          <div className="col-span-1 p-1 rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-indigo-600 relative">
            <div className="p-8 space-y-6 bg-background-dark rounded-[0.9rem] flex flex-col h-full h-full">
              <div className="flex justify-between items-start">
                <h4 className="text-primary font-bold text-xl italic tracking-tighter">Pro Developer</h4>
                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Most Popular
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-100">$10</span>
                <span className="text-slate-500 text-sm">/ monthly</span>
              </div>
              <p className="text-slate-400 text-sm">For professional developers who need serious testing capabilities.</p>
              <div className="flex-grow space-y-4 border-t border-slate-700 pt-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> 50 Emails per day
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Everything in Hobbyist
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Infinite Mock Data Sets
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Cloud Sync Settings
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-white transition-colors shadow-lg shadow-primary/30"
              >
                Go Pro
              </button>
            </div>
          </div>

          {/* Enterprise Card */}
          <div className="col-span-1 p-1 rounded-2xl bg-slate-800 border border-slate-700">
            <div className="p-8 space-y-6 flex flex-col h-full h-full">
              <h4 className="text-slate-100 font-bold text-xl italic tracking-tighter">Enterprise Forge</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-100">Custom</span>
              </div>
              <p className="text-slate-400 text-sm">For agencies and large scale engineering organizations.</p>
              <div className="flex-grow space-y-4 border-t border-slate-700 pt-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Team License Management
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> Custom SMTP Endpoints
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="material-symbols-outlined text-primary text-sm">check</span> 24/7 Dedicated Manager
                </div>
              </div>
              <button className="w-full h-12 rounded-xl border border-slate-600 font-bold text-slate-300 hover:bg-slate-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;

