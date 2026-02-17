import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <nav className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-md">
            <div className="text-xl font-bold">
                <Link to="/" className="text-white hover:text-gray-300 transition">kal-Estore</Link>
            </div>
            <div className="flex gap-6">
                <Link to="/" className="text-white hover:underline transition">Home</Link>
                {isLoggedIn ? (
                    <Link to="/profile" className="text-white hover:underline transition font-semibold">Profile</Link>
                ) : (
                    <Link to="/login" className="text-white hover:underline transition">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
