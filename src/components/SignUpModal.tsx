import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Store user data in localStorage for demo purposes
      localStorage.setItem('userPlan', formData.plan);
      localStorage.setItem('userName', formData.name);
      navigate('/dashboard');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-md w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                />
              </div>
              <button type="submit" className="w-full btn-primary mt-6">
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className={`block p-4 bg-black border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  formData.plan === 'freemium' ? 'border-neon' : 'border-gray-700 hover:border-neon'
                }`}>
                  <input
                    type="radio"
                    name="plan"
                    value="freemium"
                    checked={formData.plan === 'freemium'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Freemium</span>
                    <span className="text-gray-400">$0/month</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Basic AI tips (5 uses/day) & limited features
                  </p>
                </label>

                <label className={`block p-4 bg-black border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  formData.plan === 'premium' ? 'border-neon' : 'border-gray-700 hover:border-neon'
                }`}>
                  <input
                    type="radio"
                    name="plan"
                    value="premium"
                    checked={formData.plan === 'premium'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Premium</span>
                    <span className="text-neon">$24.99/month</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Advanced AI, unlimited features & rewards
                  </p>
                </label>
              </div>

              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">
                  🎉 Optional: Add $20 starter fee (refundable upon goal achievement)
                  <span className="text-neon ml-2">Coming Soon!</span>
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary"
                disabled={!formData.plan}
              >
                {formData.plan === 'premium' ? 'Continue to Payment' : 'Start Free Trial'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;