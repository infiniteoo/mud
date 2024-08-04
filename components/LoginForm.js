import { useState } from "react";
import { supabase } from "../utils/SupabaseClient";
import { useRouter } from "next/router";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use the Next.js router

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting to log in with:", { email, password });
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } else {
      console.log("Login success:", data);
      alert("Login successful!");
      // Redirect to character selection screen
      router.push("/character-selection"); // Replace with your actual path
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting to sign up with:", { email, password });
    const { error, data } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      console.error("Sign up error:", error.message);
      alert(error.message);
    } else {
      console.log("Sign up success:", data);
      alert("Account created successfully!");
      // Redirect to character selection screen
      router.push("/character-selection"); // Replace with your actual path
    }
  };

  return (
    <div>
      <form
        className="text-black"
        onSubmit={isSignUp ? handleSignUp : handleLogin}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="text-white" type="submit" disabled={loading}>
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Login"}
        </button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Login" : "Create Account"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
