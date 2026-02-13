import { MoodEntry, WellnessData, ZenGardenItem, MoodType } from '../types/wellness';

class WellnessService {
  private readonly STORAGE_KEY = 'wellness_data';

  private getStorageData(): WellnessData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return {
        moodHistory: [],
        zenGarden: this.getInitialZenGarden(),
        streak: {
          currentStreak: 0,
          lastCompletedDate: '',
          totalDays: 0
        }
      };
    }
    return JSON.parse(stored);
  }

  private saveStorageData(data: WellnessData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private getInitialZenGarden(): ZenGardenItem[] {
    return [
      { id: '1', type: 'tree', position: { x: 20, y: 20 }, unlocked: true },
      { id: '2', type: 'flower', position: { x: 40, y: 30 }, unlocked: false },
      { id: '3', type: 'water', position: { x: 60, y: 40 }, unlocked: false }
    ];
  }

  logMood(mood: MoodType, notes?: string): MoodEntry {
    const data = this.getStorageData();
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      mood,
      notes
    };
    
    data.moodHistory = [entry, ...data.moodHistory];
    this.saveStorageData(data);
    return entry;
  }

  getMoodHistory(): MoodEntry[] {
    return this.getStorageData().moodHistory;
  }

  completeWellnessActivity(type: 'meditation' | 'journal'): void {
    const data = this.getStorageData();
    const today = new Date().toISOString().split('T')[0];
    
    if (type === 'meditation') {
      data.lastMeditationDate = today;
    } else {
      data.lastJournalDate = today;
    }

    // Update streak
    const lastDate = new Date(data.streak.lastCompletedDate);
    const currentDate = new Date();
    const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      data.streak.currentStreak++;
    } else if (dayDiff > 1) {
      data.streak.currentStreak = 1;
    }

    data.streak.lastCompletedDate = today;
    data.streak.totalDays++;

    // Unlock new garden items based on streak
    if (data.streak.currentStreak === 3) {
      data.zenGarden = data.zenGarden.map(item => 
        item.id === '2' ? { ...item, unlocked: true } : item
      );
    } else if (data.streak.currentStreak === 7) {
      data.zenGarden = data.zenGarden.map(item => 
        item.id === '3' ? { ...item, unlocked: true } : item
      );
    }

    this.saveStorageData(data);
  }

  getWellnessData(): WellnessData {
    return this.getStorageData();
  }
}

export default new WellnessService();