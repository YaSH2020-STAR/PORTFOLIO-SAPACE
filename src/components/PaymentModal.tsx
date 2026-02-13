import React, { useState } from 'react';
import { X, CreditCard, Wallet, Bitcoin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentService from '../services/PaymentService';
import { useAuth } from '../contexts/AuthContext';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  feature?: string;
};

const PaymentModal = ({ isOpen, onClose, onSuccess, feature }: PaymentModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      if (!user) {
        throw new Error('Please sign in to continue');
      }

      await PaymentService.redirectToCheckout();
      
      // Close modal after redirect is initiated
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-md w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
          disabled={processing}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Choose Payment Method</h2>
        <p className="text-gray-300 mb-6">
          {feature 
            ? `Unlock ${feature} and all premium features`
            : 'Upgrade to Premium for full access'
          }
        </p>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Stripe Button */}
          <button
            onClick={handleStripeCheckout}
            disabled={processing}
            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-between group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-neon" />
              <span>{processing ? 'Processing...' : 'Pay with Card'}</span>
            </div>
            <span className="text-neon group-hover:translate-x-1 transition-transform">
              $24.99/month
            </span>
          </button>

          {/* Crypto (Coming Soon) */}
          <button
            className="w-full bg-black/50 text-gray-400 font-bold py-4 px-6 rounded-lg flex items-center justify-between cursor-not-allowed"
            disabled={true}
            onClick={() => alert('Crypto payments coming soon!')}
          >
            <div className="flex items-center">
              <Bitcoin className="w-6 h-6 mr-3" />
              <span>Pay with Crypto</span>
            </div>
            <span>Coming Soon</span>
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          🔒 Secure Payment Processing
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;