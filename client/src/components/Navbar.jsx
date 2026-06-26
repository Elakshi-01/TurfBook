import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative hover:text-emerald-400 transition ${
      isActive(path) ? "text-emerald-400" : "text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#08120c]/95 backdrop-blur-sm border-b border-green-800 text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-emerald-400 tracking-tight">
          TurfBook
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex gap-8 font-medium">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/turfs" className={linkClass("/turfs")}>
            Browse Turfs
          </Link>

       <Link to="/about" className={linkClass("/about")}>
  About
</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {!token ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg hover:bg-green-900/40 transition-colors text-sm font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user?.role === "user" && (
                <Link to="/my-bookings" className={linkClass("/my-bookings") + " text-sm"}>
                  My Bookings
                </Link>
              )}

              {user?.role === "vendor" && (
                <div className="hidden lg:flex items-center gap-5 text-sm">
                  <Link to="/vendor/dashboard" className={linkClass("/vendor/dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/vendor/turfs" className={linkClass("/vendor/turfs")}>
                    My Turfs
                  </Link>
                  <Link to="/vendor/add-turf" className={linkClass("/vendor/add-turf")}>
                    Add Turf
                  </Link>
                  <Link to="/vendor/bookings" className={linkClass("/vendor/bookings")}>
                    Bookings
                  </Link>
                </div>
              )}

              {user?.role === "admin" && (
                <div className="hidden lg:flex items-center gap-5 text-sm">
                  <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
                    Dashboard
                  </Link>
                  <Link to="/admin/pending-turfs" className={linkClass("/admin/pending-turfs")}>
                    Pending
                  </Link>
                  <Link to="/admin/users" className={linkClass("/admin/users")}>
                    Users
                  </Link>
                </div>
              )}

              <span className="hidden sm:inline text-xs text-gray-500 px-3 border-l border-white/10 capitalize">
                {user?.name || user?.role}
              </span>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}