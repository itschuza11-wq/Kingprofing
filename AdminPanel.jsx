import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", reward: "" });

  // Login function
  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    setUser(data.user);
  }

  // Load tasks
  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  async function loadTasks() {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (error) return alert(error.message);
    setTasks(data || []);
  }

  // Add new task
  async function addTask(e) {
    e.preventDefault();
    const { error } = await supabase.from("tasks").insert([
      { title: newTask.title, description: newTask.description, reward: parseFloat(newTask.reward), active: true },
    ]);
    if (error) return alert(error.message);
    alert("✅ Task added successfully!");
    setNewTask({ title: "", description: "", reward: "" });
    loadTasks();
  }

  // Delete task
  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return alert(error.message);
    alert("🗑️ Task deleted");
    loadTasks();
  }

  // If not logged in
  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ff0000, #ffffff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: 280 }}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10, padding: 8 }}
          />
          <button type="submit" style={{ background: "#fff", color: "#ff0000", padding: 8, fontWeight: "bold" }}>
            Login
          </button>
        </form>
      </div>
    );

  // Admin Dashboard
  return (
    <div style={{ background: "#fff", color: "#000", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ color: "red" }}>🔥 KingProfit Admin Panel</h1>
      <p>Welcome, {user.email}</p>

      <section style={{ marginTop: 20 }}>
        <h3>Add New Task</h3>
        <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", width: 300 }}>
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ marginBottom: 8, padding: 8 }}
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ marginBottom: 8, padding: 8 }}
          />
          <input
            placeholder="Reward (e.g. 10.00)"
            type="number"
            step="0.01"
            value={newTask.reward}
            onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
            style={{ marginBottom: 8, padding: 8 }}
          />
          <button type="submit" style={{ background: "red", color: "#fff", padding: 8, fontWeight: "bold" }}>
            Add Task
          </button>
        </form>
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>All Tasks</h3>
        {tasks.map((t) => (
          <div
            key={t.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              background: "#f8f8f8",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{t.title}</div>
            <div>{t.description}</div>
            <div>Reward: {t.reward}</div>
            <button
              onClick={() => deleteTask(t.id)}
              style={{ background: "red", color: "#fff", padding: "4px 10px", marginTop: 6, border: "none" }}
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
