import { supabase } from "../../utils/SupabaseClient";

export default async function handler(req, res) {
  const { user_id } = req.query;
  console.log("user_id in characters.js handler:", user_id);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch characters from Supabase for the specified user_id
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      console.error("Supabase Error:", error); // Log Supabase error
      throw error;
    }

    console.log("Characters Data in route:", data); // Log the fetched data

    res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error); // Log API error
    res.status(500).json({ error: error.message });
  }
}
