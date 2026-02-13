import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PaymentService from '../services/PaymentService';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanSelection = async (plan: 'freemium' | 'premium') => {
    if (!user) {
      // Not logged in - redirect to signup with plan preference
      navigate('/signup', { state: { selectedPlan: plan } });
      return;
    }

    if (plan === 'premium') {
      try {
        // User is logged in - redirect directly to Stripe checkout
        await PaymentService.redirectToCheckout();
      } catch (error) {
        console.error('Failed to start checkout:', error);
        // Show error or redirect to dashboard
        navigate('/dashboard', { state: { error: 'Failed to start checkout process' } });
      }
    } else {
      // For freemium, just redirect to dashboard
      navigate('/dashboard');
    }
  };

  const handleContactSales = () => {
    navigate('/contact?sales=true');
  };

  return (
    <div className="pt-16">
      {/* Overview Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="section-title mb-8">
            <span className="gradient-text">CHOOSE YOUR PATH</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Start with our Freemium plan or unlock full potential with Premium access.
          </p>
          <p className="text-gray-400">
            Then make a bet on yourself with an optional $20 signup fee, <br></br>fully refundable upon reaching your first major goal!
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4 bg-gray-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Freemium Plan */}
            <div className="bg-black p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Freemium</h2>
              <p className="text-gray-300 mb-6">Perfect for getting started</p>
              <p className="text-3xl font-bold mb-6">$0<span className="text-lg">/month</span></p>
              <ul className="space-y-4 mb-8">
                <Feature text="Basic workout plans" />
                <Feature text="Limited AI suggestions" />
                <Feature text="Basic progress tracking" />
                <Feature text="Community access" />
              </ul>
              <button 
                onClick={() => handlePlanSelection('freemium')}
                className="w-full btn-primary bg-opacity-80 hover:bg-opacity-100"
              >
                Start Free
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-black p-8 rounded-lg border-2 border-neon transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon text-black px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h2 className="text-2xl font-bold mb-4">Premium</h2>
              <p className="text-gray-300 mb-6">Full access to all features</p>
              <p className="text-3xl font-bold mb-6">$24.99<span className="text-lg">/month</span></p>
              <ul className="space-y-4 mb-8">
                <Feature text="Advanced AI-powered plans" />
                <Feature text="Unlimited meal & workout tracking" />
                <Feature text="Premium workout library" />
                <Feature text="Nutrition coaching" />
                <Feature text="Priority support" />
                <Feature text="Exclusive rewards" />
                <Feature text="Live class access" />
              </ul>
              <button 
                onClick={() => handlePlanSelection('premium')}
                className="w-full btn-primary"
              >
                {user ? 'Upgrade Now' : 'Choose Premium'}
              </button>
            </div>

            {/* Corporate Plan */}
            <div className="bg-black p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Corporate</h2>
              <p className="text-gray-300 mb-6">For teams and businesses</p>
              <p className="text-3xl font-bold mb-6">Custom</p>
              <ul className="space-y-4 mb-8">
                <Feature text="Group challenges" />
                <Feature text="Corporate wellness dashboard" />
                <Feature text="Team analytics" />
                <Feature text="Custom branding" />
                <Feature text="Dedicated support" />
                <Feature text="Employee rewards" />
              </ul>
              <button 
                onClick={handleContactSales}
                className="w-full btn-primary bg-opacity-80 hover:bg-opacity-100"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Building className="w-16 h-16 text-neon mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-6">
            Looking for Corporate Wellness Solutions?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Transform your workplace with custom wellness programs, group challenges, and corporate dashboards.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="btn-primary"
          >
            Schedule a Demo
          </button>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-center space-x-2">
    <Check className="w-5 h-5 text-neon flex-shrink-0" />
    <span className="text-gray-300">{text}</span>
  </li>
);

export default PricingPage;