import React, { useState, useEffect } from 'react';
import { X, Clock, Droplet, Coffee, Ban, Plus, History, Edit2, Trash2 } from 'lucide-react';
import FastingService from '../services/FastingService';
import { FastingSession, FastingType } from '../types/fasting';

type FastingTrackerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

const FastingTrackerModal = ({ isOpen, onClose, isPremium }: FastingTrackerModalProps) => {
  const [view, setView] = useState<'start' | 'history'>('start');
  const [activeFast, setActiveFast] = useState<FastingSession | null>(null);
  const [history, setHistory] = useState<FastingSession[]>([]);
  const [fastingType, setFastingType] = useState<FastingType>('water');
  const [customType, setCustomType] = useState('');
  const [plannedDuration, setPlannedDuration] = useState(16);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadFastingData();
    }
  }, [isOpen]);

  const loadFastingData = () => {
    setActiveFast(FastingService.getActiveFast());
    setHistory(FastingService.getFastingHistory());
  };

  const handleStartFast = () => {
    try {
      const newFast = FastingService.startFast(
        fastingType === 'custom' ? customType as FastingType : fastingType,
        plannedDuration,
        notes
      );
      setActiveFast(newFast);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start fast');
    }
  };

  const handleEndFast = () => {
    if (!activeFast) return;
    
    try {
      FastingService.endFast(activeFast.id, notes);
      loadFastingData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end fast');
    }
  };

  const formatDuration = (hours: number) => {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  };

  const getFastingTypeIcon = (type: FastingType) => {
    switch (type) {
      case 'water':
        return <Droplet className="w-5 h-5" />;
      case 'water-coffee':
        return <Coffee className="w-5 h-5" />;
      case 'dry':
        return <Ban className="w-5 h-5" />;
      default:
        return <Plus className="w-5 h-5" />;
    }
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Fasting Tracker</h2>
          <button
            onClick={() => setView(view === 'start' ? 'history' : 'start')}
            className="text-neon hover:underline flex items-center gap-2"
          >
            {view === 'start' ? (
              <>
                <History className="w-5 h-5" />
                View History
              </>
            ) : (
              <>
                <Clock className="w-5 h-5" />
                Track Fast
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {view === 'start' ? (
          <div className="space-y-6">
            {activeFast ? (
              <div className="bg-black p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Active Fast</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Type:</span>
                    <span className="flex items-center gap-2">
                      {getFastingTypeIcon(activeFast.type)}
                      {activeFast.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Started:</span>
                    <span>{new Date(activeFast.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Planned Duration:</span>
                    <span>{formatDuration(activeFast.plannedDuration)}</span>
                  </div>
                  {activeFast.notes && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-gray-300">{activeFast.notes}</p>
                    </div>
                  )}
                  <button
                    onClick={handleEndFast}
                    className="w-full btn-primary mt-4"
                  >
                    End Fast
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-4">Select Fast Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { type: 'water', label: 'Water Only' },
                      { type: 'water-coffee', label: 'Water & Coffee' },
                      { type: 'dry', label: 'Dry Fast' },
                      { type: 'custom', label: 'Custom' }
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => setFastingType(type as FastingType)}
                        className={`p-4 rounded-lg flex items-center gap-3 ${
                          fastingType === type
                            ? 'bg-neon text-black'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {getFastingTypeIcon(type as FastingType)}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {fastingType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Fast Type
                    </label>
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                      placeholder="Enter custom fast type..."
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-4">Planned Duration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[12, 16, 18, 24].map(hours => (
                      <button
                        key={hours}
                        onClick={() => setPlannedDuration(hours)}
                        className={`p-4 rounded-lg ${
                          plannedDuration === hours
                            ? 'bg-neon text-black'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {formatDuration(hours)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-transparent text-white"
                    rows={3}
                    placeholder="Add any notes about your fast..."
                  />
                </div>

                <button
                  onClick={handleStartFast}
                  disabled={fastingType === 'custom' && !customType.trim()}
                  className="w-full btn-primary"
                >
                  Start Fast
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-gray-300 py-8">
                No fasting history yet. Start your first fast!
              </p>
            ) : (
              history.map(fast => (
                <div key={fast.id} className="bg-black p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getFastingTypeIcon(fast.type)}
                        <span className="font-semibold">{fast.type}</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {new Date(fast.startTime).toLocaleString()}
                      </p>
                      {fast.endTime && (
                        <p className="text-sm text-gray-300">
                          Duration: {formatDuration(fast.plannedDuration)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Edit functionality
                        }}
                        className="p-2 hover:text-neon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => FastingService.deleteFast(fast.id)}
                        className="p-2 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {fast.notes && (
                    <p className="text-sm text-gray-300 mt-2">{fast.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FastingTrackerModal;