'use client';
import { addDoc, collection, serverTimestamp, Firestore, doc, updateDoc } from 'firebase/firestore';
import type { CartItem, PaymentMethod, ShippingAddress } from './types';
import { uploadFile } from './supabase';

interface OrderPayload {
  userId: string;
  cart: CartItem[];
  totalPrice: number;
  notes?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  transactionId: string;
  requiresLegalApproval: boolean;
  legalAgreementFile?: File;
}

export async function createOrder(
  firestore: Firestore,
  payload: OrderPayload
): Promise<string> {
  const { 
    userId, 
    cart, 
    totalPrice, 
    notes, 
    shippingAddress, 
    paymentMethod,
    transactionId,
    requiresLegalApproval, 
    legalAgreementFile 
  } = payload;

  let legalAgreementUrl: string | undefined = undefined;

  if (requiresLegalApproval && legalAgreementFile) {
    // Upload the file to Supabase and get the public URL
    legalAgreementUrl = await uploadFile(legalAgreementFile, userId);
  } else if (requiresLegalApproval && !legalAgreementFile) {
    throw new Error("A signed legal agreement is required for restricted items.");
  }


  // Create order document in Firestore's top-level 'orders' collection
  const ordersCollectionRef = collection(firestore, 'orders');

  const orderData: any = {
    userId,
    items: cart,
    totalPrice,
    notes: notes || '',
    shippingAddress,
    paymentMethod: {
      id: paymentMethod.id,
      name: paymentMethod.name,
    },
    transactionId,
    requiresLegalApproval,
    legalAgreementApproved: false, // This is always false on creation
    status: 'Pending Verification',
    createdAt: serverTimestamp(),
  };

  if (legalAgreementUrl) {
    orderData.legalAgreementUrl = legalAgreementUrl;
  }
  
  const newOrderDoc = await addDoc(ordersCollectionRef, orderData);
  
  // Update user's phone number if it has changed
  const userDocRef = doc(firestore, 'users', userId);
  await updateDoc(userDocRef, { phoneNumber: shippingAddress.phoneNumber });


  return newOrderDoc.id;
}
