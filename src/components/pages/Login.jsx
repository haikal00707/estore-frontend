import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password");
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">Please sign in to your account</p>

                {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-medium text-gray-700 text-sm">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block font-medium text-gray-700 text-sm">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">Forgot password?</a>
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-lg font-semibold text-base hover:bg-indigo-700 transition duration-200">
                        Sign in
                    </button>
                </form>

                <div className="flex items-center my-6 text-gray-400 text-sm">
                    <div className="flex-1 border-b border-gray-200"></div>
                    <span className="px-4">Or configure with</span>
                    <div className="flex-1 border-b border-gray-200"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition">Google</button>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition">Facebook</button>
                </div>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-500">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
