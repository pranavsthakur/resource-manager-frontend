import { useState, useEffect } from "react";
import { FaUser, FaFolderOpen, FaEdit, FaTrash } from "react-icons/fa";
import EngineerForm from "./EngineerForm";
import ProjectForm from "./ProjectForm";
import AssignmentForm from "./AssignmentForm";
import Marquee from "react-fast-marquee";
import axios from "../api/axios";

export default function ManagerDashboard() {
  const [engineers, setEngineers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get("/engineers");
        setEngineers(res.data);
      } catch (err) {
        console.error("Failed to load engineers", err);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };

    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to load assignments", err);
      }
    };

    fetchEngineers();
    fetchProjects();
    fetchAssignments();
  }, []);

  const handleAssign = async (newAssignment) => {
    try {
      const res = await axios.post("/assignments", newAssignment);
      setAssignments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to assign:", err);
    }
  };

  const handleEdit = async (assignmentId) => {
    const updated = prompt("New capacity (%)");
    if (!updated || isNaN(updated)) return;

    try {
      const res = await axios.put(`/assignments/${assignmentId}`, {
        capacity: parseInt(updated),
      });
      setAssignments((prev) =>
        prev.map((a) => (a._id === assignmentId ? res.data : a))
      );
    } catch (err) {
      console.error("Failed to update assignment", err);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await axios.delete(`/assignments/${assignmentId}`);
      setAssignments((prev) =>
        prev.filter((a) => a._id !== assignmentId)
      );
    } catch (err) {
      console.error("Failed to delete assignment", err);
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity < 50) return "bg-green-500";
    if (capacity <= 90) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans">
      <header className="px-6 md:px-16 py-12 bg-gradient-to-r from-black to-[#1A1A1A]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Innovate. Collaborate. Build.
        </h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          AI-powered engineering management dashboard crafted for smarter
          assignment and real-time tracking.
        </p>
      </header>

      <Marquee
        pauseOnHover
        className="bg-[#D72638] text-white text-sm font-medium py-2 tracking-wide"
      >
        Resource Manager · Track assignments · React + Tailwind · Built for
        GeekyAnts interview · Powered by Aelius ⚡
      </Marquee>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-16 mt-12">
        <div className="bg-[#FEEBCB] text-black p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-lg">Projects</p>
            <h3 className="text-4xl font-extrabold mt-1">{projects.length}</h3>
            <p className="text-sm text-gray-600">Ongoing Projects</p>
          </div>
          <FaFolderOpen className="text-4xl text-orange-600" />
        </div>

        <div className="bg-[#114E4E] p-6 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-lg text-white">Engineers</p>
            <h3 className="text-4xl font-extrabold mt-1">{engineers.length}</h3>
            <p className="text-sm text-gray-300">Engineers Assigned</p>
          </div>
          <FaUser className="text-4xl text-white" />
        </div>
      </div>

      <section className="px-6 md:px-16 mt-24 grid md:grid-cols-3 gap-6">
        <EngineerForm onAdd={(e) => setEngineers([...engineers, e])} />
        <ProjectForm onAdd={(p) => setProjects([...projects, p])} />
        <AssignmentForm
          engineers={engineers}
          projects={projects}
          assignments={assignments}
          onAssign={handleAssign}
        />
      </section>

      <section className="mt-24 px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-6">Our Engineering Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {engineers.map((eng) => (
            <div
              key={eng._id}
              className="bg-[#1C1C1C] p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={eng.profile}
                alt={eng.name}
                className="w-20 h-20 object-cover rounded-full border-4 border-gray-700 mb-4"
              />
              <h3 className="text-lg font-semibold">{eng.name}</h3>
              <p className="text-sm text-gray-400">{eng.department}</p>
              {eng.description && (
                <p className="text-sm text-gray-500 mt-2">{eng.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-6">Our Active Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-[#1C1C1C] p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="text-sm text-gray-400 mt-2">
                {p.description || "No description provided."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-6">Current Assignments and Capacity</h2>
        {engineers.map((eng) => {
          const engAssignments = assignments.filter(
            (a) => a.engineerId._id === eng._id
          );
          const total = engAssignments.reduce((sum, a) => sum + a.capacity, 0);

          return (
            <div
              key={eng._id}
              className="bg-[#1A1A1A] p-6 rounded-xl mb-6 shadow border border-[#333]"
            >
              <h3 className="text-xl font-semibold mb-3">{eng.name}</h3>
              {engAssignments.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments yet.</p>
              ) : (
                engAssignments.map((a) => (
                  <div
                    key={a._id}
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span>
                      {a.projectId?.name || "Project"} – {a.capacity}%
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a._id)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <div className="h-2 mt-3 bg-gray-700 rounded overflow-hidden">
                <div
                  className={`${getCapacityColor(total)} h-full transition-all`}
                  style={{ width: `${Math.min(total, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
