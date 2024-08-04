// Client-side (Home component)

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/signup", {
        email,
        password,
      });
      setIsLoggedIn(true);
      setError("");
    } catch (err) {
      setError(err.response.data);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });
      setIsLoggedIn(true);
      setError("");
    } catch (err) {
      setError(err.response.data);
    }
  };

  if (isLoggedIn) {
    // Show the main game interface or character creation
    return (
      <div>
        <h1>Welcome to the Game!</h1>
        {/* Game content goes here */}
      </div>
    );
  }

  if (isCreatingAccount) {
    return (
      <div>
        <h1>Create an Account</h1>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={() => setIsCreatingAccount(false)}>Back</button>
        {error && <p>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1>Main Menu</h1>
      <button onClick={() => setIsCreatingAccount(true)}>Create Account</button>
      <button onClick={() => setIsCreatingAccount(false)}>Login</button>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
