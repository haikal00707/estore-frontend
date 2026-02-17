import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Data
                const userRes = await API.get("/user");
                setUser(userRes.data);

                // Fetch Orders (Mocking or Actual Endpoint)
                try {
                    const orderRes = await API.get("/orders"); // Assuming this endpoint exists
                    setOrders(orderRes.data.data || orderRes.data || []);
                } catch (orderErr) {
                    console.warn("Orders endpoint not found or error:", orderErr);
                    // Fallback to empty orders if API doesn't exist yet
                    setOrders([]);
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await API.post("/logout");
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center py-20">Please log in.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* User Info Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Full Name</label>
                            <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email Address</label>
                            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Orders History Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase History</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.total_price || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {order.status || 'Completed'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
