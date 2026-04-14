'use client';
import { addDoc, collection, serverTimestamp, Firestore, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import type { CartItem, Product, SelectedConfiguration } from './types';

interface QuoteRequestPayload {
  userId: string;
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

export async function createQuoteRequest(
  firestore: Firestore,
  storage: FirebaseStorage,
  payload: QuoteRequestPayload
): Promise<string> {
  const { userId, product, quantity, configuration, basePrice, userNotes, file } = payload;

  let fileUrl: string | undefined = undefined;

  if (file) {
    const filePath = `user_uploads/${userId}/quote_requests/${Date.now()}-${file.name}`;
    const fileStorageRef = ref(storage, filePath);

    console.log(`Uploading quote file to: ${filePath}`);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);

    const uploadResult = await uploadBytes(fileStorageRef, file, { contentType: file.type });
    console.log("Quote file upload complete:", uploadResult);

    fileUrl = await getDownloadURL(uploadResult.ref);
    console.log("Quote file download URL:", fileUrl);
  }

  // Create a CartItem-like object to store in the quote
  const quoteItem: Omit<CartItem, 'id'> = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '', // Use the first image
      quantity: quantity,
      price: basePrice, // Store the base price at time of quote
      configuration: configuration,
  };


  const quotesCollectionRef = collection(firestore, 'quote_requests');
  
  const quoteData: any = {
    userId,
    items: [quoteItem],
    userNotes: userNotes || '',
    status: 'Pending Review',
    createdAt: serverTimestamp(),
  };

  if (fileUrl) {
    quoteData.fileUrl = fileUrl;
  }

  const newQuoteDoc = await addDoc(quotesCollectionRef, quoteData);

  return newQuoteDoc.id;
}


export async function updateUserQuoteStatus(
    firestore: Firestore,
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<void> {
    const quoteRef = doc(firestore, 'quote_requests', quoteId);
    await updateDoc(quoteRef, { status });
}
