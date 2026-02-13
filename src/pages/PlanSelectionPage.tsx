import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const PlanSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-center mb-12">
        <span className="gradient-text">Choose Your Plan</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Freemium Plan */}
        <div className="bg-gray-dark p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Freemium</h2>
          <p className="text-gray-300 mb-6">Perfect for getting started</p>
          <p className="text-3xl font-bold mb-6">$0<span className="text-lg">/month</span></p>
          <ul className="space-y-4 mb-8">
            <Feature text="Basic workout plans" />
            <Feature text="Community access" />
            <Feature text="Progress tracking" />
          </ul>
          <button 
            onClick={() => navigate('/welcome')}
            className="w-full btn-primary bg-opacity-80 hover:bg-opacity-100"
          >
            Start Free
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gray-dark p-8 rounded-lg border border-neon">
          <h2 className="text-2xl font-bold mb-4">Premium</h2>
          <p className="text-gray-300 mb-6">Full access to all features</p>
          <p className="text-3xl font-bold mb-6">$24.99<span className="text-lg">/month</span></p>
          <ul className="space-y-4 mb-8">
            <Feature text="AI-powered custom plans" />
            <Feature text="Premium workout library" />
            <Feature text="Nutrition coaching" />
            <Feature text="Priority support" />
            <Feature text="Exclusive rewards" />
          </ul>
          <button 
            onClick={() => navigate('/welcome')}
            className="w-full btn-primary"
          >
            Choose Premium
          </button>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-center space-x-2">
    <Check className="w-5 h-5 text-neon" />
    <span className="text-gray-300">{text}</span>
  </li>
);

export default PlanSelectionPage;