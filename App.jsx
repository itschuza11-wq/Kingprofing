import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://YOUR_PROJECT_URL.supabase.co",
  "YOUR_ANON_KEY"
);

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (newUser) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Account created successfully!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("✅ Login successful!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-600">
      <h1 className="text-3xl font-bold mb-4">KingProfit Login</h1>
      <form onSubmit={handleSubmit} className="bg-red-100 p-6 rounded-2xl shadow-md w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded border border-red-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded border border-red-300"
          required
        />
        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded-lg">
          {newUser ? "Sign Up" : "Login"}
        </button>
      </form>
      <p className="mt-3">
        {newUser ? "Already have an account?" : "Don't have an account?"}{" "}
        <button className="text-red-700 underline" onClick={() => setNewUser(!newUser)}>
          {newUser ? "Login" : "Sign Up"}
        </button>
      </p>
      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-700 mt-3">{error}</p>}
    </div>
  );
}
