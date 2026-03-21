import React, { useState, useEffect } from 'react';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import Pricing from './components/sections/Pricing';
import About from './components/sections/About';
import Footer from './components/sections/Footer';
import Dashboard from './components/sections/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user.user);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      <Navbar user={user} setView={setCurrentView} currentView={currentView} />
      
      {currentView === 'home' ? (
        <main className="grid grid-cols-12 gap-y-24">
          <Hero />
          <Features />
          <Pricing />
          <About />
        </main>
      ) : (
        <main className="pt-20">
          <Dashboard user={user} />
        </main>
      )}
      
      <Footer />
    </div>
  );
}

export default App;
