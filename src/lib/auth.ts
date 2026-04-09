import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  values: { name: string; email: string; password: string; phoneNumber: string }
) {
  const { name, email, password, phoneNumber } = values;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const userProfile = {
    name,
    email,
    phoneNumber,
    wishlist: [],
  };

  // Use setDoc with the user's UID as the document ID
  await setDoc(doc(firestore, 'users', user.uid), userProfile);

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
