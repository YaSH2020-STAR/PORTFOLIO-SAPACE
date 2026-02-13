import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { features } from '../constants/features';
import SignUpModal from '../components/SignUpModal';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIgniteClick = () => {
    if (user) {
      // If user is signed in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // If user is not signed in, show signup modal
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
            alt="Fitness Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="section-title mb-6">
            <span className="gradient-text">TRANSFORM YOUR BODY</span>
            <br />
            <span className="text-white">TRANSFORM YOUR LIFE</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            AI-powered fitness plans, real community support, and rewards that keep you motivated.
          </p>
          <button 
            className="btn-primary animate-pulse-fast"
            onClick={handleIgniteClick}
          >
            {user ? 'Go to Dashboard' : 'Ignite Your Life'}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-16">
            <span className="gradient-text">WHY CHOOSE <br></br> <span>SO FIRE</span> FITNESS?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-dark p-6 rounded-lg transform hover:scale-105 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-neon mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-dark to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-8">
            I Am <span className="text-neon animate-pulse-fast">So Fire</span>
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join premium now and get a free T-shirt in your target size!
          </p>
          <button 
            className="btn-primary animate-pulse-fast"
            onClick={handleIgniteClick}
          >
            {user ? 'Go to Dashboard' : 'Join Now'}
          </button>
        </div>
      </section>

      <SignUpModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default HomePage;