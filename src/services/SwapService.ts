import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SwapMessage {
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface SwapRequest {
  id: string;
  requestId: string;
  requestedItemId: string;
  offeredItemId: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  messages: SwapMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class SwapService {
  async createSwapRequest(request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'swapRequests'), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating swap request:', error);
      throw error;
    }
  }

  async updateSwapRequest(id: string, updates: Partial<SwapRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'swapRequests', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating swap request:', error);
      throw error;
    }
  }

  async addMessage(requestId: string, message: Omit<SwapMessage, 'timestamp'>): Promise<void> {
    try {
      const docRef = doc(db, 'swapRequests', requestId);
      await updateDoc(docRef, {
        messages: arrayUnion({
          ...message,
          timestamp: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  async getSwapRequest(id: string): Promise<SwapRequest | null> {
    try {
      const docRef = doc(db, 'swapRequests', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SwapRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting swap request:', error);
      throw error;
    }
  }

  async getUserSwapRequests(userId: string): Promise<SwapRequest[]> {
    try {
      const q = query(
        collection(db, 'swapRequests'),
        where('senderId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SwapRequest);
    } catch (error) {
      console.error('Error getting user swap requests:', error);
      throw error;
    }
  }
}

export default new SwapService();