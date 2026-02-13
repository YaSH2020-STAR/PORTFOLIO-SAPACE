import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PaymentService from '../services/PaymentService';

type LocationState = {
  selectedPlan?: 'freemium' | 'premium';
};

const SignUpPage = () => {
  const { signUp, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlan } = (location.state as LocationState) || {};
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fitnessGoal: '',
    tShirtSize: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      try {
        await signUp(formData.email, formData.password, formData.name);
        
        // If user selected premium plan, redirect to checkout
        if (selectedPlan === 'premium') {
          await PaymentService.redirectToCheckout();
        } else {
          navigate('/welcome');
        }
      } catch (err) {
        console.error('Signup error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="gradient-text">Start Your Free Trial</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-dark p-8 rounded-lg">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
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
            </>
          ) : (
            <>
              <div>
                <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-300 mb-2">
                  Fitness Goal
                </label>
                <select
                  id="fitnessGoal"
                  name="fitnessGoal"
                  required
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                >
                  <option value="">Select a goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="general-fitness">General Fitness</option>
                </select>
              </div>
              <div>
                <label htmlFor="tShirtSize" className="block text-sm font-medium text-gray-300 mb-2">
                  T-Shirt Size
                </label>
                <select
                  id="tShirtSize"
                  name="tShirtSize"
                  required
                  value={formData.tShirtSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                >
                  <option value="">Select a size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="w-full btn-primary">
            {step === 1 ? 'Continue' : selectedPlan === 'premium' ? 'Continue to Payment' : 'Complete Sign Up'}
          </button>

          <p className="text-center text-gray-300 text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-neon hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;