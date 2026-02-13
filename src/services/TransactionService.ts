import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Feedback {
  buyerComment?: string;
  buyerRating?: number;
  sellerComment?: string;
  sellerRating?: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  feedback?: Feedback;
  timestamp: Date;
}

class TransactionService {
  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'transactionHistory'), {
        ...transaction,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async addFeedback(transactionId: string, feedback: Feedback): Promise<void> {
    try {
      const docRef = doc(db, 'transactionHistory', transactionId);
      await updateDoc(docRef, {
        feedback,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const docRef = doc(db, 'transactionHistory', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Transaction;
      }
      return null;
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const buyerQuery = query(
        collection(db, 'transactionHistory'),
        where('buyerId', '==', userId)
      );
      const sellerQuery = query(
        collection(db, 'transactionHistory'),
        where('sellerId', '==', userId)
      );

      const [buyerSnap, sellerSnap] = await Promise.all([
        getDocs(buyerQuery),
        getDocs(sellerQuery)
      ]);

      const transactions = [
        ...buyerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Transaction),
        ...sellerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Transaction)
      ];

      return transactions;
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }
}

export default new TransactionService();