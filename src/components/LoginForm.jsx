import { useState, useEffect } from "react";
import { FaUserTie, FaUserCog } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  onKeyDown,
}) => (
  <div className="relative">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      required
      className={`peer w-full border ${
        error ? "border-red-500" : "border-gray-300"
      } p-3 pt-5 rounded-md bg-[#FAFAF9] focus:outline-none focus:ring-2 focus:ring-[#D72638]`}
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-3 text-sm text-gray-500 bg-[#FAFAF9] px-1 transition-all duration-150 
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
      peer-focus:text-xs peer-focus:-top-2 peer-focus:text-[#D72638]"
    >
      {label}
    </label>
  </div>
);

const RoleButton = ({ role, selectedRole, setSelectedRole }) => {
  const isActive = selectedRole === role;
  const Icon = role === "Manager" ? FaUserTie : FaUserCog;

  return (
    <button
      type="button"
      onClick={() => {
        setSelectedRole(role);
        localStorage.setItem("selectedRole", role);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
        isActive
          ? "bg-[#D72638] text-white border-[#D72638] shadow-md scale-105"
          : "bg-white text-[#3A3A3C] border-gray-300"
      }`}
      aria-pressed={isActive}
      aria-label={`Login as ${role}`}
    >
      <Icon />
      {role}
    </button>
  );
};

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Engineer");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) setSelectedRole(savedRole);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role: selectedRole }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      })
      .then((data) => {
        onLogin({ ...data.user, token: data.token }); // ✅ updated to include token
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md">
        <div className="hidden md:flex md:w-1/2 bg-[#3A3A3C] text-white flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold mb-3">Resource Manager</h1>
          <p className="text-gray-300 text-center text-sm">
            Plan. Assign. Optimize.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-[#FFFDFB]">
          <h2 className="text-2xl font-bold text-[#3A3A3C] mb-1">Welcome</h2>
          <p className="text-sm text-[#7C7C7C] mb-4">
            Login to access your dashboard
          </p>

          <div className="flex justify-center gap-4 mb-2">
            {["Engineer", "Manager"].map((role) => (
              <RoleButton
                key={role}
                role={role}
                selectedRole={selectedRole}
                setSelectedRole={(r) => {
                  setSelectedRole(r);
                  setError(false);
                  localStorage.setItem("selectedRole", r);
                }}
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            Logging in as{" "}
            <span className="font-semibold text-[#D72638]">{selectedRole}</span>
          </p>

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${error ? "animate-shake" : ""}`}
          >
            <InputField
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={error}
            />

            <div className="relative">
              <InputField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {error && (
              <p
                className="text-red-600 text-sm text-center"
                aria-live="polite"
              >
                Invalid credentials or role mismatch.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D72638] hover:bg-red-700 text-white py-2.5 rounded-md text-base font-medium transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : `Login as ${selectedRole}`}
            </button>
          </form>

          <p className="text-xs text-[#7C7C7C] text-center mt-6">
            © {new Date().getFullYear()} Created by Pranav Thakur
          </p>
        </div>
      </div>
    </div>
  );
}
