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
  Settings,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import AIChatModal from '../components/AIChatModal';
import PaymentModal from '../components/PaymentModal';
import ManageSubscriptionModal from '../components/ManageSubscriptionModal';
import CustomizeMealModal from '../components/CustomizeMealModal';
import WorkoutCalendarModal from '../components/WorkoutCalendarModal';
import EventsModal from '../components/EventsModal';
import StatsModal from '../components/StatsModal';
import MealSelectionModal from '../components/MealSelectionModal';
import FastingTrackerModal from '../components/FastingTrackerModal';
import FastingWidget from '../components/FastingWidget';
import MentalWellnessModal from '../components/MentalWellnessModal';
import RewardsModal from '../components/RewardsModal';
import RewardsPanel from '../components/RewardsPanel';
import RewardsService from '../services/RewardsService';

interface UserData {
  name: string;
  email: string;
  tier: 'freemium' | 'premium';
  createdAt: Date;
}

interface MealPlan {
  time: string;
  meal: string;
  calories: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMealSelectionOpen, setIsMealSelectionOpen] = useState(false);
  const [isMentalWellnessOpen, setIsMentalWellnessOpen] = useState(false);

  // Modal states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedUpgradeFeature, setSelectedUpgradeFeature] = useState<string | null>(null);
  const [isCustomizeMealOpen, setIsCustomizeMealOpen] = useState(false);
  const [isWorkoutCalendarOpen, setIsWorkoutCalendarOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFastingTrackerOpen, setIsFastingTrackerOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [hasExistingPreferences, setHasExistingPreferences] = useState(() => {
    const stored = localStorage.getItem('mealPreferences');
    return !!stored;
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  
  // Selected meal for customization
  const [selectedMeal, setSelectedMeal] = useState<MealPlan | null>(null);

  // User data
  const [remainingTips, setRemainingTips] = useState(() => {
    const stored = localStorage.getItem('remainingTips');
    return stored ? parseInt(stored) : 5;
  });

  const [meals, setMeals] = useState<MealPlan[]>([]);

  // Fetch user data and meal plans from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userDoc = doc(db, 'users', user.id);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data() as UserData);
          
          // Fetch meal plans
          const mealPlansQuery = query(
            collection(db, 'mealPlans'),
            where('userId', '==', user.id)
          );
          const mealPlansSnapshot = await getDocs(mealPlansQuery);
          const mealPlansData = mealPlansSnapshot.docs.map(doc => doc.data() as MealPlan);
          setMeals(mealPlansData.length > 0 ? mealPlansData : [
            { time: "Breakfast", meal: "Protein Oatmeal with Berries", calories: 350 },
            { time: "Lunch", meal: "Grilled Chicken Salad", calories: 450 },
            { time: "Dinner", meal: "Salmon with Quinoa", calories: 550 }
          ]);
        } else {
          setError('User profile not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Reset tips at midnight
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
    if (!userData?.tier || userData.tier !== 'premium') {
      const newCount = remainingTips - 1;
      setRemainingTips(newCount);
      localStorage.setItem('remainingTips', newCount.toString());
    }
    // Add chat reward points
    RewardsService.addActivity('chat', 'Used AI Coach');
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

  const handleCustomizeMeal = (meal: MealPlan) => {
    setSelectedMeal(meal);
    setIsCustomizeMealOpen(true);
  };

  const handleSaveMeal = async (updatedMeal: MealPlan) => {
    if (!user) return;

    try {
      const newMeals = meals.map(meal => 
        meal.time === updatedMeal.time ? updatedMeal : meal
      );
      setMeals(newMeals);
      
      // Update in Firestore
      const mealPlanRef = doc(db, 'mealPlans', user.id);
      await setDoc(mealPlanRef, { meals: newMeals }, { merge: true });

      // Add meal logging reward points
      RewardsService.addActivity('meal', 'Logged meal plan');
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError('Failed to save meal plan');
    }
  };

  const handleAIPlannerClick = () => {
    setIsMealSelectionOpen(true);
  };

  const handleMealSelect = (mealTime: string) => {
    setIsMealSelectionOpen(false);
    setSelectedMeal({
      time: mealTime,
      meal: '',
      calories: 0
    });
    setIsCustomizeMealOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Please sign in to access your dashboard</p>
          <Link to="/signin" className="btn-primary">
            Sign In
          </Link>
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
                Welcome back, {userData.name}!
              </h1>
              <p className="text-gray-300">
                {userData.tier === 'premium' 
                  ? 'Premium Member - Unlimited Access' 
                  : `Freemium Member - ${remainingTips} AI tips remaining today`}
              </p>
              {userData.tier === 'premium' && (
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

      {/* Dashboard Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Meal Plans */}
            <div className="bg-gray-dark p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Today's Meals</h2>
                <button 
                  onClick={handleAIPlannerClick}
                  className="text-neon hover:underline text-sm flex items-center"
                >
                  AI Planner
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {meals.map((meal, index) => (
                  <div 
                    key={index}
                    className="bg-black p-4 rounded-lg cursor-pointer hover:bg-black/70 transition-colors"
                    onClick={() => handleCustomizeMeal(meal)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{meal.time}</h3>
                        <p className="text-gray-300">{meal.meal}</p>
                      </div>
                      <span className="text-neon">{meal.calories} cal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <FastingWidget />
              
              {/* Add Rewards Panel */}
              <RewardsPanel onClick={() => setIsRewardsModalOpen(true)} />

              <button 
                onClick={() => setIsFastingTrackerOpen(true)}
                className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-neon mr-3" />
                    <span className="font-semibold">Fasting Tracker</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              <button 
                onClick={() => setIsWorkoutCalendarOpen(true)}
                className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-neon mr-3" />
                    <span className="font-semibold">Workout Calendar</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              <button 
                onClick={() => setIsStatsOpen(true)}
                className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LineChart className="w-6 h-6 text-neon mr-3" />
                    <span className="font-semibold">Progress Stats</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              <button 
                onClick={() => setIsEventsOpen(true)}
                className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-neon mr-3" />
                    <span className="font-semibold">Community Events</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>

              <button 
                onClick={() => setIsMentalWellnessOpen(true)}
                className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-neon mr-3" />
                    <span className="font-semibold">Mental Wellness</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AIChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        remainingTips={remainingTips}
        onSendMessage={handleSendMessage}
        isPremium={userData.tier === 'premium'}
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

      <MealSelectionModal
        isOpen={isMealSelectionOpen}
        onClose={() => setIsMealSelectionOpen(false)}
        onMealSelect={handleMealSelect}
      />

      {selectedMeal && (
        <CustomizeMealModal
          isOpen={isCustomizeMealOpen}
          onClose={() => setIsCustomizeMealOpen(false)}
          currentMeal={selectedMeal}
          onSave={handleSaveMeal}
          isPremium={userData.tier === 'premium'}
        />
      )}

      <WorkoutCalendarModal
        isOpen={isWorkoutCalendarOpen}
        onClose={() => setIsWorkoutCalendarOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      <EventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      <FastingTrackerModal
        isOpen={isFastingTrackerOpen}
        onClose={() => setIsFastingTrackerOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      <MentalWellnessModal
        isOpen={isMentalWellnessOpen}
        onClose={() => setIsMentalWellnessOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        isPremium={userData.tier === 'premium'}
      />

      {/* Preferences Confirmation Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-dark rounded-lg max-w-md w-full p-8">
            <button 
              onClick={() => setShowPreferencesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-neon"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">Use Existing Preferences?</h2>
            <p className="text-gray-300 mb-6">
              Would you like to make any changes to your meal plan requirements before proceeding?
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowPreferencesModal(false);
                  setIsCustomizeMealOpen(true);
                }}
                className="w-full py-3 px-4 bg-black hover:bg-black/70 rounded-lg text-white transition-colors"
              >
                Yes, update my preferences
              </button>
              <button 
                onClick={() => {
                  // Use existing preferences to generate new plan
                  const preferences = JSON.parse(localStorage.getItem('mealPreferences') || '{}');
                  // TODO: Generate plan with existing preferences
                  setShowPreferencesModal(false);
                }}
                className="w-full btn-primary"
              >
                No, continue with current preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;