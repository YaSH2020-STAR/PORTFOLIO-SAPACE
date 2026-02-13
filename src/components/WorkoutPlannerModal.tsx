import React, { useState } from 'react';
import { X, Dumbbell, Brain, Zap, Activity, Trophy, Clock } from 'lucide-react';

type WorkoutPlannerStep = 
  | 'days'
  | 'goal'
  | 'experience'
  | 'equipment'
  | 'preferences'
  | 'duration'
  | 'focus'
  | 'schedule'
  | 'generating';

type WorkoutDay = {
  isWorkout: boolean;
  type?: string;
};

type WorkoutPlan = {
  days: Record<string, WorkoutDay>;
  goal: string;
  experience: string;
  equipment: string[];
  preferences: string[];
  duration: string;
  focus: string[];
};

type WorkoutPlannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: WorkoutPlan) => void;
  isPremium: boolean;
};

const WorkoutPlannerModal = ({ isOpen, onClose, onSave, isPremium }: WorkoutPlannerModalProps) => {
  const [currentStep, setCurrentStep] = useState<WorkoutPlannerStep>('days');
  const [plan, setPlan] = useState<WorkoutPlan>({
    days: {
      'Monday': { isWorkout: false },
      'Tuesday': { isWorkout: false },
      'Wednesday': { isWorkout: false },
      'Thursday': { isWorkout: false },
      'Friday': { isWorkout: false },
      'Saturday': { isWorkout: false },
      'Sunday': { isWorkout: false }
    },
    goal: '',
    experience: '',
    equipment: [],
    preferences: [],
    duration: '',
    focus: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const steps: WorkoutPlannerStep[] = [
      'days', 'goal', 'experience', 'equipment', 
      'preferences', 'duration', 'focus', 'schedule', 'generating'
    ];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'schedule') {
        handleGeneratePlan();
      } else {
        setCurrentStep(steps[currentIndex + 1]);
      }
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setCurrentStep('generating');
    setError(null);

    try {
      // Here we would call the OpenAI API through our serverless function
      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save the plan
      onSave(plan);
      onClose();
    } catch (err) {
      console.error('Error generating plan:', err);
      setError('Failed to generate workout plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setPlan(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: { ...prev.days[day], isWorkout: !prev.days[day].isWorkout }
      }
    }));
  };

  const handleAutoGenerate = () => {
    // Example 3-day split
    setPlan(prev => ({
      ...prev,
      days: {
        'Monday': { isWorkout: true, type: 'Upper Body' },
        'Tuesday': { isWorkout: false },
        'Wednesday': { isWorkout: true, type: 'Lower Body' },
        'Thursday': { isWorkout: false },
        'Friday': { isWorkout: true, type: 'Full Body' },
        'Saturday': { isWorkout: false },
        'Sunday': { isWorkout: false }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-2xl w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Customize Your Workout Plan</h2>
          <p className="text-gray-300">
            Let's create your perfect workout routine
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'days' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Your Workout Days</h3>
              <div className="grid grid-cols-7 gap-2 mb-6">
                {Object.entries(plan.days).map(([day, { isWorkout }]) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      isWorkout ? 'bg-neon text-black' : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAutoGenerate}
                className="text-neon hover:underline text-sm"
              >
                Auto-generate balanced split
              </button>
            </div>
          )}

          {currentStep === 'goal' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">What's your primary fitness goal?</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Dumbbell, label: 'Build Muscle', value: 'muscle' },
                  { icon: Activity, label: 'Lose Fat', value: 'fat-loss' },
                  { icon: Zap, label: 'Boost Endurance', value: 'endurance' },
                  { icon: Brain, label: 'Improve Mobility', value: 'mobility' },
                  { icon: Trophy, label: 'Strength Training', value: 'strength' }
                ].map(({ icon: Icon, label, value }) => (
                  <button
                    key={value}
                    onClick={() => setPlan(prev => ({ ...prev, goal: value }))}
                    className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${
                      plan.goal === value
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'experience' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">What's your fitness level?</h3>
              <div className="space-y-4">
                {[
                  { label: 'Beginner', value: 'beginner', description: 'New to working out or getting back into it' },
                  { label: 'Intermediate', value: 'intermediate', description: 'Regular workout routine for 6+ months' },
                  { label: 'Advanced', value: 'advanced', description: 'Experienced with various workout types' }
                ].map(({ label, value, description }) => (
                  <button
                    key={value}
                    onClick={() => setPlan(prev => ({ ...prev, experience: value }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      plan.experience === value
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-semibold">{label}</div>
                    <div className="text-sm opacity-80">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'equipment' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">What equipment do you have access to?</h3>
              <div className="space-y-3">
                {[
                  'Gym Access',
                  'Bodyweight Only',
                  'Dumbbells',
                  'Resistance Bands',
                  'Barbell & Plates',
                  'Cardio Machines'
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      equipment: prev.equipment.includes(item)
                        ? prev.equipment.filter(e => e !== item)
                        : [...prev.equipment, item]
                    }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      plan.equipment.includes(item)
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'preferences' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">What type of workouts do you prefer?</h3>
              <div className="space-y-3">
                {[
                  'Strength Training',
                  'HIIT',
                  'Cardio-Based',
                  'Yoga & Mobility',
                  'CrossFit / Functional',
                  'Bodyweight Exercises'
                ].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      preferences: prev.preferences.includes(pref)
                        ? prev.preferences.filter(p => p !== pref)
                        : [...prev.preferences, pref]
                    }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      plan.preferences.includes(pref)
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'duration' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">How long do you want each workout to be?</h3>
              <div className="space-y-4">
                {[
                  { label: '20-30 minutes', value: '20-30' },
                  { label: '30-45 minutes', value: '30-45' },
                  { label: '45-60 minutes', value: '45-60' },
                  { label: '60+ minutes', value: '60+' }
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setPlan(prev => ({ ...prev, duration: value }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors flex items-center justify-between ${
                      plan.duration === value
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{label}</span>
                    <Clock className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'focus' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Any specific areas you want to focus on?</h3>
              <div className="space-y-3">
                {[
                  'Upper Body',
                  'Lower Body',
                  'Full Body',
                  'Core/Abs',
                  'Strength & Power',
                  'Endurance & Stamina'
                ].map((area) => (
                  <button
                    key={area}
                    onClick={() => setPlan(prev => ({
                      ...prev,
                      focus: prev.focus.includes(area)
                        ? prev.focus.filter(f => f !== area)
                        : [...prev.focus, area]
                    }))}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      plan.focus.includes(area)
                        ? 'bg-neon text-black'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'schedule' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Review Your Workout Schedule</h3>
              <div className="space-y-4">
                {Object.entries(plan.days).map(([day, { isWorkout, type }]) => (
                  <div key={day} className="bg-black p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{day}</span>
                      <span className={isWorkout ? 'text-neon' : 'text-gray-500'}>
                        {isWorkout ? (type || 'Workout Day') : 'Rest Day'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentStep === 'generating' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon mx-auto mb-4"></div>
              <p className="text-xl font-semibold mb-2">Creating Your Workout Plan</p>
              <p className="text-gray-300">
                Our AI is designing the perfect workout routine based on your preferences...
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'generating' && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'days' && !Object.values(plan.days).some(day => day.isWorkout)) ||
                (currentStep === 'goal' && !plan.goal) ||
                (currentStep === 'experience' && !plan.experience) ||
                (currentStep === 'equipment' && plan.equipment.length === 0) ||
                (currentStep === 'preferences' && plan.preferences.length === 0) ||
                (currentStep === 'duration' && !plan.duration) ||
                (currentStep === 'focus' && plan.focus.length === 0)
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 'schedule' ? 'Generate Plan' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlannerModal;