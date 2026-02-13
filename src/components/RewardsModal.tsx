import React, { useState } from 'react';
import { X, Trophy, Clock, Gift, Star } from 'lucide-react';
import RewardsService from '../services/RewardsService';
import { RewardActivity, Reward } from '../types/rewards';

type RewardsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
};

const RewardsModal = ({ isOpen, onClose, isPremium }: RewardsModalProps) => {
  const [view, setView] = useState<'summary' | 'history' | 'redeem'>('summary');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const rewardsData = RewardsService.getRewardsData();
  const availableRewards = RewardsService.getAvailableRewards();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    if (rewardsData.totalPoints >= reward.pointsCost) {
      const success = RewardsService.redeemReward(reward.id);
      setRedeemStatus(success ? 'success' : 'error');
      setTimeout(() => {
        setRedeemStatus('idle');
        setSelectedReward(null);
      }, 2000);
    }
  };

  const getActivityIcon = (activity: RewardActivity) => {
    switch (activity.type) {
      case 'workout':
        return Trophy;
      case 'meal':
        return Star;
      case 'fasting':
        return Clock;
      case 'chat':
        return Gift;
      default:
        return Star;
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Rewards Dashboard</h2>
          <div className="flex items-center space-x-4">
            <Trophy className="w-6 h-6 text-neon" />
            <span className="text-xl font-bold">{rewardsData.totalPoints} pts</span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('summary')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              view === 'summary' ? 'bg-neon text-black' : 'bg-black text-white'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              view === 'history' ? 'bg-neon text-black' : 'bg-black text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setView('redeem')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
              view === 'redeem' ? 'bg-neon text-black' : 'bg-black text-white'
            }`}
          >
            Redeem
          </button>
        </div>

        {view === 'summary' && (
          <div className="space-y-6">
            <div className="bg-black p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">How to Earn Points</h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span>Complete a workout</span>
                  <span className="text-neon">+10 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Log your meals</span>
                  <span className="text-neon">+5 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Track fasting</span>
                  <span className="text-neon">+5 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Use AI Coach</span>
                  <span className="text-neon">+3 pts</span>
                </li>
              </ul>
            </div>

            <div className="bg-black p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Next Reward</h3>
              {RewardsService.getNextReward() ? (
                <div>
                  <p className="text-gray-300 mb-2">
                    {RewardsService.getNextReward()?.name}
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-neon h-full rounded-full"
                      style={{ 
                        width: `${Math.min(100, (rewardsData.totalPoints / (RewardsService.getNextReward()?.pointsCost || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-300 mt-2">
                    {rewardsData.totalPoints} / {RewardsService.getNextReward()?.pointsCost} points
                  </p>
                </div>
              ) : (
                <p className="text-gray-300">
                  You've unlocked all available rewards!
                </p>
              )}
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-4">
            {rewardsData.activities.length === 0 ? (
              <p className="text-center text-gray-300 py-8">
                No activities yet. Start earning points!
              </p>
            ) : (
              rewardsData.activities.map(activity => {
                const Icon = getActivityIcon(activity);
                return (
                  <div 
                    key={activity.id}
                    className="bg-black p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon className="w-5 h-5 text-neon" />
                      <div>
                        <p className="font-semibold">{activity.description}</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                    <span className="text-neon">+{activity.points} pts</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {view === 'redeem' && (
          <div className="grid grid-cols-2 gap-4">
            {availableRewards.map(reward => {
              const isRedeemed = rewardsData.redeemedRewards.includes(reward.id);
              const canRedeem = rewardsData.totalPoints >= reward.pointsCost;
              
              return (
                <div 
                  key={reward.id}
                  className={`bg-black p-4 rounded-lg ${
                    isRedeemed ? 'opacity-50' : ''
                  }`}
                >
                  {reward.imageUrl && (
                    <img
                      src={reward.imageUrl}
                      alt={reward.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-bold mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-neon">{reward.pointsCost} pts</span>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={isRedeemed || !canRedeem}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isRedeemed
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : canRedeem
                          ? 'bg-neon text-black hover:bg-opacity-90'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isRedeemed ? 'Redeemed' : canRedeem ? 'Redeem' : 'Not Enough Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedReward && redeemStatus !== 'idle' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-dark p-8 rounded-lg text-center">
              {redeemStatus === 'success' ? (
                <>
                  <Trophy className="w-16 h-16 text-neon mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Reward Redeemed!</h3>
                  <p className="text-gray-300">
                    You've successfully redeemed {selectedReward.name}
                  </p>
                </>
              ) : (
                <>
                  <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Redemption Failed</h3>
                  <p className="text-gray-300">
                    Please try again later
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsModal;