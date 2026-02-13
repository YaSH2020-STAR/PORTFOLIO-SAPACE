import React from 'react';

const TermsPage = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="section-title mb-8">
          <span className="gradient-text">Terms of Service</span>
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using So Fire Fitness, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 18 years old to use our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Subscription Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscription fees are billed monthly</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided according to our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Content</h2>
            <p>By posting content on our platform, you:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Grant us license to use the content</li>
              <li>Confirm you own or have rights to share the content</li>
              <li>Agree not to post harmful or inappropriate content</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;