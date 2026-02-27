import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/98 backdrop-blur-md text-white shadow-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center h-20">
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

                    <div className="hidden md:flex items-center gap-6">
                        {isLoggedIn && (
                            <div className="flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
                                <Link to="/cart" className="relative text-gray-400 hover:text-white transition group flex items-center gap-2" title="Shopping Bag">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Bag</span>
                                    {cartCount > 0 && (
                                        <span className="bg-white text-gray-900 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        )}
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
                                    className="px-4 py-2 text-white/40 hover:text-red-500 transition text-[9px] font-black uppercase tracking-widest"
                                    title="Logout"
                                >
                                    Logout
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out border-t border-white/5 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"} overflow-hidden bg-gray-900`}>
                <div className="px-4 pt-2 pb-6 space-y-4">
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block text-[10px] font-black uppercase tracking-[0.2em] py-2 ${location.pathname === "/" ? "text-white" : "text-gray-400"}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/shop"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block text-[10px] font-black uppercase tracking-[0.2em] py-2 ${location.pathname === "/shop" ? "text-white" : "text-gray-400"}`}
                    >
                        Shop All
                    </Link>
                    {userRole === "admin" && (
                        <Link
                            to="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className={`block text-[10px] font-black uppercase tracking-[0.2em] py-2 ${location.pathname === "/admin" ? "text-white" : "text-gray-400"}`}
                        >
                            Admin Dashboard
                        </Link>
                    )}
                    {isLoggedIn && (
                        <Link
                            to="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] py-2 ${location.pathname === "/cart" ? "text-white" : "text-gray-400"}`}
                        >
                            <span>Shopping Bag</span>
                            {cartCount > 0 && <span className="bg-white text-gray-900 px-2 py-0.5 rounded-full text-[8px]">{cartCount}</span>}
                        </Link>
                    )}
                    <hr className="border-white/5" />
                    {isLoggedIn ? (
                        <div className="space-y-4 pt-2">
                            <Link
                                to="/profile"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block text-[10px] font-black uppercase tracking-[0.2em] py-2 ${location.pathname === "/profile" ? "text-white" : "text-gray-400"}`}
                            >
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-[10px] font-black uppercase tracking-[0.2em] py-2 text-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-center px-8 py-3 rounded-sm bg-white text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition shadow-xl mt-4"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
