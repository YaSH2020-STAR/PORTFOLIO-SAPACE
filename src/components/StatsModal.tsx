import React, { useState } from 'react';
import { X, Calendar, Lock } from 'lucide-react';

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

const StatsModal = ({ isOpen, onClose, isPremium }: StatsModalProps) => {
  const [dateRange, setDateRange] = useState('week');

  if (!isOpen) return null;

  // Demo data
  const stats = {
    workouts: {
      completed: 12,
      total: 15,
      percentage: 80
    },
    weight: {
      start: 180,
      current: 175,
      goal: 170
    },
    calories: {
      average: 2200,
      goal: 2000,
      deficit: 200
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-2xl w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detailed Statistics</h2>
          {isPremium && (
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-neon focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          )}
        </div>

        {isPremium ? (
          <div className="space-y-6">
            {/* Workout Completion */}
            <div className="bg-black p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Workout Completion</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-700 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-neon h-full rounded-full"
                    style={{ width: `${stats.workouts.percentage}%` }}
                  />
                </div>
                <span className="text-neon font-bold">
                  {stats.workouts.percentage}%
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {stats.workouts.completed}/{stats.workouts.total} workouts completed
              </p>
            </div>

            {/* Weight Progress */}
            <div className="bg-black p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Weight Progress</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-300">Start</p>
                  <p className="text-xl font-bold">{stats.weight.start} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Current</p>
                  <p className="text-xl font-bold text-neon">{stats.weight.current} lbs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Goal</p>
                  <p className="text-xl font-bold">{stats.weight.goal} lbs</p>
                </div>
              </div>
            </div>

            {/* Calorie Tracking */}
            <div className="bg-black p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Calorie Tracking</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily Average</span>
                  <span>{stats.calories.average} cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily Goal</span>
                  <span>{stats.calories.goal} cal</span>
                </div>
                <div className="flex justify-between text-neon font-bold">
                  <span>Average Deficit</span>
                  <span>{stats.calories.deficit} cal</span>
                </div>
              </div>
            </div>

            <button className="w-full btn-primary">
              Download Detailed Report
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-neon mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
            <p className="text-gray-300 mb-6">
              Upgrade to Premium to access detailed statistics and progress tracking
            </p>
            <button className="btn-primary">
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;