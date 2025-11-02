import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Admin from "./Admin";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Signup successful! Please login now.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        alert("Login successful!");
        if (email === "itsmujahid.pk@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-red-600 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl text-white font-bold mb-6 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-white text-red-600 font-bold py-2 rounded-lg hover:bg-gray-100"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-center text-white mt-4 cursor-pointer underline"
        >
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-2xl font-bold">
      User Dashboard (Non-admin)
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
