import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

export async function uploadFile(bucket: string, path: string, buffer: Buffer) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, { upsert: false });
  if (error) throw error;
  return data;
}

export function getPublicUrl(bucket: string, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).publicURL;
}

export function createSignedUrl(bucket: string, path: string, expires: number) {
  return supabase.storage.from(bucket).createSignedUrl(path, expires);
}
