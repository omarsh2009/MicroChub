import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { type SignUpFormValues } from '@/app/signup/page';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  values: SignUpFormValues
) {
  const { name, email, password, phoneNumber } = values;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const userProfile = {
    id: user.uid,
    name,
    email,
    phoneNumber,
    wishlist: [],
    role: 'user' as const,
  };

  const userDocRef = doc(firestore, 'users', user.uid);

  // Use setDoc with a .catch block for proper error handling
  setDoc(userDocRef, userProfile).catch((serverError) => {
    // This will create a rich, contextual error for the developer overlay
    const permissionError = new FirestorePermissionError({
      path: userDocRef.path,
      operation: 'create',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
  });

  return user;
}

export async function signInWithEmail(
  auth: Auth,
  values: { email: string; password: string }
) {
  const { email, password } = values;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOut(auth: Auth) {
  await firebaseSignOut(auth);
}
