'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { CampusUser } from '@/types';

interface AuthContextType {
  currentUser: CampusUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  toggleFavoriteEvent: (eventId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  firebaseUser: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: async () => {},
  toggleFavoriteEvent: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<CampusUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync real Firebase auth state with Firestore user document
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setFirebaseUser(user);
        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              setCurrentUser({
                id: user.uid,
                name: data.name || user.displayName || user.email?.split('@')[0] || 'Student',
                email: data.email || user.email || '',
                avatarURL: data.avatarURL || user.photoURL || '',
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                favoriteEvents: data.favoriteEvents || []
              });
            } else {
              const newUser: CampusUser = {
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'Student',
                email: user.email || '',
                avatarURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
                favoriteEvents: []
              };
              await setDoc(userRef, {
                ...newUser,
                createdAt: new Date()
              });
              setCurrentUser(newUser);
            }
          } catch {
            setCurrentUser({
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Student',
              email: user.email || '',
              avatarURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              favoriteEvents: []
            });
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in' };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const userRef = doc(db, 'users', cred.user.uid);
      const newUser: CampusUser = {
        id: cred.user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        favoriteEvents: []
      };
      await setDoc(userRef, {
        ...newUser,
        createdAt: new Date()
      });
      setCurrentUser(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to register' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const newUser: CampusUser = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Student',
          email: user.email || '',
          avatarURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          favoriteEvents: []
        };
        await setDoc(userRef, {
          ...newUser,
          createdAt: new Date()
        });
        setCurrentUser(newUser);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign-in cancelled or failed' };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const toggleFavoriteEvent = async (eventId: string) => {
    if (!currentUser) return;
    const isFav = currentUser.favoriteEvents?.includes(eventId);
    const updatedFavorites = isFav 
      ? (currentUser.favoriteEvents || []).filter(id => id !== eventId)
      : [...(currentUser.favoriteEvents || []), eventId];

    setCurrentUser({
      ...currentUser,
      favoriteEvents: updatedFavorites
    });

    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          favoriteEvents: isFav ? arrayRemove(eventId) : arrayUnion(eventId)
        });
      } catch (err) {
        console.warn('Failed to update favorite in Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
      toggleFavoriteEvent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
