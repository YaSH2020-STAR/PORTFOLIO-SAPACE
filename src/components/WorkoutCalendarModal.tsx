import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import WorkoutPlannerModal from './WorkoutPlannerModal';
import { useAuth } from '../contexts/AuthContext';
import WorkoutService from '../services/WorkoutService';

type WorkoutCalendarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

type WorkoutDay = {
  isWorkout: boolean;
  type?: string;
  exercises?: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    intensity: 'low' | 'medium' | 'high';
  }[];
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

const WorkoutCalendarModal = ({ isOpen, onClose, isPremium }: WorkoutCalendarModalProps) => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadWorkoutPlan();
    }
  }, [isOpen, user]);

  const loadWorkoutPlan = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const plan = await WorkoutService.getUserWorkoutPlan(user.id);
      if (plan) {
        setWorkoutPlan(plan);
      }
    } catch (err) {
      console.error('Error loading workout plan:', err);
      setError('Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleSaveWorkoutPlan = async (plan: WorkoutPlan) => {
    if (!user) return;

    try {
      setLoading(true);
      await WorkoutService.createWorkoutPlan({
        ...plan,
        userId: user.id
      });
      await loadWorkoutPlan(); // Reload the plan after saving
      setIsPlannerOpen(false);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      setError('Failed to save workout plan');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty days for padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWorkoutForDay = (date: Date) => {
    if (!workoutPlan) return null;
    
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return workoutPlan.days[dayOfWeek];
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative bg-gray-dark rounded-lg max-w-4xl w-full p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-neon"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Workout Calendar</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:text-neon"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-lg font-semibold">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:text-neon"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isPremium ? (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading your workout plan...</p>
                </div>
              ) : (
                <>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold py-2 text-neon">
                        {day}
                      </div>
                    ))}
                    {getDaysInMonth(currentMonth).map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                      }

                      const workout = getWorkoutForDay(date);
                      const isToday = date.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={date.toISOString()}
                          className={`aspect-square p-2 border border-gray-700 rounded-lg ${
                            isToday ? 'border-neon' : ''
                          } ${workout?.isWorkout ? 'bg-black/50' : ''}`}
                        >
                          <div className="h-full flex flex-col">
                            <span className={`text-sm ${isToday ? 'text-neon' : 'text-gray-400'}`}>
                              {date.getDate()}
                            </span>
                            {workout?.isWorkout && (
                              <div className="flex-1 flex items-center justify-center">
                                <span className="text-xs text-neon text-center">
                                  {workout.type || 'Workout'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => setIsPlannerOpen(true)}
                      className="btn-primary"
                    >
                      {workoutPlan ? 'Update Workout Plan' : 'Customize Workout Plan'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-neon mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
              <p className="text-gray-300 mb-6">
                Upgrade to Premium to view and customize your full workout calendar
              </p>
              <button className="btn-primary">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>

      <WorkoutPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        onSave={handleSaveWorkoutPlan}
        isPremium={isPremium}
      />
    </>
  );
};

export default WorkoutCalendarModal;