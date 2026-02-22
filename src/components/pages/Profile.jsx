import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("account"); // 'account' or 'orders'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Data
                const userRes = await API.get("/user");
                setUser(userRes.data);

                // Fetch Orders (Actual API)
                const orderRes = await API.get("/orders");
                // The API might return { data: [...] } or just [...] depending on Laravel's response style
                const apiOrders = orderRes.data.data || orderRes.data || [];
                setOrders(apiOrders);
            } catch (err) {
                console.error("Failed to load profile:", err);
                // Simple fallback to keep UI functional but show error
                setUser({ name: "User", email: "..." });
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-sm shadow-2xl overflow-hidden border border-slate-100">
                    {/* Profile Header */}
                    <div className="bg-slate-900 px-4 sm:px-8 py-10 sm:py-16 text-white relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-white/30">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
                                <p className="text-sm sm:text-base text-indigo-100 opacity-90">{user?.email}</p>
                            </div>
                            <div className="w-full md:w-auto md:ml-auto">
                                <button
                                    onClick={handleLogout}
                                    className="w-full md:w-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 px-8 py-3 rounded-sm transition border border-white/20 font-black text-[10px] uppercase tracking-widest"
                                >
                                    LOGOUT STORE
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap border-b border-gray-100 px-4 sm:px-8 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab("account")}
                            className={`flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-5 font-black text-[10px] transition-all relative uppercase tracking-widest ${activeTab === "account" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            ACCOUNT DETAILS
                            {activeTab === "account" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900 font-black"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-5 font-black text-[10px] transition-all relative uppercase tracking-widest ${activeTab === "orders" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            PURCHASE HISTORY
                            {activeTab === "orders" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900"></div>}
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-10">
                        {activeTab === "account" ? (
                            <div className="max-w-2xl animate-fadeIn">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Full Name</span>
                                            <p className="text-base sm:text-lg font-medium text-gray-800">{user?.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                                            <p className="text-base sm:text-lg font-medium text-gray-800">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="pt-10 border-t border-slate-100">
                                        <button className="text-slate-900 font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-4 decoration-2">Edit Account Specifications</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 mb-4">You haven't ordered anything yet.</p>
                                        <button onClick={() => navigate("/")} className="text-indigo-600 font-bold hover:underline">Start Shopping</button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-100">
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{order.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                            {order.items && order.items.length > 0
                                                                ? order.items[0].product?.name
                                                                : (order.item || "Product Removed")}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                            {formatPrice(order.total_price || 0)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {order.status || 'Success'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default Profile;
