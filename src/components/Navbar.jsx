import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center bg-gray-900/98 backdrop-blur-md text-white p-4 px-8 shadow-xl border-b border-white/5">
            <div className="flex items-center gap-8">
                <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-90 transition duration-200">
                    KAL<span className="text-gray-400">STORE</span>
                </Link>
                <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Link to="/" className={`hover:text-white transition ${location.pathname === "/" ? "text-white" : "text-gray-400"}`}>Home</Link>
                    <Link to="/shop" className={`hover:text-white transition ${location.pathname === "/shop" ? "text-white" : "text-gray-400"}`}>Shop All</Link>

                    {userRole === "admin" && (
                        <Link to="/admin" className={`hover:text-white transition ${location.pathname === "/admin" ? "text-white" : "text-gray-400"}`}>
                            Admin Dashboard
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/profile"
                            className={`px-6 py-2 rounded-sm border transition-all font-black text-[10px] uppercase tracking-widest ${location.pathname === "/profile" ? "bg-white text-gray-900 border-white" : "border-white/20 hover:border-white text-white"}`}
                        >
                            My Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-white/20 hover:text-white transition grayscale"
                            title="Logout"
                        >
                            🚪
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-8 py-2 rounded-sm bg-white text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition shadow-xl"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
