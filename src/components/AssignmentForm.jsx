import { useState } from "react";

export default function AssignmentForm({ engineers, projects, onAssign, assignments }) {
  const [engineerId, setEngineerId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!engineerId || !projectId || capacity <= 0) {
      setError("All fields are required and capacity must be > 0.");
      return;
    }

    const engineerAssignments = assignments.filter(
      (a) => a.engineerId._id === engineerId
    );

    const currentTotal = engineerAssignments.reduce((sum, a) => sum + Number(a.capacity), 0);
    const newTotal = currentTotal + Number(capacity);

    if (newTotal > 100) {
      setError(`Overbooking! This will exceed 100% (${newTotal}%).`);
      return;
    }

    onAssign({
      engineerId,
      projectId,
      capacity: Number(capacity),
    });

    // Reset form
    setEngineerId("");
    setProjectId("");
    setCapacity(0);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-xl shadow-md text-white space-y-4">
      <h3 className="text-lg font-semibold text-blue-400">Assign Engineer to Project</h3>

      <select className="p-2 rounded bg-gray-700 w-full" value={engineerId} onChange={(e) => setEngineerId(e.target.value)}>
        <option value="">Select Engineer</option>
        {engineers.map((e) => (
          <option key={e._id} value={e._id}>{e.name}</option>
        ))}
      </select>

      <select className="p-2 rounded bg-gray-700 w-full" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Capacity %"
        className="p-2 rounded bg-gray-700 w-full"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
        Assign
      </button>
    </form>
  );
}
