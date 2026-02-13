import { RewardsData, RewardActivity, Reward } from '../types/rewards';

class RewardsService {
  private readonly STORAGE_KEY = 'rewards_data';
  private readonly POINTS_MAP = {
    workout: 10,
    meal: 5,
    fasting: 5,
    chat: 3
  };

  private readonly AVAILABLE_REWARDS: Reward[] = [
    {
      id: 'tshirt',
      name: 'So Fire T-Shirt',
      description: 'Exclusive So Fire Fitness branded t-shirt',
      pointsCost: 100,
      type: 'item',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80'
    },
    {
      id: 'premium_week',
      name: 'Free Premium Week',
      description: '7 days of premium access',
      pointsCost: 150,
      type: 'feature'
    },
    {
      id: 'personal_training',
      name: 'Personal Training Session',
      description: '1-hour virtual personal training session',
      pointsCost: 200,
      type: 'feature'
    },
    {
      id: 'discount_50',
      name: '50% Off Premium',
      description: 'Half off your next month of premium',
      pointsCost: 300,
      type: 'discount'
    }
  ];

  private getStorageData(): RewardsData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return {
        totalPoints: 0,
        activities: [],
        redeemedRewards: [],
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(stored);
  }

  private saveStorageData(data: RewardsData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  addActivity(type: keyof typeof this.POINTS_MAP, description: string): RewardActivity {
    const data = this.getStorageData();
    const points = this.POINTS_MAP[type];
    
    const activity: RewardActivity = {
      id: crypto.randomUUID(),
      type,
      points,
      timestamp: new Date().toISOString(),
      description
    };

    data.activities = [activity, ...data.activities];
    data.totalPoints += points;
    data.lastUpdated = new Date().toISOString();

    this.saveStorageData(data);
    return activity;
  }

  getRewardsData(): RewardsData {
    return this.getStorageData();
  }

  getAvailableRewards(): Reward[] {
    return this.AVAILABLE_REWARDS;
  }

  getNextReward(): Reward | null {
    const data = this.getStorageData();
    return this.AVAILABLE_REWARDS.find(reward => 
      !data.redeemedRewards.includes(reward.id) && 
      reward.pointsCost > data.totalPoints
    ) || null;
  }

  redeemReward(rewardId: string): boolean {
    const data = this.getStorageData();
    const reward = this.AVAILABLE_REWARDS.find(r => r.id === rewardId);

    if (!reward || data.redeemedRewards.includes(rewardId) || data.totalPoints < reward.pointsCost) {
      return false;
    }

    data.redeemedRewards.push(rewardId);
    data.totalPoints -= reward.pointsCost;
    data.lastUpdated = new Date().toISOString();

    this.saveStorageData(data);
    return true;
  }
}

export default new RewardsService();