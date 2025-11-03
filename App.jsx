import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./Admin";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-red-600">
      <h1 className="text-4xl font-bold">Welcome to KingProfit</h1>
      <Link
        to="/admin"
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Go to Admin Panel
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
