import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Dumbbell, Leaf, Brain, Clock, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type MealPlannerStep = 'goal' | 'diet' | 'training' | 'structure' | 'generating' | 'review';

type Goal = 'muscle' | 'fat-loss' | 'energy' | 'longevity' | 'custom';
type DietaryPreference = 'high-protein' | 'keto' | 'vegetarian' | 'vegan' | 'dairy-free' | 'gluten-free' | 'custom';
type TrainingType = 'marathon' | 'fight-prep' | 'cycling' | 'team-sports' | 'general' | 'custom';

type MealPlan = {
  meals: {
    time: string;
    name: string;
    calories: number;
    description: string;
    completed: boolean;
  }[];
  totalCalories: number;
};

type AIMealPlannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealPlan: MealPlan) => void;
  isPremium: boolean;
};

const AIMealPlannerModal = ({ isOpen, onClose, onSave, isPremium }: AIMealPlannerModalProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<MealPlannerStep>('goal');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [customDiet, setCustomDiet] = useState('');
  const [trainingType, setTrainingType] = useState<TrainingType | null>(null);
  const [customTraining, setCustomTraining] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem('mealPreferences');
    return stored ? JSON.parse(stored) : null;
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('goal');
      setSelectedGoal(null);
      setCustomGoal('');
      setDietaryPreferences([]);
      setCustomDiet('');
      setTrainingType(null);
      setCustomTraining('');
      setMealsPerDay(3);
      setTargetCalories(2000);
      setGeneratedPlan(null);
      setError(null);
    }
  }, [isOpen]);

  const handleNext = () => {
    const steps: MealPlannerStep[] = ['goal', 'diet', 'training', 'structure', 'generating', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'structure') {
        handleGeneratePlan();
      } else {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleGeneratePlan = async () => {
    if (!user) {
      setError('Please sign in to generate a meal plan');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');
    setError(null);

    try {
      const prompt = `Create a ${mealsPerDay}-meal plan with total ${targetCalories} calories for someone with the following preferences:
        Goal: ${selectedGoal === 'custom' ? customGoal : selectedGoal}
        Dietary Preferences: ${[...dietaryPreferences, customDiet].filter(Boolean).join(', ')}
        Training Type: ${trainingType === 'custom' ? customTraining : trainingType}

        Please format the response as a structured meal plan with specific meals, their descriptions, and calorie counts.
        For each meal include:
        1. Name of the meal
        2. Detailed description of ingredients and preparation
        3. Calorie count
        4. Time of day (Breakfast, Lunch, Dinner, or Snack)
      `;

      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          message: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      
      // For now, use demo data until we implement proper AI response parsing
      const demoMealPlan: MealPlan = {
        meals: [
          {
            time: 'Breakfast',
            name: 'Protein Oatmeal Bowl',
            calories: Math.round(targetCalories * 0.25),
            description: 'Oatmeal with protein powder, berries, and nuts',
            completed: false
          },
          {
            time: 'Lunch',
            name: 'Grilled Chicken Salad',
            calories: Math.round(targetCalories * 0.35),
            description: 'Mixed greens, grilled chicken, avocado, and olive oil dressing',
            completed: false
          },
          {
            time: 'Dinner',
            name: 'Salmon with Quinoa',
            calories: Math.round(targetCalories * 0.4),
            description: 'Baked salmon with quinoa and roasted vegetables',
            completed: false
          }
        ],
        totalCalories: targetCalories
      };

      setGeneratedPlan(demoMealPlan);
      setCurrentStep('review');
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError('Failed to generate meal plan. Please try again.');
      setCurrentStep('structure'); // Go back to previous step on error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedPlan) {
      // Save preferences for future use
      const newPreferences = {
        goal: selectedGoal === 'custom' ? customGoal : selectedGoal,
        dietaryPreferences,
        customDiet,
        trainingType: trainingType === 'custom' ? customTraining : trainingType,
        mealsPerDay,
        targetCalories
      };
      localStorage.setItem('mealPreferences', JSON.stringify(newPreferences));
      
      onSave(generatedPlan);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="relative bg-gray-dark rounded-lg max-w-2xl w-full p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">AI Meal Planner</h2>
          <p className="text-gray-300">
            Let's create your perfect meal plan
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'goal' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">What's your main goal?</h3>
              <div className="grid grid-cols-2 gap-4">
                <GoalButton
                  icon={Dumbbell}
                  label="Build Muscle"
                  selected={selectedGoal === 'muscle'}
                  onClick={() => setSelectedGoal('muscle')}
                />
                <GoalButton
                  icon={Brain}
                  label="Lose Fat"
                  selected={selectedGoal === 'fat-loss'}
                  onClick={() => setSelectedGoal('fat-loss')}
                />
                <GoalButton
                  icon={Leaf}
                  label="Boost Energy"
                  selected={selectedGoal === 'energy'}
                  onClick={() => setSelectedGoal('energy')}
                />
                <GoalButton
                  icon={Clock}
                  label="Longevity"
                  selected={selectedGoal === 'longevity'}
                  onClick={() => setSelectedGoal('longevity')}
                />
              </div>
              {selectedGoal === 'custom' && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Describe your goal..."
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                />
              )}
            </div>
          )}

          {currentStep === 'diet' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {['high-protein', 'keto', 'vegetarian', 'vegan', 'dairy-free', 'gluten-free'].map((diet) => (
                  <button
                    key={diet}
                    onClick={() => {
                      if (dietaryPreferences.includes(diet as DietaryPreference)) {
                        setDietaryPreferences(prev => prev.filter(d => d !== diet));
                      } else {
                        setDietaryPreferences(prev => [...prev, diet as DietaryPreference]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      dietaryPreferences.includes(diet as DietaryPreference)
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {diet.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customDiet}
                onChange={(e) => setCustomDiet(e.target.value)}
                placeholder="Any other dietary preferences?"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
              />
            </div>
          )}

          {currentStep === 'training' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Training Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'marathon', label: 'Marathon Training' },
                  { value: 'fight-prep', label: 'Fight Prep' },
                  { value: 'cycling', label: 'Cycling' },
                  { value: 'team-sports', label: 'Team Sports' },
                  { value: 'general', label: 'General Fitness' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setTrainingType(type.value as TrainingType)}
                    className={`p-4 rounded-lg transition-colors ${
                      trainingType === type.value
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {trainingType === 'custom' && (
                <input
                  type="text"
                  value={customTraining}
                  onChange={(e) => setCustomTraining(e.target.value)}
                  placeholder="Describe your training..."
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                />
              )}
            </div>
          )}

          {currentStep === 'structure' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Meals per Day</h3>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>1 meal</span>
                  <span>{mealsPerDay} meals</span>
                  <span>6 meals</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Daily Calories</h3>
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="100"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>1200 kcal</span>
                  <span>{targetCalories} kcal</span>
                  <span>4000 kcal</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'generating' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-neon animate-spin mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">Creating Your Meal Plan</p>
              <p className="text-gray-300">
                Our AI is crafting the perfect meal plan based on your preferences...
              </p>
            </div>
          )}

          {currentStep === 'review' && generatedPlan && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Your Personalized Meal Plan</h3>
              {generatedPlan.meals.map((meal, index) => (
                <div 
                  key={index}
                  className="bg-black p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{meal.time}</h4>
                      <p className="text-neon">{meal.name}</p>
                    </div>
                    <span className="text-gray-300">{meal.calories} cal</span>
                  </div>
                  <p className="text-gray-300 text-sm">{meal.description}</p>
                </div>
              ))}
              <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg">
                <span className="font-semibold">Total Calories</span>
                <span className="text-neon">{generatedPlan.totalCalories} cal</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-end">
          {currentStep === 'review' ? (
            <button 
              onClick={handleSave}
              className="btn-primary"
            >
              Save Meal Plan
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'goal' && !selectedGoal) ||
                (currentStep === 'training' && !trainingType) ||
                isGenerating
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 'structure' ? 'Generate Plan' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const GoalButton = ({ 
  icon: Icon, 
  label, 
  selected, 
  onClick 
}: { 
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg transition-colors flex items-center space-x-3 ${
      selected
        ? 'bg-neon text-black'
        : 'bg-black text-white hover:bg-gray-800'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span>{label}</span>
  </button>
);

export default AIMealPlannerModal;