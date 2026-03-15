import React from 'react';
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Workflow from './components/sections/Workflow';
import Features from './components/sections/Features';
import Pricing from './components/sections/Pricing';
import Integrations from './components/sections/Integrations';
import About from './components/sections/About';
import Footer from './components/sections/Footer';

function App() {
  return (
    <MainLayout>
      <Navbar />
      <Hero />
      <Workflow />
      <Features />
      <Pricing />
      <Integrations />
      <About />
      <Footer />
    </MainLayout>
  );
}

export default App;
