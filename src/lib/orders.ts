'use client';
import { addDoc, collection, serverTimestamp, Firestore, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import type { CartItem, PaymentMethod, ShippingAddress } from './types';

interface OrderPayload {
  userId: string;
  cart: CartItem[];
  totalPrice: number;
  notes?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  transactionId: string;
  hasRestrictedItem: boolean;
  legalAgreementFile?: File;
}

export async function createOrder(
  firestore: Firestore,
  storage: FirebaseStorage,
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
    hasRestrictedItem, 
    legalAgreementFile 
  } = payload;

  let legalAgreementUrl: string | undefined = undefined;
  let requiresLegalApproval = false;

  // Upload legal agreement if it exists
  if (hasRestrictedItem && legalAgreementFile) {
    const legalAgreementPath = `legal-agreements/${userId}/${Date.now()}-${legalAgreementFile.name}`;
    const legalStorageRef = ref(storage, legalAgreementPath);
    const legalUploadResult = await uploadBytes(legalStorageRef, legalAgreementFile);
    legalAgreementUrl = await getDownloadURL(legalUploadResult.ref);
    requiresLegalApproval = true;
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
    legalAgreementApproved: false,
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

    