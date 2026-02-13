export type RewardActivity = {
  id: string;
  type: 'workout' | 'meal' | 'fasting' | 'chat';
  points: number;
  timestamp: string;
  description: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'item' | 'discount' | 'feature';
  imageUrl?: string;
};

export type RewardsData = {
  totalPoints: number;
  activities: RewardActivity[];
  redeemedRewards: string[]; // Array of reward IDs
  lastUpdated: string;
};