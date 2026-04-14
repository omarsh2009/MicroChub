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
    try {
        console.log("Current user ID for quote:", userId);
        console.log("File to upload for quote:", file);

        let contentType = file.type;
        if (!contentType || contentType === "") {
            if (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (file.name.endsWith(".png")) {
                contentType = "image/png";
            } else if (file.name.endsWith(".webp")) {
                contentType = "image/webp";
            } else if (file.name.endsWith(".pdf")) {
                contentType = "application/pdf";
            }
        }
        console.log("Final contentType for quote:", contentType);
        
        const filePath = `user_uploads/${userId}/quote_requests/${Date.now()}-${file.name}`;
        const fileStorageRef = ref(storage, filePath);

        console.log("Starting quote file upload to path:", filePath);
        const uploadResult = await uploadBytes(fileStorageRef, file, { contentType });
        console.log("Quote file upload complete:", uploadResult);

        console.log("Getting quote file download URL...");
        fileUrl = await getDownloadURL(uploadResult.ref);
        console.log("Quote file download URL obtained:", fileUrl);
    } catch (uploadError) {
        console.error("FULL QUOTE UPLOAD ERROR:", uploadError);
        // Re-throw the error so the calling component can handle it and show a toast.
        throw uploadError;
    }
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
