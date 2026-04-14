'use client';

import { ref, uploadBytes, FirebaseStorage } from "firebase/storage";

export async function testUpload(storage: FirebaseStorage, file: File) {
  if (!file) {
    alert("Please select a file first.");
    console.error("No file provided for test upload.");
    return;
  }
  try {
    console.log("TEST START: Uploading file to 'test/test.jpg'");
    console.log("File details:", { name: file.name, size: file.size, type: file.type });

    const storageRef = ref(storage, "test/test.jpg");

    const result = await uploadBytes(storageRef, file);

    console.log("UPLOAD SUCCESS:", result);
    alert('Test upload successful! Check the console for details.');

  } catch (error) {
    console.error("--- FULL UPLOAD ERROR ---");
    console.error(error);
    alert('Test upload failed! Check the console for the full error object.');
  }
}
