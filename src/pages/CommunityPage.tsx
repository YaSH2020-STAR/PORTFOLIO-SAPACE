import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Trophy,
  Instagram,
  Facebook,
  Twitter,
  Mail
} from 'lucide-react';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinCommunity = () => {
    if (user) {
      navigate('/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/signup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80"
            alt="Community Workout"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="section-title mb-8">
            <span className="gradient-text">JOIN THE MOVEMENT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Connect with a community that supports, motivates, and celebrates your fitness journey.
          </p>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 px-4 bg-gray-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Blogs & Social */}
            <div>
              <MessageSquare className="w-12 h-12 text-neon mb-6" />
              <h2 className="text-2xl font-bold mb-4">Blogs & Social</h2>
              <p className="text-gray-300 mb-6">
                Share your journey, tips, and success stories. Connect with others through our blog platform and comment system.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li>• Create and share your fitness blog</li>
                <li>• Subscribe to favorite authors</li>
                <li>• Engage through comments</li>
                <li>• Weekly featured stories</li>
              </ul>
            </div>

            {/* Swap Shop */}
            <div>
              <Share2 className="w-12 h-12 text-neon mb-6" />
              <h2 className="text-2xl font-bold mb-4">Swap Shop</h2>
              <p className="text-gray-300 mb-6">
                Buy, sell, or trade fitness gear with other members. Our platform handles shipping and ensures safe transactions.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li>• Peer-to-peer marketplace</li>
                <li>• Verified member ratings</li>
                <li>• Integrated shipping labels</li>
                <li>• Secure payment system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Events */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-16">
            <span className="gradient-text">CHALLENGES & EVENTS</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <EventCard 
              title="30-Day Challenges"
              description="Join monthly fitness challenges with prizes and community support."
            />
            <EventCard 
              title="Live Classes"
              description="Stream daily workout sessions with our expert trainers."
            />
            <EventCard 
              title="Local Meetups"
              description="Connect with members in your area for group workouts."
            />
          </div>

          <div className="text-center">
            <button 
              className="btn-primary"
              onClick={handleJoinCommunity}
            >
              {user ? 'Go to Dashboard' : 'Join Community'}
            </button>
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-20 px-4 bg-gray-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Stay Connected</h2>
          <p className="text-xl text-gray-300 mb-12">
            Follow us on social media and subscribe to our newsletter for the latest updates.
          </p>
          
          <div className="flex justify-center space-x-8 mb-12">
            <SocialLink icon={Instagram} href="#" />
            <SocialLink icon={Facebook} href="#" />
            <SocialLink icon={Twitter} href="#" />
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
              <button className="btn-primary">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const EventCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-gray-dark p-8 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
    <Trophy className="w-12 h-12 text-neon mb-4 mx-auto" />
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const SocialLink = ({ icon: Icon, href }: { icon: React.ElementType; href: string }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-neon transition-colors duration-300"
  >
    <Icon className="w-8 h-8" />
  </a>
);

export default CommunityPage;