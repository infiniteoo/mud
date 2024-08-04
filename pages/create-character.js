import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/SupabaseClient";

const races = ["Human", "Elf", "Orc", "Dwarf", "Troll", "Gnome", "Goblin"];
const classes = ["Mage", "Warrior", "Rogue", "Cleric", "Hunter"];

const rollStats = () => {
  return {
    strength: Math.floor(Math.random() * 10) + 1,
    wisdom: Math.floor(Math.random() * 10) + 1,
    intelligence: Math.floor(Math.random() * 10) + 1,
    charisma: Math.floor(Math.random() * 10) + 1,
    dexterity: Math.floor(Math.random() * 10) + 1,
    luck: Math.floor(Math.random() * 10) + 1,
    hitpoints: Math.floor(Math.random() * 50) + 1,
    manapoints: Math.floor(Math.random() * 30) + 1,
  };
};

export default function CreateCharacter() {
  const [name, setName] = useState("");
  const [race, setRace] = useState(races[0]);
  const [characterClass, setCharacterClass] = useState(classes[0]);
  const [stats, setStats] = useState(rollStats());
  const router = useRouter();

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    try {
      const { data: user } = await supabase.auth.getUser(); // Updated method

      if (user) {
        console.log(user);
      }

      if (!user) {
        alert("You need to be logged in to create a character.");
        setLoading(false);
        return;
      }
      const { error } = await supabase
        .from("characters")
        .insert([
          {
            name,
            race,
            class: characterClass,
            ...stats,
            user_id: user.user.id,
          },
        ]);

      if (error) {
        console.error("Error creating character:", error.message);
      } else {
        router.push("/character-selection");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };

  return (
    <form onSubmit={handleCreateCharacter}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Race:
        <select value={race} onChange={(e) => setRace(e.target.value)}>
          {races.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label>
        Class:
        <select
          value={characterClass}
          onChange={(e) => setCharacterClass(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={() => setStats(rollStats())}>
        Roll Stats
      </button>
      <div>
        <h3>Stats:</h3>
        <p>Strength: {stats.strength}</p>
        <p>Wisdom: {stats.wisdom}</p>
        <p>Intelligence: {stats.intelligence}</p>
        <p>Charisma: {stats.charisma}</p>
        <p>Dexterity: {stats.dexterity}</p>
        <p>Luck: {stats.luck}</p>
        <p>Hit Points: {stats.hitpoints}</p>
        <p>Mana Points: {stats.manapoints}</p>
      </div>
      <button type="submit">Create Character</button>
    </form>
  );
}
