import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../assets/services/api";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
    const { addToCart } = useCart();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!product);
    const [isAdded, setIsAdded] = useState(false);

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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Product Not Found</h2>
                <button
                    onClick={() => navigate("/")}
                    className="bg-slate-900 text-white px-10 py-4 font-black transition text-xs uppercase tracking-[0.3em] hover:bg-black shadow-xl shadow-slate-900/10"
                >
                    Back to Shop
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
                    BACK TO SHOP
                </button>

                <div className="bg-white rounded-sm shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image?.startsWith('http') ? product.image : (product.image_url || `https://via.placeholder.com/600x600?text=${product.name}`)}
                            alt={product.name}
                            className="w-full h-full object-cover max-h-[400px] lg:max-h-[600px]"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col">
                        <div className="mb-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-sm">
                                {product.category?.name || "General"}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-6">
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            <span className="ml-4 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">
                                In Stock
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                                {product.description || "No description available for this product."}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={async () => {
                                    const success = await addToCart(product.id, 1);
                                    if (success) {
                                        setIsAdded(true);
                                        setTimeout(() => setIsAdded(false), 2000);
                                    }
                                }}
                                className={`flex-1 font-black py-5 rounded-sm transition text-xs uppercase tracking-[0.3em] ${isAdded ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50'}`}
                            >
                                {isAdded ? "ADDED TO BAG!" : "ADD TO BAG"}
                            </button>
                            <button
                                onClick={async () => {
                                    const success = await addToCart(product.id, 1);
                                    if (success) navigate("/payment");
                                }}
                                className="flex-1 bg-slate-900 text-white font-black py-5 rounded-sm hover:bg-black transition shadow-2xl shadow-slate-900/20 text-xs uppercase tracking-[0.3em]"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
