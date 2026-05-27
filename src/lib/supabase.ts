import { createClient } from "@supabase/supabase-js";

// Helper to resolve environment variables in both Node.js server (process.env) and Vite client (import.meta.env)
const getEnv = (key: string): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] || "";
  }
  // @ts-ignore
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key] || "";
  }
  return "";
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_SUPABASE_ANON_KEY");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase credentials are not set in environment variables. Falling back to mock local data."
  );
}

// Create the client with placeholder values if not configured to avoid runtime crash.
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
