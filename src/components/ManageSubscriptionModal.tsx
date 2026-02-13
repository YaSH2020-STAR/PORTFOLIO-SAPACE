import React from 'react';
import { X, CreditCard, Calendar, Settings } from 'lucide-react';

type ManageSubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ManageSubscriptionModal = ({ isOpen, onClose }: ManageSubscriptionModalProps) => {
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

        <h2 className="text-2xl font-bold mb-6">Manage Subscription</h2>

        <div className="space-y-6">
          {/* Current Plan Info */}
          <div className="bg-black p-4 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center">
              <CreditCard className="w-5 h-5 text-neon mr-2" />
              Current Plan
            </h3>
            <p className="text-gray-300">Premium ($24.99/month)</p>
          </div>

          {/* Next Billing */}
          <div className="bg-black p-4 rounded-lg">
            <h3 className="font-bold mb-2 flex items-center">
              <Calendar className="w-5 h-5 text-neon mr-2" />
              Next Billing Date
            </h3>
            <p className="text-gray-300">Coming Soon</p>
          </div>

          {/* Actions */}
          <div className="bg-black p-4 rounded-lg">
            <h3 className="font-bold mb-4 flex items-center">
              <Settings className="w-5 h-5 text-neon mr-2" />
              Actions
            </h3>
            <div className="space-y-3">
              <button 
                className="w-full py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => alert('This feature is coming soon!')}
              >
                Update Payment Method
              </button>
              <button 
                className="w-full py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => alert('This feature is coming soon!')}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
};

export default ManageSubscriptionModal;