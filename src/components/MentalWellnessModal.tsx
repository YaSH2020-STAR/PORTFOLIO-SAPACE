import React, { useState, useEffect } from 'react';
import { X, Brain, Flower2, Wind, Smile, Meh, Frown } from 'lucide-react';
import WellnessService from '../services/WellnessService';
import { WellnessData, MoodType } from '../types/wellness';
import ZenGarden from './ZenGarden';

type MentalWellnessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

const MentalWellnessModal = ({ isOpen, onClose, isPremium }: MentalWellnessModalProps) => {
  const [view, setView] = useState<'garden' | 'breathing' | 'mood'>('garden');
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodNotes, setMoodNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadWellnessData();
    }
  }, [isOpen]);

  const loadWellnessData = () => {
    setWellnessData(WellnessService.getWellnessData());
  };

  const handleStartBreathing = () => {
    setIsBreathing(true);
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    const interval = setInterval(() => {
      if (phase === 'inhale') {
        phase = 'hold';
      } else if (phase === 'hold') {
        phase = 'exhale';
      } else {
        phase = 'inhale';
      }
      setBreathingPhase(phase);
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
      WellnessService.completeWellnessActivity('meditation');
      loadWellnessData();
    }, 120000); // 2 minutes
  };

  const handleMoodLog = () => {
    if (!selectedMood) return;
    
    WellnessService.logMood(selectedMood, moodNotes);
    setSelectedMood(null);
    setMoodNotes('');
    loadWellnessData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-dark rounded-lg max-w-4xl w-full p-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-neon"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Mental Wellness Hub</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setView('garden')}
              className={`p-2 rounded-lg ${view === 'garden' ? 'text-neon' : 'text-gray-400'}`}
            >
              <Flower2 className="w-6 h-6" />
            </button>
            <button
              onClick={() => setView('breathing')}
              className={`p-2 rounded-lg ${view === 'breathing' ? 'text-neon' : 'text-gray-400'}`}
            >
              <Wind className="w-6 h-6" />
            </button>
            <button
              onClick={() => setView('mood')}
              className={`p-2 rounded-lg ${view === 'mood' ? 'text-neon' : 'text-gray-400'}`}
            >
              <Brain className="w-6 h-6" />
            </button>
          </div>
        </div>

        {view === 'garden' && wellnessData && (
          <div>
            <h3 className="text-xl font-bold mb-4">Your Zen Garden</h3>
            <ZenGarden items={wellnessData.zenGarden} />
            <div className="mt-4 bg-black p-4 rounded-lg">
              <p className="text-gray-300">
                Current Streak: {wellnessData.streak.currentStreak} days
              </p>
              <p className="text-gray-300">
                Total Wellness Days: {wellnessData.streak.totalDays}
              </p>
            </div>
          </div>
        )}

        {view === 'breathing' && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-8">Breathing Exercise</h3>
            {isBreathing ? (
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div 
                  className={`absolute inset-0 bg-neon/20 rounded-full transition-all duration-4000 ${
                    breathingPhase === 'inhale' ? 'scale-150 opacity-50' :
                    breathingPhase === 'hold' ? 'scale-150 opacity-70' :
                    'scale-100 opacity-30'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {breathingPhase === 'inhale' ? 'Inhale' :
                     breathingPhase === 'hold' ? 'Hold' :
                     'Exhale'}
                  </span>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleStartBreathing}
                className="btn-primary"
              >
                Start 2-Minute Exercise
              </button>
            )}
          </div>
        )}

        {view === 'mood' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { mood: 'calm' as MoodType, icon: Smile, label: 'Calm' },
                { mood: 'neutral' as MoodType, icon: Meh, label: 'Neutral' },
                { mood: 'stressed' as MoodType, icon: Frown, label: 'Stressed' }
              ].map(({ mood, icon: Icon, label }) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-6 rounded-lg flex flex-col items-center gap-2 ${
                    selectedMood === mood
                      ? 'bg-neon text-black'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-8 h-8" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                rows={3}
                placeholder="How are you feeling today?"
              />
            </div>

            <button
              onClick={handleMoodLog}
              disabled={!selectedMood}
              className="w-full btn-primary disabled:opacity-50"
            >
              Log Mood
            </button>

            {wellnessData?.moodHistory.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Recent Mood History</h4>
                <div className="space-y-3">
                  {wellnessData.moodHistory.slice(0, 5).map(entry => (
                    <div key={entry.id} className="bg-black p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold capitalize">{entry.mood}</span>
                          <p className="text-sm text-gray-300">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {entry.mood === 'calm' && <Smile className="w-5 h-5 text-neon" />}
                        {entry.mood === 'neutral' && <Meh className="w-5 h-5 text-yellow-500" />}
                        {entry.mood === 'stressed' && <Frown className="w-5 h-5 text-red-500" />}
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-300 mt-2">{entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalWellnessModal;