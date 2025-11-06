import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wrerbktgtfawvndmtzca.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZXJia3RndGZhd3ZuZG10emNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mjk4ODksImV4cCI6MjA3NzUwNTg4OX0.oFGY4NIpbVFrkRrSwXyLCEMfIgMmS1kE-kbbEFBXa6Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
