export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// A robust check to ensure Firebase environment variables are configured.
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
    throw new Error(
        'ACTION REQUIRED: Your Firebase configuration is incomplete or incorrect. Please ensure you have a `.env.local` file in your project root with the correct `NEXT_PUBLIC_` prefixes for all Firebase variables. Copy the contents of the `.env` template file, fill in your actual Firebase project credentials, and restart your development server.'
    );
}
