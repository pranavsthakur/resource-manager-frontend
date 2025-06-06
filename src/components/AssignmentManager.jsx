import { useEffect, useState } from "react";

export default function AssignmentManager() {
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    engineerId: "",
    projectId: "",
    capacity: 0,
  });

  const fetchAll = async () => {
    const base = import.meta.env.VITE_API_URL;

    const engRes = await fetch(`${base}/api/engineers`);
    const projRes = await fetch(`${base}/api/projects`);
    const assignRes = await fetch(`${base}/api/assignments`);

    setEngineers(await engRes.json());
    setProjects(await projRes.json());
    setAssignments(await assignRes.json());
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    const base = import.meta.env.VITE_API_URL;

    await fetch(`${base}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
    });

    setForm({ engineerId: "", projectId: "", capacity: 0 });
    fetchAll();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#3A3A3C]">
        Assignment Manager
      </h2>

      <form
        onSubmit={handleAssign}
        className="space-y-4 mb-6 bg-white p-4 rounded-md shadow"
      >
        <select
          name="engineerId"
          value={form.engineerId}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Engineer</option>
          {engineers.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <select
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Enter Capacity (%)"
          className="w-full p-2 border border-gray-300 rounded"
          required
          min={1}
          max={100}
        />

        <button
          type="submit"
          className="bg-[#D72638] text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Assign
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2 text-[#3A3A3C]">
        Current Assignments
      </h3>
      <ul className="bg-white rounded shadow divide-y">
        {assignments.map((a) => (
          <li key={a._id} className="p-3 text-sm">
            🧑‍💻 <strong>{a.engineerId?.name}</strong> → 📁{" "}
            <strong>{a.projectId?.name}</strong> — {a.capacity}% capacity
          </li>
        ))}
      </ul>
    </div>
  );
}
