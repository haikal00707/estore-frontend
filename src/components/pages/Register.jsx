import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await API.post("/register", { name, email, password, password_confirmation: confirmPassword });
            navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response && err.response.data) {
                // Handle Laravel validation errors or generic message
                const apiError = err.response.data;
                if (apiError.errors) {
                    // Combine all error messages
                    const messages = Object.values(apiError.errors).flat().join(", ");
                    setError(messages);
                } else {
                    setError(apiError.message || "Registration failed. Please try again.");
                }
            } else {
                setError("Network error or server unreachable.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">Sign up to get started</p>

                {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}

                <form className="space-y-5" onSubmit={handleRegister}>
                    <div className="space-y-2">
                        <label htmlFor="name" className="block font-medium text-gray-700 text-sm">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                            required
                        />
                    </div>

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

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block font-medium text-gray-700 text-sm">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white rounded-lg font-semibold text-base hover:bg-indigo-700 transition duration-200">
                        Sign up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
