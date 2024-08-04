import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import CharacterList from "../components/CharacterList";

export default function CharacterSelection() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    // Redirect to the game page with the selected character
    router.push(`/game?character_id=${character.id}`);
  };

  useEffect(() => {
    if (user) {
      // Fetch characters from Supabase
      fetch(`/api/characters?user_id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            setCharacters(data);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Character Selection</h1>
      <CharacterList characters={characters} onSelect={handleCharacterSelect} />
      <button onClick={() => router.push("/create-character")}>
        Create New Character
      </button>
    </div>
  );
}
