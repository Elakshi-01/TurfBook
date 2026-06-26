import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(formData);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Login Successful!");

      if (res.user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08120c] flex items-center justify-center px-4">

      <div className="grid lg:grid-cols-2 bg-[#12221a] rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full">

        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-700 to-green-900 p-12">

          <h1 className="text-5xl font-bold text-white">
            Welcome Back!
          </h1>

          <p className="text-emerald-100 mt-6 text-lg leading-8">
            Login to continue booking sports turfs, manage your
            reservations, or access your vendor/admin dashboard.
          </p>

          <div className="mt-10 space-y-4 text-emerald-100 text-lg">
            <p>⚽ Book Football Grounds</p>
            <p>🏏 Reserve Cricket Nets</p>
            <p>🏸 Play Badminton Anytime</p>
            <p>🎾 Premium Sports Facilities</p>
          </div>

        </div>

        {/* Right Side */}
        <div className="p-10">

          <h2 className="text-4xl font-bold text-center text-emerald-400 mb-2">
            TurfBook
          </h2>

          <p className="text-center text-gray-400 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-2 text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#1b2d23] border border-gray-700 text-white outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#1b2d23] border border-gray-700 text-white outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-bold text-lg transition"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <div className="mt-8 text-center text-gray-400">
            Don't have an account?
            <Link
              to="/register"
              className="text-emerald-400 ml-2 hover:underline"
            >
              Register
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}