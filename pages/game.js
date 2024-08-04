import { useRouter } from "next/router";

export default function Game() {
  const router = useRouter();
  const { character_id } = router.query;

  // Fetch character details if needed
  // const [character, setCharacter] = useState(null);

  // useEffect(() => {
  //   if (character_id) {
  //     // Fetch character details from Supabase
  //   }
  // }, [character_id]);

  return (
    <div>
      <h1>Game</h1>
      <p>Selected Character ID: {character_id}</p>
      {/* Add game logic here */}
    </div>
  );
}
