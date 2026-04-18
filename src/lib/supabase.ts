'use client';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// More robust check to prevent unhelpful errors from the Supabase client
if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    throw new Error('Supabase URL is missing or is still a placeholder. Please check your .env.local file and make sure NEXT_PUBLIC_SUPABASE_URL is set correctly.');
}

if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
    throw new Error('Supabase anon key is missing or is still a placeholder. Please check your .env.local file and make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly.');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFile(file: File, userId: string): Promise<string> {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

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
