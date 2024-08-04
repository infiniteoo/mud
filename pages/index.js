import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/character-selection");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return null; // Optionally render a loading spinner here
}
