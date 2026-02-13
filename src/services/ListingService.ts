import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Listing {
  id: string;
  userId: string;
  title: string;
  timestamp: Date;
  swapPreferences: string[];
  status: 'active' | 'pending' | 'completed';
  price: number;
  itemName: string;
  images: string[];
  description: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  category: string;
}

class ListingService {
  async createListing(listing: Omit<Listing, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...listing,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  async updateListing(id: string, updates: Partial<Listing>): Promise<void> {
    try {
      const docRef = doc(db, 'listings', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  async deleteListing(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  async getListing(id: string): Promise<Listing | null> {
    try {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Listing;
      }
      return null;
    } catch (error) {
      console.error('Error getting listing:', error);
      throw error;
    }
  }

  async getUserListings(userId: string): Promise<Listing[]> {
    try {
      const q = query(collection(db, 'listings'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Listing);
    } catch (error) {
      console.error('Error getting user listings:', error);
      throw error;
    }
  }
}

export default new ListingService();