import { useState } from "react";
import axios from "../api/axios";

export default function ProjectForm({ onAdd }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await axios.post("/projects", { name, description });
      onAdd(res.data); // this updates project list in ManagerDashboard
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-xl shadow-md text-white space-y-3">
      <h3 className="text-lg font-semibold mb-2 text-green-400">Add Project</h3>

      <input
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Project
      </button>
    </form>
  );
}
