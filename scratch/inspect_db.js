import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read and parse .env manually
const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2] || "";
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
});

const supabaseUrl = envVars["VITE_SUPABASE_URL"];
const supabaseAnonKey = envVars["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env: parsed keys:", Object.keys(envVars));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectColumns() {
  const { data, error } = await supabase.from("projects").select("*").limit(1);
  if (error) {
    console.error("Error fetching projects:", error);
    process.exit(1);
  }
  if (data && data.length > 0) {
    console.log("Existing columns:", Object.keys(data[0]));
  } else {
    console.log("No projects found in database.");
  }
}

inspectColumns();
