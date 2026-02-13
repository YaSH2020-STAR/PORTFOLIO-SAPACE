import { FastingSession, FastingType } from '../types/fasting';

class FastingService {
  private readonly STORAGE_KEY = 'fasting_data';
  private readonly ACTIVE_FAST_KEY = 'active_fast';

  private getStorageData(): { history: FastingSession[], activeFast: FastingSession | null } {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const activeStored = localStorage.getItem(this.ACTIVE_FAST_KEY);
    
    return {
      history: stored ? JSON.parse(stored) : [],
      activeFast: activeStored ? JSON.parse(activeStored) : null
    };
  }

  private saveStorageData(history: FastingSession[], activeFast: FastingSession | null): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    if (activeFast) {
      localStorage.setItem(this.ACTIVE_FAST_KEY, JSON.stringify(activeFast));
    } else {
      localStorage.removeItem(this.ACTIVE_FAST_KEY);
    }
  }

  startFast(type: FastingType, plannedDuration: number, notes?: string): FastingSession {
    const { history, activeFast } = this.getStorageData();
    
    if (activeFast) {
      throw new Error('A fast is already in progress');
    }

    const newFast: FastingSession = {
      id: crypto.randomUUID(),
      type,
      startTime: new Date().toISOString(),
      plannedDuration,
      notes,
      status: 'active'
    };

    this.saveStorageData(history, newFast);
    return newFast;
  }

  endFast(id: string, notes?: string): FastingSession {
    const { history, activeFast } = this.getStorageData();
    
    if (!activeFast || activeFast.id !== id) {
      throw new Error('No active fast found with this ID');
    }

    const endedFast: FastingSession = {
      ...activeFast,
      endTime: new Date().toISOString(),
      status: 'completed',
      notes: notes || activeFast.notes
    };

    const updatedHistory = [...history, endedFast];
    this.saveStorageData(updatedHistory, null);
    return endedFast;
  }

  getActiveFast(): FastingSession | null {
    const { activeFast } = this.getStorageData();
    return activeFast;
  }

  getFastingHistory(): FastingSession[] {
    const { history } = this.getStorageData();
    return history.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  updateFast(id: string, updates: Partial<FastingSession>): FastingSession {
    const { history, activeFast } = this.getStorageData();
    
    if (activeFast?.id === id) {
      const updatedFast = { ...activeFast, ...updates };
      this.saveStorageData(history, updatedFast);
      return updatedFast;
    }

    const updatedHistory = history.map(fast => 
      fast.id === id ? { ...fast, ...updates } : fast
    );
    this.saveStorageData(updatedHistory, activeFast);
    return updatedHistory.find(fast => fast.id === id)!;
  }

  deleteFast(id: string): void {
    const { history, activeFast } = this.getStorageData();
    
    if (activeFast?.id === id) {
      this.saveStorageData(history, null);
      return;
    }

    const updatedHistory = history.filter(fast => fast.id !== id);
    this.saveStorageData(updatedHistory, activeFast);
  }
}

export default new FastingService();