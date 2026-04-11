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
  serverTimestamp,
  addDoc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import type { Order, UserProfile, OrderWithUserData, UserWithId, QuoteRequest, QuoteRequestWithUserData, PaymentMethod } from './types';

// Helper function to get user profiles for a set of user IDs
async function getUserProfiles(firestore: Firestore, userIds: string[]): Promise<Map<string, UserProfile>> {
  const userProfiles = new Map<string, UserProfile>();
  const userIdsToFetch = Array.from(new Set(userIds)); // Deduplicate

  if (userIdsToFetch.length > 0) {
    // Firestore 'in' queries are limited to 30 items at a time.
    // Batch the requests if necessary.
    const batches = [];
    for (let i = 0; i < userIdsToFetch.length; i += 30) {
        batches.push(userIdsToFetch.slice(i, i + 30));
    }

    for (const batch of batches) {
        const q = firestoreQuery(collection(firestore, 'users'), where('id', 'in', batch));
        const userDocsSnapshot = await getDocs(q);
        userDocsSnapshot.forEach(userDoc => {
            userProfiles.set(userDoc.id, userDoc.data() as UserProfile);
        });
    }
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

export async function getAllQuoteRequests(firestore: Firestore): Promise<QuoteRequestWithUserData[]> {
  const quotesQuery = firestoreQuery(collection(firestore, 'quote_requests'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(quotesQuery);

  const quotes = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as QuoteRequest[];

  const userIds = quotes.map(quote => quote.userId);
  const userProfiles = await getUserProfiles(firestore, userIds);

  const quotesWithUserData: QuoteRequestWithUserData[] = quotes.map(quote => {
    const userProfile = userProfiles.get(quote.userId);
    return {
      ...quote,
      user: {
        id: quote.userId,
        name: userProfile?.name || 'Unknown User',
        email: userProfile?.email || 'N/A',
        phoneNumber: userProfile?.phoneNumber || 'N/A',
      }
    };
  });
  
  return quotesWithUserData;
}

export async function submitQuote(
  firestore: Firestore,
  quoteId: string,
  price: number,
  notes: string,
): Promise<void> {
  const quoteRef = doc(firestore, 'quote_requests', quoteId);
  await updateDoc(quoteRef, {
    status: 'Quoted',
    quotedPrice: price,
    adminNotes: notes,
    quotedAt: serverTimestamp(),
  });
}

// Payment Methods
export async function getPaymentMethods(firestore: Firestore): Promise<PaymentMethod[]> {
  const methodsQuery = firestoreQuery(collection(firestore, 'payment_methods'), orderBy('name'));
  const querySnapshot = await getDocs(methodsQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
}

export async function addPaymentMethod(firestore: Firestore, data: Omit<PaymentMethod, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(firestore, 'payment_methods'), data);
  return docRef.id;
}

export async function updatePaymentMethod(firestore: Firestore, id: string, data: Partial<PaymentMethod>): Promise<void> {
  const methodRef = doc(firestore, 'payment_methods', id);
  await updateDoc(methodRef, data);
}

export async function deletePaymentMethod(firestore: Firestore, id: string): Promise<void> {
  const methodRef = doc(firestore, 'payment_methods', id);
  await deleteDoc(methodRef);
}

    