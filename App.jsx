import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AdminPanel from "./AdminPanel";
import Dashboard from "./Dashboard";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  if (!session) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function AuthPage() {
  const [email, setEmail] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the magic login link!");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to KingProfit</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button type="submit" className="bg-red-600 hover:bg-red-700 p-2 rounded">
          Send Magic Link
        </button>
      </form>
    </div>
  );
}
