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
}

export async function createOrder(
  firestore: Firestore,
  storage: FirebaseStorage,
  payload: OrderPayload
): Promise<string> {
  const { userId, cart, totalPrice, notes, paymentProofFile, phoneNumber } = payload;

  // 1. Upload payment proof to storage
  const filePath = `payment-proofs/${userId}/${Date.now()}-${paymentProofFile.name}`;
  const storageRef = ref(storage, filePath);
  const uploadResult = await uploadBytes(storageRef, paymentProofFile);
  const paymentProofUrl = await getDownloadURL(uploadResult.ref);

  // 2. Create order document in Firestore
  const ordersCollectionRef = collection(firestore, 'users', userId, 'orders');
  const newOrderDoc = await addDoc(ordersCollectionRef, {
    userId,
    items: cart,
    totalPrice,
    notes: notes || '',
    paymentProofUrl,
    status: 'Pending Payment Proof',
    createdAt: serverTimestamp(),
  });
  
  // 3. Update user's phone number if it has changed
  const userDocRef = doc(firestore, 'users', userId);
  await updateDoc(userDocRef, { phoneNumber });


  return newOrderDoc.id;
}
