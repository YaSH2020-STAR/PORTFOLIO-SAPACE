import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import FastingService from '../services/FastingService';
import { FastingSession } from '../types/fasting';

const FastingWidget = () => {
  const [activeFast, setActiveFast] = useState<FastingSession | null>(null);
  const [elapsed, setElapsed] = useState<string>('0:00:00');
  const [remaining, setRemaining] = useState<string>('0:00:00');

  useEffect(() => {
    const loadActiveFast = () => {
      const fast = FastingService.getActiveFast();
      setActiveFast(fast);
    };

    loadActiveFast();
    const interval = setInterval(loadActiveFast, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeFast) return;

    const updateTimes = () => {
      const start = new Date(activeFast.startTime).getTime();
      const now = new Date().getTime();
      const planned = activeFast.plannedDuration * 60 * 60 * 1000;
      const end = start + planned;

      const elapsedMs = now - start;
      const remainingMs = Math.max(0, end - now);

      setElapsed(formatDuration(elapsedMs));
      setRemaining(formatDuration(remainingMs));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [activeFast]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!activeFast) return null;

  return (
    <div className="bg-black p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-neon" />
          Active Fast
        </h3>
        <span className="text-neon">{activeFast.type}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Elapsed:</span>
          <span>{elapsed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Remaining:</span>
          <span>{remaining}</span>
        </div>
      </div>
    </div>
  );
};

export default FastingWidget;