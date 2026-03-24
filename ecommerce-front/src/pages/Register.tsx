import React, { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });

      setSuccess("Compte créé avec succès !");
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[url('https://img.freepik.com/premium-vector/shopping-doodle-outline-seamless-pattern-background-vector-illustration_7087-2894.jpg')]  px-4">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/60 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden">

        {/* LEFT FORM */}
        <div className="p-10 text-gray-600">
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-sm text-center">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-orange-500 cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-orange-100">
          <img
            src="https://img.freepik.com/photos-premium/ordinateur-portable-3d-megaphone-pour-marketing-numerique_1149279-15144.jpg"
            alt="Register"
            className="h-full w-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Register;
