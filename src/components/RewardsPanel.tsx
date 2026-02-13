import React from 'react';
import { Trophy } from 'lucide-react';
import RewardsService from '../services/RewardsService';

type RewardsPanelProps = {
  onClick: () => void;
};

const RewardsPanel = ({ onClick }: RewardsPanelProps) => {
  const rewardsData = RewardsService.getRewardsData();
  const nextReward = RewardsService.getNextReward();

  return (
    <button 
      onClick={onClick}
      className="w-full bg-gray-dark p-4 rounded-lg text-left hover:bg-gray-dark/80 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 text-neon mr-3" />
          <div>
            <span className="font-semibold">Rewards</span>
            <p className="text-sm text-gray-300">
              {rewardsData.totalPoints} points earned
            </p>
          </div>
        </div>
        {nextReward && (
          <div className="text-right">
            <span className="text-sm text-neon">Next Reward:</span>
            <p className="text-sm text-gray-300">
              {nextReward.name} ({nextReward.pointsCost - rewardsData.totalPoints} pts away)
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default RewardsPanel;