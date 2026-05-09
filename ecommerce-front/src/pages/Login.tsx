import React, { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      setError("Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[url('https://img.freepik.com/premium-vector/shopping-doodle-outline-seamless-pattern-background-vector-illustration_7087-2894.jpg')] px-4">

      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />

      {/* Card */}
      <div className="relative z-10 flex w-full max-w-5xl bg-white/30 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden border border-white/30">

        {/* Left: illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white/40">
          <img
            src="https://img.freepik.com/photos-premium/panier-achat-ordinateur-portable-panier-arriere-plan_1022259-548.jpg"
            alt="Shopping cart illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: form */}
        <div className="w-full md:w-1/2 p-8 space-y-5 text-gray-600">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

          {error && (
            <div role="alert" className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-orange-500 hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>

          {/* Divider */}
          <div className="flex items-center my-9 mx-20">
            <div className="flex-grow h-px bg-gray-500" />
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-500" />
          </div>

          {/* Social login icons (decorative — not wired to a provider) */}
          <div className="flex items-center justify-center gap-5">
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} fill="currentColor" viewBox="0 0 16 16" aria-label="Google" role="img">
              <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} fill="currentColor" viewBox="0 0 16 16" aria-label="Facebook" role="img">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} fill="currentColor" viewBox="0 0 16 16" aria-label="Twitter / X" role="img">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
