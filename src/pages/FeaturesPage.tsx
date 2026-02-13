import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Dumbbell, 
  Clock, 
  LineChart, 
  Trophy, 
  Users, 
  Video,
  Brain,
  HeartPulse
} from 'lucide-react';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartJourney = () => {
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
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80"
            alt="AI Fitness"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="section-title text-center mb-8">
            <span className="gradient-text">THE FUTURE OF FITNESS</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-300 max-w-4xl mx-auto">
            So Fire Fitness combines AI-powered personalization with real-world community support. 
            Our integrated approach spans digital tools, in-person meetups, and comprehensive health tracking.
          </p>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 bg-gray-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-16">
            <span className="gradient-text">POWERFUL FEATURES</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Calendar}
              title="AI Meal Planning"
              description="Smart meal calendars with setback ratings for your favorite foods. Personalized suggestions based on your goals."
            />
            <FeatureCard 
              icon={Dumbbell}
              title="Training Calendar"
              description="Customized weight training and cardio schedules that adapt to your progress."
            />
            <FeatureCard 
              icon={Clock}
              title="Fasting Tracker"
              description="Pyramid-style intermittent fasting schedules with progress tracking and reminders."
            />
            <FeatureCard 
              icon={LineChart}
              title="Progress Tracking"
              description="Comprehensive tracking for nutrition, workouts, measurements, and goals."
            />
            <FeatureCard 
              icon={Trophy}
              title="Reward System"
              description="Earn points, win cash prizes, and get free gear for reaching your goals."
            />
            <FeatureCard 
              icon={Brain}
              title="Mental Wellness"
              description="Guided meditation, stress management, and mental health resources."
            />
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-16">
            <span className="gradient-text">BEYOND DIGITAL</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <IntegrationCard 
              icon={Users}
              title="In-Person Meetups"
              description="Join local workout groups, attend Q&A sessions, and connect with fellow members."
            />
            <IntegrationCard 
              icon={Video}
              title="Live Classes"
              description="Stream live workout sessions, nutrition workshops, and wellness seminars."
            />
            <IntegrationCard 
              icon={HeartPulse}
              title="Healthcare Integration"
              description="Connect with healthcare providers and track your wellness journey holistically."
            />
          </div>

          <div className="text-center mt-16">
            <button 
              className="btn-primary"
              onClick={handleStartJourney}
            >
              {user ? 'Go to Dashboard' : 'Start Your Journey'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-black p-8 rounded-lg transform hover:scale-105 transition-all duration-300">
    <Icon className="w-12 h-12 text-neon mb-4" />
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const IntegrationCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-dark p-8 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
    <Icon className="w-16 h-16 text-neon mb-4 mx-auto" />
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default FeaturesPage;