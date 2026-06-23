import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listPrices() {
  const { data, error } = await supabase.from("projects").select("name, starting_price, price_lakh, size_prices");
  if (error) {
    console.error("Error fetching projects:", error);
    process.exit(1);
  }
  console.log("Current projects and prices:");
  console.log(JSON.stringify(data, null, 2));
}

listPrices();
