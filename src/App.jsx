import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import ManagerDashboard from "./components/ManagerDashboard";
import EngineerDashboard from "./components/EngineerDashboard";
import AssignmentManager from "./components/AssignmentManager";

export default function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const logout = () => setUser(null);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginForm onLogin={setUser} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-black text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">Resource Manager</h1>
          <div>
            <span className="mr-4">
              Logged in as <strong>{user.role}</strong>
            </span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                user.role === "Manager" ? (
                  <ManagerDashboard
                    user={user}
                    engineers={engineers}
                    setEngineers={setEngineers}
                    projects={projects}
                    setProjects={setProjects}
                    assignments={assignments}
                    setAssignments={setAssignments}
                  />
                ) : (
                  <EngineerDashboard
                    user={user} // <== Important
                    assignments={assignments}
                    projects={projects}
                  />
                )
              }
            />
            {/* ✅ New Route for Assignment Manager */}
            {user.role === "Manager" && (
              <Route path="/assignments" element={<AssignmentManager />} />
            )}
            {/* Redirect anything else to / */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-black text-white text-center py-4 text-sm">
          © {new Date().getFullYear()} Created by Pranav Thakur
        </footer>
      </div>
    </Router>
  );
}
