import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../assets/services/api";

function ProductDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!product);

    useEffect(() => {
        if (!product) {
            setLoading(true);
            API.get(`/products/${id}`)
                .then((res) => {
                    setProduct(res.data.data || res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching product:", err);
                    setLoading(false);
                });
        }
    }, [id, product]);

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

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/")}
                    className="mb-8 flex items-center text-slate-600 font-bold hover:text-slate-900 transition text-[10px] uppercase tracking-widest"
                >
                    <span className="mr-2 text-lg">←</span> Batal Pencarian Item
                </button>

                <div className="bg-white rounded-sm shadow-2xl border border-slate-100 overflow-hidden lg:flex">
                    {/* Image Section */}
                    <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image?.startsWith('http') ? product.image : (product.image_url || `https://via.placeholder.com/600x600?text=${product.name}`)}
                            alt={product.name}
                            className="w-full h-full object-cover max-h-[600px]"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col">
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-sm">
                                {product.category?.name || "General"}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-6">
                            <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            <span className="ml-4 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">
                                In Stock
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button className="w-full bg-slate-900 text-white font-black py-5 rounded-sm hover:bg-black transition shadow-2xl shadow-slate-900/20 text-xs uppercase tracking-[0.3em]">
                                LANJUTKAN TRANSAKSI
                            </button>
                            <button className="w-full bg-white text-slate-400 border border-slate-200 font-bold py-4 rounded-sm hover:bg-slate-50 transition text-[10px] uppercase tracking-widest">
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
