'use client';
import React from 'react';
import {initializeFirebase} from './index';
import {FirebaseProvider} from './provider';

export const FirebaseClientProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const firebase = initializeFirebase();
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
};
