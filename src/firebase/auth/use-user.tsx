'use client';

import {useState, useEffect} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {doc, getDoc, Firestore} from 'firebase/firestore';
import {useAuth, useFirestore} from '../provider';
import type { UserProfile } from '@/lib/types';


export interface UserData extends User {
    profile: UserProfile | null;
}

export const useUser = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<UserData | null | undefined>(undefined);

  useEffect(() => {
    if (!auth || !firestore) return;

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userProfile = await fetchUserProfile(firestore, authUser.uid);
        setUser({ ...authUser, profile: userProfile });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return user;
};

async function fetchUserProfile(firestore: Firestore, uid: string): Promise<UserProfile | null> {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data() as UserProfile;
        }
        console.warn(`No user profile found for UID: ${uid}`);
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}
