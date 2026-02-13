import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignInPage = () => {
  const { signIn, error, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleResetPassword = async () => {
    await resetPassword(email);
    setResetSent(true);
  };

  // Format error message for display
  const getErrorMessage = (error: string) => {
    if (error.includes('invalid_credentials') || error.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    return error;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">
          <span className="gradient-text">Welcome Back</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-dark p-8 rounded-lg">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-lg">
              {getErrorMessage(error)}
            </div>
          )}

          {resetSent && (
            <div className="bg-green-900/50 text-green-200 p-3 rounded-lg">
              Check your email for password reset instructions
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-neon hover:underline"
            >
              Forgot your password?
            </button>
            <Link to="/signup" className="text-neon hover:underline">
              Need an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;