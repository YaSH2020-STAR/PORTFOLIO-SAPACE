import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import AuthService, { AuthUser, AuthError, Profile } from '../services/AuthService';

type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Firebase Auth to initialize
    const unsubscribe = AuthService.onAuthStateChanged(async (currentUser) => {
      // Ensure auth is ready before proceeding
      await auth.authStateReady();
      
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await AuthService.getProfile(currentUser.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Error loading user profile:', err);
          setError('Error loading user profile');
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      await AuthService.register(email, password, name);
      navigate('/welcome');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await AuthService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await AuthService.logout();
      navigate('/');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await AuthService.resetPassword(email);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      await AuthService.updatePassword(password);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const value = {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};