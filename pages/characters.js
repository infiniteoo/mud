import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/SupabaseClient";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [user, setUser] = useState(null);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get the currently logged-in user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch the user's characters
      const fetchCharacters = async () => {
        const response = await fetch(`/api/characters?user_id=${user.id}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setCharacters(data);
        }
      };
      fetchCharacters();
    }
  }, [user]);

  // Handle creating a new character
  const handleCreateCharacter = async () => {
    if (!newCharacterName) return;

    const response = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCharacterName, user_id: user.id }),
    });

    const data = await response.json();
    if (data.error) {
      setError(data.error);
    } else {
      setCharacters((prev) => [...prev, data[0]]);
      setNewCharacterName("");
    }
  };

  // Handle deleting a character
  const handleDeleteCharacter = async (id) => {
    const response = await fetch(`/api/characters/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCharacters((prev) => prev.filter((char) => char.id !== id));
    }
  };

  // Handle selecting a character
  const handleSelectCharacter = (id) => {
    // Implement the logic to login with the chosen character
    // For example, redirect to the game page with the character ID
    router.push(`/game?character_id=${id}`);
  };

  return (
    <div>
      <h1>Characters</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {characters.map((char) => (
          <li key={char.id}>
            <span>{char.name}</span>
            <button onClick={() => handleSelectCharacter(char.id)}>
              Login
            </button>
            <button onClick={() => handleDeleteCharacter(char.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newCharacterName}
          onChange={(e) => setNewCharacterName(e.target.value)}
          placeholder="New character name"
        />
        <button onClick={handleCreateCharacter}>Create Character</button>
      </div>
    </div>
  );
}
