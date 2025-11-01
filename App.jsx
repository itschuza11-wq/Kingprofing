import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Dashboard from "./Dashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // login or signup
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    currentSession.then(({ data }) => {
      setSession(data?.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      setLoading(false);
      return;
    }

    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Account created successfully! You can now log in.");
      setAuthMode("login");
    }

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div className="auth-container">
        <h2>KingProfit — {authMode === "login" ? "Login" : "Sign Up"}</h2>

        <form onSubmit={handleAuth} className="card">
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter email" required />

          <label>Password</label>
          <input type="password" name="password" placeholder="Enter password" required />

          <button className="btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: 12 }}>
          {authMode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button className="link" onClick={() => setAuthMode("signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="link" onClick={() => setAuthMode("login")}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Dashboard user={session.user} />
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
        }
        
