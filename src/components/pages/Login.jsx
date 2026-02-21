import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await API.post("/login", { email, password });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);
            navigate(user.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError("Invalid email or password. Or check if Backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Demo Login Helper
    const handleDemoLogin = async (role) => {
        setLoading(true);
        setError("");
        const credentials = role === "admin"
            ? { email: "admin@gmail.com", password: "12345678" }
            : { email: "buyer@example.com", password: "password123" };

        try {
            const response = await API.post("/login", credentials);
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);
            alert(`Logged in as ${role.toUpperCase()} (Live Mode)`);
            navigate(user.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError("Gagal masuk mode demo. Pastiin backend nyala & udah di-seed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Minimalist background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>

            <div className="max-w-md w-full">
                <div className="bg-white rounded-sm shadow-2xl border border-slate-100 p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-[0.2em]">Access Account</h2>
                        <p className="text-gray-500 font-medium">Please sign in to your store account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Designation</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ADMIN@KALSTORE.COM"
                                className="w-full px-4 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none bg-slate-50/30 text-sm font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none bg-slate-50/30 text-sm font-medium"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-sm hover:bg-black transition shadow-xl shadow-slate-900/10 text-xs uppercase tracking-[0.3em] mt-10"
                        >
                            {loading ? "VERIFYING..." : "ENTER STORE"}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Demo Accounts (For Testing)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleDemoLogin("admin")}
                                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-sm font-bold text-[10px] hover:bg-slate-200 transition flex flex-col items-center gap-1 uppercase tracking-widest"
                            >
                                <span className="text-xl grayscale mb-1">🛠️</span>
                                Demo Admin
                            </button>
                            <button
                                onClick={() => handleDemoLogin("user")}
                                className="px-4 py-3 border border-slate-200 text-slate-400 rounded-sm font-bold text-[10px] hover:bg-slate-50 transition flex flex-col items-center gap-1 uppercase tracking-widest"
                            >
                                <span className="text-xl grayscale mb-1">👤</span>
                                Demo User
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-bold text-slate-400 mt-10 uppercase tracking-[0.2em]">
                        New Collector? <Link to="/register" className="text-slate-900 hover:underline underline-offset-4">Join Store</Link>
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}} />
        </div>
    );
};

export default Login;
