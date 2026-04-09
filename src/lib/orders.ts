'use client';
import { addDoc, collection, serverTimestamp, Firestore, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import type { CartItem } from './types';

interface OrderPayload {
  userId: string;
  cart: CartItem[];
  totalPrice: number;
  notes?: string;
  paymentProofFile: File;
  phoneNumber: string;
  hasRestrictedItem: boolean;
  legalAgreementFile?: File;
}

export async function createOrder(
  firestore: Firestore,
  storage: FirebaseStorage,
  payload: OrderPayload
): Promise<string> {
  const { userId, cart, totalPrice, notes, paymentProofFile, phoneNumber, hasRestrictedItem, legalAgreementFile } = payload;

  // 1. Upload payment proof to storage
  const paymentProofPath = `payment-proofs/${userId}/${Date.now()}-${paymentProofFile.name}`;
  const paymentStorageRef = ref(storage, paymentProofPath);
  const paymentUploadResult = await uploadBytes(paymentStorageRef, paymentProofFile);
  const paymentProofUrl = await getDownloadURL(paymentUploadResult.ref);

  let legalAgreementUrl: string | undefined = undefined;
  let requiresLegalApproval = false;

  // 2. Upload legal agreement if it exists
  if (hasRestrictedItem && legalAgreementFile) {
    const legalAgreementPath = `legal-agreements/${userId}/${Date.now()}-${legalAgreementFile.name}`;
    const legalStorageRef = ref(storage, legalAgreementPath);
    const legalUploadResult = await uploadBytes(legalStorageRef, legalAgreementFile);
    legalAgreementUrl = await getDownloadURL(legalUploadResult.ref);
    requiresLegalApproval = true;
  }


  // 3. Create order document in Firestore's top-level 'orders' collection
  const ordersCollectionRef = collection(firestore, 'orders');
  const newOrderDoc = await addDoc(ordersCollectionRef, {
    userId,
    items: cart,
    totalPrice,
    notes: notes || '',
    paymentProofUrl,
    legalAgreementUrl,
    requiresLegalApproval,
    legalAgreementApproved: false, // Default to not approved
    status: 'Pending Payment Proof',
    createdAt: serverTimestamp(),
  });
  
  // 4. Update user's phone number if it has changed
  const userDocRef = doc(firestore, 'users', userId);
  await updateDoc(userDocRef, { phoneNumber });


  return newOrderDoc.id;
}
