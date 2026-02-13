import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <Flame className="w-20 h-20 text-neon mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-6">
          <span className="gradient-text">Welcome to So Fire Fitness!</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your journey starts now. Get ready to transform your body and mind with our AI-powered fitness plans, supportive community, and exciting rewards.
        </p>
        <p className="text-gray-300 mb-12">
          Check your email for login details and next steps.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;