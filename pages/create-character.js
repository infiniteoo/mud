import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "../utils/SupabaseClient";

const CreateCharacter = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the current user from Supabase auth
    const { data: user } = await supabase.auth.getUser(); // Updated method

    if (user) {
      console.log(user);
    }

    if (!user) {
      alert("You need to be logged in to create a character.");
      setLoading(false);
      return;
    }

    // Create character with the authenticated user's ID
    // 123e4567-e89b-12d3-a456-426614174000

    console.log("User ID:", user.user.id);
    const { error } = await supabase
      .from("characters")
      .insert([{ name, user_id: user.user.id }]);

    setLoading(false);

    if (error) {
      console.error("Error creating character:", error.message);
      alert(error.message);
    } else {
      alert("Character created successfully!");
      router.push("/character-selection"); // Redirect to character selection or another page
    }
  };

  return (
    <div>
      <h1>Create Character</h1>
      <form onSubmit={handleCreateCharacter}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Character Name"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Character"}
        </button>
      </form>
    </div>
  );
};

export default CreateCharacter;
