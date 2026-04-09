'use client';

import {
  collectionGroup,
  getDocs,
  query as firestoreQuery,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  Firestore,
  collection,
} from 'firebase/firestore';
import type { Order, UserProfile, OrderWithUserData, UserWithId } from './types';

// Helper function to get user profiles for a set of user IDs
async function getUserProfiles(firestore: Firestore, userIds: string[]): Promise<Map<string, UserProfile>> {
  const userProfiles = new Map<string, UserProfile>();
  const userIdsToFetch = Array.from(new Set(userIds)); // Deduplicate

  // Firestore 'in' queries are limited to 30 items. 
  // For a larger scale app, this would need batching.
  if (userIdsToFetch.length > 0) {
    const userDocs = await Promise.all(userIdsToFetch.map(id => getDoc(doc(firestore, 'users', id))));
    userDocs.forEach(userDoc => {
      if (userDoc.exists()) {
        userProfiles.set(userDoc.id, userDoc.data() as UserProfile);
      }
    });
  }

  return userProfiles;
}


export async function getAllOrders(firestore: Firestore): Promise<OrderWithUserData[]> {
  const ordersQuery = firestoreQuery(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(ordersQuery);

  const orders = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];

  const userIds = orders.map(order => order.userId);
  const userProfiles = await getUserProfiles(firestore, userIds);

  const ordersWithUserData: OrderWithUserData[] = orders.map(order => {
    const userProfile = userProfiles.get(order.userId);
    return {
      ...order,
      user: {
        id: order.userId,
        name: userProfile?.name || 'Unknown User',
        email: userProfile?.email || 'N/A',
        phoneNumber: userProfile?.phoneNumber || 'N/A',
      }
    };
  });
  
  return ordersWithUserData;
}

export async function updateOrderStatus(
    firestore: Firestore,
    orderId: string,
    status: Order['status']
): Promise<void> {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { status });
}

export async function approveLegalAgreement(
    firestore: Firestore,
    orderId: string
): Promise<void> {
    const orderRef = doc(firestore, 'orders', orderId);
    await updateDoc(orderRef, { legalAgreementApproved: true });
}


export async function getAllUsers(firestore: Firestore): Promise<UserWithId[]> {
    const usersQuery = firestoreQuery(collection(firestore, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as UserProfile),
    }));
}

export async function updateUserRole(
    firestore: Firestore,
    userId: string,
    role: UserProfile['role']
): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { role });
}
