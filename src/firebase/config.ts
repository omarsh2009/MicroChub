'use client';
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// A robust check to ensure Firebase environment variables are configured.
const requiredKeys: (keyof typeof firebaseConfig)[] = ['apiKey', 'projectId', 'appId', 'authDomain'];
const missingOrPlaceholderKeys = requiredKeys.filter(key => {
    const value = firebaseConfig[key];
    return !value || value.includes('YOUR_');
});

if (missingOrPlaceholderKeys.length > 0) {
    throw new Error(
        `STOP! Your Firebase environment variables are not configured correctly. The following keys are missing or using placeholder values: ${missingOrPlaceholderKeys.join(', ')}. \n\n--- PLEASE FOLLOW THESE STEPS ---\n1. Create a file named '.env.local' in the root of your project.\n2. Copy all content from the '.env' template file into '.env.local'.\n3. Replace the placeholder values (e.g., 'YOUR_API_KEY') with your REAL Firebase project credentials.\n4. IMPORTANT: You MUST restart your development server after creating or editing the .env.local file.`
    );
}
