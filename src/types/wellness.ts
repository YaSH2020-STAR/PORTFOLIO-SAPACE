export type MoodType = 'calm' | 'neutral' | 'stressed';

export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: MoodType;
  notes?: string;
}

export interface ZenGardenItem {
  id: string;
  type: 'tree' | 'flower' | 'water';
  position: { x: number; y: number };
  unlocked: boolean;
}

export interface WellnessStreak {
  currentStreak: number;
  lastCompletedDate: string;
  totalDays: number;
}

export interface WellnessData {
  moodHistory: MoodEntry[];
  zenGarden: ZenGardenItem[];
  streak: WellnessStreak;
  lastMeditationDate?: string;
  lastJournalDate?: string;
}