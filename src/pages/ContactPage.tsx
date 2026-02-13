import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ContactPage = () => {
  const location = useLocation();
  const isSalesInquiry = location.search.includes('sales=true');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    phone: '',
    teamSize: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xqaebazy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          inquiryType: isSalesInquiry ? 'Sales Contact' : 'Demo Request'
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          companyName: '',
          phone: '',
          teamSize: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }

    // Reset status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="section-title mb-8">
          <span className="gradient-text">
            {isSalesInquiry ? 'Contact Sales' : 'Contact Us'}
          </span>
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-neon" />
                  <span className="text-gray-300">support@sofirefitness.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-neon" />
                  <span className="text-gray-300">1-800-SO-FIRE</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-neon" />
                  <span className="text-gray-300">123 Fitness Street, CA 90210</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Support Hours</h2>
              <p className="text-gray-300">
                Monday - Friday: 9:00 AM - 8:00 PM EST<br />
                Saturday: 10:00 AM - 6:00 PM EST<br />
                Sunday: 12:00 PM - 5:00 PM EST
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'success' && (
              <div className="bg-green-900/50 text-green-200 p-3 rounded-lg text-center">
                Thank you! Our team will reach out to you shortly.
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-center">
                Failed to send message. Please try again.
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Corporate Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>

            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
                Number of Employees / Team Size *
              </label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              >
                <option value="">Select team size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message / Inquiry Details *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {isSalesInquiry ? 'Contact Sales' : 'Schedule Demo'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;