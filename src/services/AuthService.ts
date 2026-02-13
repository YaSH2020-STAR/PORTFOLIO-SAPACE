import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type AuthUser = {
  id: string;
  email: string | null;
  emailVerified: boolean;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  tier: 'freemium' | 'premium';
  createdAt: Date;
  updatedAt: Date;
  tipsLeft?: number;
  lastTipDate?: Date;
};

export type AuthError = {
  code: string;
  message: string;
};

class AuthService {
  private convertFirebaseUser(user: FirebaseUser): AuthUser {
    return {
      id: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.convertFirebaseUser(userCredential.user);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      // Create Firebase auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        name,
        email,
        tier: 'freemium',
        tipsLeft: 5,
        lastTipDate: new Date(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Set the document with user's UID as the document ID
      await setDoc(doc(db, 'users', user.uid), userProfile);

      return this.convertFirebaseUser(user);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          email: data.email,
          tier: data.tier,
          tipsLeft: data.tipsLeft,
          lastTipDate: data.lastTipDate?.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        };
      }
      return null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userId: string, data: Partial<Profile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePassword(password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      await firebaseUpdatePassword(user, password);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? this.convertFirebaseUser(user) : null);
    });
  }

  private handleError(error: any): AuthError {
    console.error('Auth Error:', error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred'
    };
  }
}

export default new AuthService();