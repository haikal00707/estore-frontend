import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        API.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching admin products", err))
            .finally(() => setLoading(false));
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

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Store Inventory</h1>
                            <Link to="/" className="text-[10px] bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-sm hover:bg-slate-200 transition uppercase tracking-widest">
                                🏠 View Live Site
                            </Link>
                        </div>
                    </div>
                    <Link to="/add-product" className="bg-slate-900 text-white font-bold py-4 px-10 rounded-sm hover:bg-slate-800 transition shadow-xl shadow-slate-900/10 text-xs uppercase tracking-[0.2em]">
                        + Add New Item
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            </div>
        </div>
    );
}

export default AdminDashboard;
