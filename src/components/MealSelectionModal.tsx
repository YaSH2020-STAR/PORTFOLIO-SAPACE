import React from 'react';
import { X } from 'lucide-react';

type MealSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onMealSelect: (mealTime: string) => void;
};

const MealSelectionModal = ({ isOpen, onClose, onMealSelect }: MealSelectionModalProps) => {
  if (!isOpen) return null;

  const mealTimes = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-md w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Select Meal to Plan</h2>
        
        <div className="space-y-3">
          {mealTimes.map(meal => (
            <button
              key={meal.id}
              onClick={() => onMealSelect(meal.label)}
              className="w-full bg-black hover:bg-black/70 text-white p-4 rounded-lg transition-colors flex justify-between items-center group"
            >
              <span className="text-lg">{meal.label}</span>
              <span className="text-neon opacity-0 group-hover:opacity-100 transition-opacity">
                Plan Now →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealSelectionModal;