import { useState } from 'react';

export default function EngineerForm({ onAdd }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [profile, setProfile] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !department.trim() || !profile.trim()) return;

    onAdd({
      id: Date.now().toString(),
      name,
      department,
      profile,
      description,
    });

    setName('');
    setDepartment('');
    setProfile('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-xl shadow-md text-white space-y-3">
      <h3 className="text-lg font-semibold mb-2 text-pink-400">Add Engineer</h3>

      <input
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="Department (e.g., Frontend)"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <input
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="Profile Image URL"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
      />

      <textarea
        className="w-full bg-gray-700 p-2 rounded"
        placeholder="About Engineer (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        type="submit"
        className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded"
      >
        Add Engineer
      </button>
    </form>
  );
}
