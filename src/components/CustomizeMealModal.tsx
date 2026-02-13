import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Meal = {
  time: string;
  meal: string;
  calories: number;
};

type CustomizeMealModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentMeal: Meal;
  onSave: (meal: Meal) => void;
  isPremium: boolean;
};

const CustomizeMealModal = ({ 
  isOpen, 
  onClose, 
  currentMeal,
  onSave,
  isPremium 
}: CustomizeMealModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'options' | 'ai-planner'>('options');
  const [selectedMeal, setSelectedMeal] = useState(currentMeal);
  const [portions, setPortion] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiPreferences, setAiPreferences] = useState({
    goal: '',
    dietaryPreferences: [] as string[],
    customDiet: '',
    trainingType: '',
    mealsPerDay: 3,
    targetCalories: 2000
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMeal(currentMeal);
      setPortion(1);
      setError(null);
      setStep('options');
      
      // Load saved preferences if they exist
      const savedPrefs = localStorage.getItem('mealPreferences');
      if (savedPrefs) {
        setAiPreferences(JSON.parse(savedPrefs));
      }
    }
  }, [isOpen, currentMeal]);

  const alternativeMeals = {
    "Breakfast": [
      { meal: "Protein Oatmeal with Berries", calories: 350 },
      { meal: "Greek Yogurt Parfait", calories: 300 },
      { meal: "Egg White Omelet", calories: 280 },
      { meal: "Protein Smoothie Bowl", calories: 320 },
    ],
    "Lunch": [
      { meal: "Grilled Chicken Salad", calories: 450 },
      { meal: "Turkey Wrap", calories: 400 },
      { meal: "Quinoa Buddha Bowl", calories: 420 },
      { meal: "Tuna Avocado Plate", calories: 380 },
    ],
    "Dinner": [
      { meal: "Salmon with Quinoa", calories: 550 },
      { meal: "Lean Steak with Vegetables", calories: 520 },
      { meal: "Grilled Fish Tacos", calories: 480 },
      { meal: "Chicken Stir-Fry", calories: 450 },
    ]
  };

  const mealOptions = alternativeMeals[currentMeal.time as keyof typeof alternativeMeals] || [];
  const visibleOptions = isPremium ? mealOptions : mealOptions.slice(0, 2);

  const handleSave = async () => {
    if (!selectedMeal) {
      setError('Please select a meal before saving');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Validate meal data
      if (!selectedMeal.time || !selectedMeal.meal || !selectedMeal.calories) {
        throw new Error('Invalid meal data');
      }

      const updatedMeal = {
        time: selectedMeal.time,
        meal: selectedMeal.meal,
        calories: Math.round(selectedMeal.calories * portions)
      };

      await onSave(updatedMeal);
      onClose();
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError('Failed to save meal plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    setSaving(true);
    setError(null);

    try {
      // Save preferences
      localStorage.setItem('mealPreferences', JSON.stringify(aiPreferences));

      // Generate meal using OpenAI
      const prompt = `Generate a healthy ${currentMeal.time.toLowerCase()} meal that:
        - Aligns with ${aiPreferences.goal} goal
        - Follows dietary preferences: ${aiPreferences.dietaryPreferences.join(', ')}
        - Considers training type: ${aiPreferences.trainingType}
        - Targets ${Math.round(aiPreferences.targetCalories / aiPreferences.mealsPerDay)} calories
        
        Return a meal name and calorie count.`;

      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          message: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      
      // Parse AI response and update meal
      // For demo, using a placeholder meal
      const generatedMeal = {
        time: currentMeal.time,
        meal: `AI Generated ${currentMeal.time} Meal`,
        calories: Math.round(aiPreferences.targetCalories / aiPreferences.mealsPerDay)
      };

      setSelectedMeal(generatedMeal);
      setStep('options');
    } catch (err) {
      console.error('Error generating meal:', err);
      setError('Failed to generate meal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customize {currentMeal.time}</h2>
          {step === 'options' && (
            <button
              onClick={() => setStep('ai-planner')}
              className="text-neon hover:underline text-sm flex items-center"
            >
              AI Planner
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === 'options' ? (
          <>
            {/* Alternative Meals */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Choose Alternative</h3>
              <div className="space-y-3">
                {visibleOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedMeal({ ...currentMeal, ...option })}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedMeal.meal === option.meal
                        ? 'bg-neon text-black'
                        : 'bg-black hover:bg-black/70'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.meal}</span>
                      <span className="text-sm">{option.calories} cal</span>
                    </div>
                  </button>
                ))}
                
                {!isPremium && mealOptions.length > 2 && (
                  <div className="bg-black/50 p-4 rounded-lg text-center">
                    <Lock className="w-6 h-6 text-neon mx-auto mb-2" />
                    <p className="text-sm text-gray-300">
                      Upgrade to Premium for {mealOptions.length - 2} more meal options
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Portion Control - Premium Only */}
            {isPremium && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Adjust Portion</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={portions}
                    onChange={(e) => setPortion(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-neon">{portions}x</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Adjusted Calories: {Math.round(selectedMeal.calories * portions)}
                </p>
              </div>
            )}

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary flex items-center justify-center"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black" />
              ) : (
                'Save Changes'
              )}
            </button>
          </>
        ) : (
          <div className="space-y-6">
            {/* AI Planner Form */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Goal
              </label>
              <select
                value={aiPreferences.goal}
                onChange={(e) => setAiPreferences(prev => ({ ...prev, goal: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              >
                <option value="">Select a goal</option>
                <option value="muscle-gain">Build Muscle</option>
                <option value="fat-loss">Lose Fat</option>
                <option value="energy">Boost Energy</option>
                <option value="longevity">Longevity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {['high-protein', 'keto', 'vegetarian', 'vegan', 'dairy-free', 'gluten-free'].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => {
                      setAiPreferences(prev => ({
                        ...prev,
                        dietaryPreferences: prev.dietaryPreferences.includes(pref)
                          ? prev.dietaryPreferences.filter(p => p !== pref)
                          : [...prev.dietaryPreferences, pref]
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      aiPreferences.dietaryPreferences.includes(pref)
                        ? 'bg-neon text-black'
                        : 'bg-black text-white'
                    }`}
                  >
                    {pref.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Training Type
              </label>
              <select
                value={aiPreferences.trainingType}
                onChange={(e) => setAiPreferences(prev => ({ ...prev, trainingType: e.target.value }))}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              >
                <option value="">Select training type</option>
                <option value="marathon">Marathon Training</option>
                <option value="fight-prep">Fight Prep</option>
                <option value="cycling">Cycling</option>
                <option value="team-sports">Team Sports</option>
                <option value="general">General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Meals
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={aiPreferences.mealsPerDay}
                onChange={(e) => setAiPreferences(prev => ({ ...prev, mealsPerDay: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>1 meal</span>
                <span>{aiPreferences.mealsPerDay} meals</span>
                <span>6 meals</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Daily Calories
              </label>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={aiPreferences.targetCalories}
                onChange={(e) => setAiPreferences(prev => ({ ...prev, targetCalories: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>1200 cal</span>
                <span>{aiPreferences.targetCalories} cal</span>
                <span>4000 cal</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('options')}
                className="flex-1 py-2 px-4 bg-black hover:bg-black/70 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={saving || !aiPreferences.goal || !aiPreferences.trainingType}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black mx-auto" />
                ) : (
                  'Generate Meal'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizeMealModal;