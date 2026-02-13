import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Dumbbell, 
  Trophy, 
  LineChart, 
  Brain,
  Lock,
  CreditCard,
  X,
  Users,
  CalendarClock,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AIChatModal from '../components/AIChatModal';
import PaymentModal from '../components/PaymentModal';
import ManageSubscriptionModal from '../components/ManageSubscriptionModal';
import CustomizeMealModal from '../components/CustomizeMealModal';
import WorkoutCalendarModal from '../components/WorkoutCalendarModal';
import EventsModal from '../components/EventsModal';
import StatsModal from '../components/StatsModal';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedUpgradeFeature, setSelectedUpgradeFeature] = useState<string | null>(null);
  
  // New modal states
  const [isCustomizeMealOpen, setIsCustomizeMealOpen] = useState(false);
  const [isWorkoutCalendarOpen, setIsWorkoutCalendarOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  
  // Selected meal for customization
  const [selectedMeal, setSelectedMeal] = useState<{
    time: string;
    meal: string;
    calories: number;
  } | null>(null);

  const isPremium = profile?.tier === 'premium';
  
  const [remainingTips, setRemainingTips] = useState(() => {
    const stored = localStorage.getItem('remainingTips');
    return stored ? parseInt(stored) : 5;
  });

  // Load meals from localStorage or use defaults
  const [meals, setMeals] = useState(() => {
    const stored = localStorage.getItem('userMeals');
    return stored ? JSON.parse(stored) : [
      { time: "Breakfast", meal: "Protein Oatmeal with Berries", calories: 350 },
      { time: "Lunch", meal: "Grilled Chicken Salad", calories: 450 },
      { time: "Dinner", meal: "Salmon with Quinoa", calories: 550 }
    ];
  });

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setRemainingTips(5);
      localStorage.setItem('remainingTips', '5');
    }, timeToMidnight);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!isPremium) {
      const newCount = remainingTips - 1;
      setRemainingTips(newCount);
      localStorage.setItem('remainingTips', newCount.toString());
    }
  };

  const handleUpgrade = (feature?: string) => {
    setSelectedUpgradeFeature(feature || null);
    setIsPaymentModalOpen(true);
    setIsUpgradeModalOpen(false);
    setIsChatModalOpen(false);
  };

  const handlePaymentSuccess = () => {
    window.location.reload();
  };

  const handleCustomizeMeal = (meal: { time: string; meal: string; calories: number }) => {
    setSelectedMeal(meal);
    setIsCustomizeMealOpen(true);
  };

  const handleSaveMeal = (updatedMeal: { time: string; meal: string; calories: number }) => {
    const newMeals = meals.map(meal => 
      meal.time === updatedMeal.time ? updatedMeal : meal
    );
    setMeals(newMeals);
    localStorage.setItem('userMeals', JSON.stringify(newMeals));
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Welcome Banner */}
      <section className="bg-gray-dark py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-gray-300">
                {isPremium 
                  ? 'Premium Member - Unlimited Access' 
                  : `Freemium Member - ${remainingTips} AI tips remaining today`}
              </p>
              {isPremium && (
                <button 
                  onClick={() => setIsManageSubscriptionOpen(true)}
                  className="text-sm text-neon hover:underline flex items-center gap-1 mt-2"
                >
                  <Settings className="w-4 h-4" />
                  Manage Subscription
                </button>
              )}
            </div>
            <button 
              className="btn-primary flex items-center gap-2"
              onClick={() => setIsChatModalOpen(true)}
            >
              <MessageSquare className="w-5 h-5" />
              Chat Now
            </button>
          </div>
        </div>
      </section>

      {/* Rest of the existing JSX */}
      
      {/* Modals */}
      <AIChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        remainingTips={remainingTips}
        onSendMessage={handleSendMessage}
        isPremium={isPremium}
        onUpgrade={() => handleUpgrade('ai-chat')}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        feature={selectedUpgradeFeature || undefined}
      />

      <ManageSubscriptionModal
        isOpen={isManageSubscriptionOpen}
        onClose={() => setIsManageSubscriptionOpen(false)}
      />

      {selectedMeal && (
        <CustomizeMealModal
          isOpen={isCustomizeMealOpen}
          onClose={() => setIsCustomizeMealOpen(false)}
          currentMeal={selectedMeal}
          onSave={handleSaveMeal}
          isPremium={isPremium}
        />
      )}

      <WorkoutCalendarModal
        isOpen={isWorkoutCalendarOpen}
        onClose={() => setIsWorkoutCalendarOpen(false)}
        isPremium={isPremium}
      />

      <EventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        isPremium={isPremium}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        isPremium={isPremium}
      />
    </div>
  );
};

export default DashboardPage;