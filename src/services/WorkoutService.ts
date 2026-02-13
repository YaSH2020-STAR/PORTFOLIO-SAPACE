import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  intensity: 'low' | 'medium' | 'high';
}

export interface WorkoutDay {
  isWorkout: boolean;
  type?: string;
  exercises?: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  days: Record<string, WorkoutDay>;
  goal: string;
  experience: string;
  equipment: string[];
  preferences: string[];
  duration: string;
  focus: string[];
  createdAt: Date;
  updatedAt: Date;
}

class WorkoutService {
  async createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'workoutPlans'), {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error;
    }
  }

  async updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>): Promise<void> {
    try {
      const docRef = doc(db, 'workoutPlans', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error;
    }
  }

  async getWorkoutPlan(id: string): Promise<WorkoutPlan | null> {
    try {
      const docRef = doc(db, 'workoutPlans', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as WorkoutPlan;
      }
      return null;
    } catch (error) {
      console.error('Error getting workout plan:', error);
      throw error;
    }
  }

  async getUserWorkoutPlan(userId: string): Promise<WorkoutPlan | null> {
    try {
      const q = query(collection(db, 'workoutPlans'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as WorkoutPlan;
      }
      return null;
    } catch (error) {
      console.error('Error getting user workout plan:', error);
      throw error;
    }
  }
}

export default new WorkoutService();