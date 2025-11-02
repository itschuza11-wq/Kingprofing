import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Load users from Supabase Auth
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) console.error(error);
      else setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // Load tasks from DB
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("id", { ascending: false });
      if (error) console.error(error);
      else setTasks(data);
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!taskTitle || !assignedTo) {
      alert("Please fill all fields");
      return;
    }
    const { data, error } = await supabase.from("tasks").insert([
      { title: taskTitle, assigned_to: assignedTo },
    ]);
    if (error) alert(error.message);
    else {
      alert("Task added!");
      setTaskTitle("");
      setAssignedTo("");
      setTasks([data[0], ...tasks]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-8">Admin Panel</h1>

      {/* Add Task */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-3 mb-3 border rounded-lg"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <select
          className="w-full p-3 mb-3 border rounded-lg"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.email}>
              {u.email}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
        >
          Assign Task
        </button>
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 border rounded-lg flex justify-between items-center">
                <span>
                  <strong>{task.title}</strong> — <span className="text-gray-500">{task.assigned_to}</span>
                </span>
                <span className="text-sm text-gray-400">{new Date(task.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
