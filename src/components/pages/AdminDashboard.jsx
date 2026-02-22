import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("inventory"); // 'inventory' or 'orders'
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        loadOrders();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        API.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching admin products", err))
            .finally(() => setLoading(false));
    };

    const loadOrders = async () => {
        try {
            const orderRes = await API.get("/admin/orders");
            setOrders(orderRes.data.data || orderRes.data || []);
        } catch (err) {
            console.error("Error fetching admin orders", err);
        }
    };

    const handleConfirmPayment = async (orderId) => {
        try {
            await API.put(`/orders/${orderId}/confirm`);
            alert("Pembayaran berhasil dikonfirmasi!");
            loadOrders(); // Refresh the list
        } catch (err) {
            console.error("Confirmation failed", err);
            alert(err.response?.data?.message || "Gagal mengkonfirmasi pembayaran.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`/products/${id}`);
                alert("Product deleted successfully!");
                fetchProducts();
            } catch (err) {
                console.error("Delete failed", err);
                alert("Failed to delete product.");
            }
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 md:mb-12 gap-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest leading-tight">Admin Console</h1>
                            <Link to="/" className="text-[10px] bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-sm hover:bg-slate-200 transition uppercase tracking-widest">
                                🏠 View Live Site
                            </Link>
                        </div>
                    </div>
                    {activeTab === "inventory" && (
                        <Link to="/add-product" className="w-full sm:w-auto bg-slate-900 text-white text-center font-bold py-4 px-10 rounded-sm hover:bg-slate-800 transition shadow-xl shadow-slate-900/10 text-xs uppercase tracking-[0.2em]">
                            + Add New Item
                        </Link>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex bg-white rounded-sm mb-8 border border-gray-100 p-1.5">
                    <button
                        onClick={() => setActiveTab("inventory")}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "inventory" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Store Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "orders" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Customer Orders
                        {orders.filter(o => o.status === "Menunggu Konfirmasi").length > 0 && (
                            <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px] animate-pulse">
                                {orders.filter(o => o.status === "Menunggu Konfirmasi").length} NEW
                            </span>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {activeTab === "inventory" ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover mr-4" />
                                                    <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs">{product.category?.name || "General"}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-6">
                                                    <button
                                                        onClick={() => navigate(`/edit-product/${product.id}`)}
                                                        className="text-slate-900 hover:text-slate-600 font-bold text-xs uppercase tracking-widest underline underline-offset-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-400 font-bold text-xs uppercase tracking-widest underline underline-offset-4"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No orders yet</td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{order.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                                                    {order.items && order.items.length > 0
                                                        ? order.items[0].product?.name
                                                        : (order.item || "Product Removed")}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatPrice(order.total_price)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black uppercase tracking-widest rounded-full ${order.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {order.status === "Menunggu Konfirmasi" && (
                                                        <button
                                                            onClick={() => handleConfirmPayment(order.id)}
                                                            className="bg-slate-900 text-white px-4 py-2 rounded-sm hover:bg-black transition text-[10px] font-black uppercase tracking-widest"
                                                        >
                                                            Konfirmasi Bayar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
