import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTrash, FaPlus } from "react-icons/fa";

export default function EngineerDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newTool, setNewTool] = useState("");
  const [newProject, setNewProject] = useState({ name: "", desc: "" });

  // 1. Fetch engineer profile
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;

    fetch(`${base}/api/engineers/username/${user.username}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => console.error("Failed to load engineer profile"));
  }, [user.username, user.token]);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;

    fetch(`${base}/api/assignments`)
      .then((res) => res.json())
      .then((data) => setAssignments(data));

    fetch(`${base}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  if (!profile) return <div className="text-white p-10">Loading...</div>;

  // 3. Filter engineer-specific assignments
  const myAssignments = assignments.filter(
    (a) =>
      a.engineerId?.username === user.username || a.engineerId === user.username
  );

  const uniqueAssignments = Array.from(
    new Map(
      myAssignments.map((a) => [a.projectId?._id || a.projectId, a])
    ).values()
  );
  const totalCapacity = uniqueAssignments.reduce(
    (sum, a) => sum + a.capacity,
    0
  );

  const getProjectName = (id) => {
    if (typeof id === "object" && id.name) return id.name;
    const p = projects.find((proj) => proj._id === id || proj.id === id);
    return p?.name || "Unknown Project";
  };

  const getCapacityColor = (cap) =>
    cap <= 50 ? "bg-green-500" : cap <= 80 ? "bg-yellow-400" : "bg-red-500";

  const saveProfile = () => {
    const base = import.meta.env.VITE_API_URL;

    fetch(`${base}/api/engineers/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then(() => {
        fetch(`${base}/api/engineers/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setProfile(data);
            setEditMode(false);
          });
      })
      .catch(() => alert("Failed to save changes"));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans px-6 md:px-24 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-gradient-to-r from-[#0d0d0d] to-[#1a1a1a] p-6 rounded-xl">
        <div className="flex-1">
          <h1 className="text-5xl font-extrabold mb-1">
            Hey, {profile.name || "Engineer"} 👋
          </h1>
          <p className="text-xl text-gray-400">
            {profile.department || "Your role here"}
          </p>
        </div>

        <div className="flex flex-col items-center mt-6 md:mt-0">
          <img
            src={
              profile.profile ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={profile.name}
            className="w-32 h-32 rounded-full border-4 border-gray-700"
          />
          {editMode && (
            <input
              value={profile.profile || ""}
              onChange={(e) =>
                setProfile({ ...profile, profile: e.target.value })
              }
              className="mt-2 bg-black text-white p-2 border border-gray-600 rounded text-sm w-full"
              placeholder="Paste profile image URL"
            />
          )}
          <button
            onClick={() => (editMode ? saveProfile() : setEditMode(true))}
            className="mt-4 text-sm bg-pink-600 px-4 py-2 rounded hover:bg-pink-700"
          >
            {editMode ? (
              <>
                <FaSave className="inline mr-1" /> Save
              </>
            ) : (
              <>
                <FaEdit className="inline mr-1" /> Edit
              </>
            )}
          </button>
        </div>
      </div>

      {/* About Me */}
      <section className="mb-10 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">About Me</h2>
        {editMode ? (
          <textarea
            value={profile.description || ""}
            onChange={(e) =>
              setProfile({ ...profile, description: e.target.value })
            }
            className="w-full bg-black p-2 border border-gray-700 rounded"
            rows="3"
          />
        ) : (
          <p className="text-gray-400">
            {profile.description || "You haven't added a description yet."}
          </p>
        )}
      </section>

      {/* Experience */}
      <section className="mb-10 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Experience</h2>
        {editMode ? (
          <input
            value={profile.experience || ""}
            onChange={(e) =>
              setProfile({ ...profile, experience: e.target.value })
            }
            className="w-full bg-black p-2 border border-gray-700 rounded"
          />
        ) : (
          <p className="text-gray-400">
            {profile.experience || "No experience listed."}
          </p>
        )}
      </section>

      {/* Tech Stack */}
      <section className="mb-10 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {(profile.tools || []).map((tool, i) => (
            <span
              key={i}
              className="bg-[#222] px-4 py-1 rounded-full text-sm border border-gray-600 flex items-center gap-2"
            >
              {tool}
              {editMode && (
                <FaTrash
                  className="text-xs cursor-pointer text-red-400"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      tools: profile.tools.filter((t) => t !== tool),
                    })
                  }
                />
              )}
            </span>
          ))}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <input
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              className="bg-black p-2 border border-gray-700 rounded"
              placeholder="Add tool"
            />
            <button
              onClick={() => {
                if (!newTool.trim()) return;
                setProfile({
                  ...profile,
                  tools: [...(profile.tools || []), newTool],
                });
                setNewTool("");
              }}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            >
              <FaPlus className="inline mr-1" /> Add
            </button>
          </div>
        )}
      </section>

      {/* Past Projects */}
      <section className="mb-10 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Past Projects</h2>
        {(profile.pastProjects || []).map((proj, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="font-semibold text-white">{proj.name}</h3>
            <p className="text-sm text-gray-400">{proj.desc}</p>
            {editMode && (
              <button
                onClick={() => {
                  const updated = [...(profile.pastProjects || [])];
                  updated.splice(idx, 1);
                  setProfile({ ...profile, pastProjects: updated });
                }}
                className="text-xs text-red-400 mt-1"
              >
                <FaTrash className="inline mr-1" /> Remove
              </button>
            )}
          </div>
        ))}
        {editMode && (
          <div className="mt-4 space-y-2">
            <input
              className="bg-black w-full p-2 rounded border border-gray-600"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
            <textarea
              className="bg-black w-full p-2 rounded border border-gray-600"
              placeholder="Project Description"
              value={newProject.desc}
              onChange={(e) =>
                setNewProject({ ...newProject, desc: e.target.value })
              }
              rows="2"
            />
            <button
              onClick={() => {
                if (!newProject.name || !newProject.desc) return;
                setProfile({
                  ...profile,
                  pastProjects: [...(profile.pastProjects || []), newProject],
                });
                setNewProject({ name: "", desc: "" });
              }}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
              <FaPlus className="inline mr-2" /> Add Project
            </button>
          </div>
        )}
      </section>

      {/* Assignments */}
      <section className="mb-10 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Current Assignments</h2>
        {myAssignments.length === 0 ? (
          <p className="text-gray-500 text-sm">No assignments yet.</p>
        ) : (
          myAssignments.map((a, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-lg font-semibold">
                {getProjectName(a.projectId)}
              </h3>
              <p className="text-sm text-gray-400">Capacity: {a.capacity}%</p>
            </div>
          ))
        )}
      </section>

      {/* Capacity Bar */}
      <section className="mb-20 bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Total Capacity</h2>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 ${getCapacityColor(totalCapacity)} transition-all`}
            style={{ width: `${Math.min(totalCapacity, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          You're using <strong>{totalCapacity}%</strong> of your time.
        </p>
      </section>
    </div>
  );
}
