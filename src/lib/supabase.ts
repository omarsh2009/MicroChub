'use client';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A robust check to prevent unhelpful errors from the Supabase client
let errorParts: string[] = [];
if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    errorParts.push('NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
    errorParts.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

if (errorParts.length > 0) {
    throw new Error(`STOP! Your Supabase environment variables are not configured correctly. The following keys are missing or using placeholder values: ${errorParts.join(', ')}. \n\n--- PLEASE FOLLOW THESE STEPS ---\n1. Create a file named '.env.local' in the root of your project.\n2. Copy all content from the '.env' template file into '.env.local'.\n3. Replace the placeholder values (e.g., 'YOUR_SUPABASE_URL') with your REAL Supabase project credentials.\n4. IMPORTANT: You MUST restart your development server after creating or editing the .env.local file.`);
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFile(file: File, userId: string): Promise<string> {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  let contentType = file.type;
  if (!contentType) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      default:
        contentType = 'application/octet-stream'; // A generic fallback
    }
  }
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      contentType: contentType,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Could not get public URL for uploaded file.");
  }

  return publicUrlData.publicUrl;
}
