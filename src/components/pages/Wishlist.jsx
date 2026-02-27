import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function Wishlist() {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

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

    const handleAddToCart = async (product) => {
        const success = await addToCart(product.id, 1);
        if (success) {
            // Optionally remove from wishlist after adding to cart
            // removeFromWishlist(item.id);
            navigate("/cart");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-[0.2em]">Wishlist</h1>
                </div>

                {!wishlist || wishlist.items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-sm border border-slate-100 shadow-sm">
                        <div className="text-6xl mb-6">🖤</div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Wishlist Kosong</h2>
                        <p className="text-slate-500 mb-8">Anda belum memiliki item impian.</p>
                        <button
                            onClick={() => navigate("/shop")}
                            className="inline-block bg-slate-900 text-white px-10 py-4 font-black transition text-xs uppercase tracking-[0.3em] hover:bg-black"
                        >
                            JELAJAHI PRODUK
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col relative group">
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition shadow-sm"
                                >
                                    ✕
                                </button>
                                <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    <img
                                        src={item.product.image || `https://via.placeholder.com/400x300?text=${item.product.name}`}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                    />
                                </div>
                                <div className="p-8 flex flex-col flex-grow text-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        {item.product.category?.name || "General"}
                                    </span>
                                    <h3 className="text-base font-black text-slate-900 mb-1 uppercase tracking-tight">{item.product.name}</h3>
                                    <p className="text-sm font-bold text-slate-500 mb-6">{formatPrice(item.product.price)}</p>
                                    <div className="mt-auto space-y-2">
                                        <button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="block w-full bg-slate-900 text-white text-center font-black py-4 rounded-sm hover:bg-black transition tracking-[0.2em] text-[10px] uppercase shadow-lg shadow-slate-900/10"
                                        >
                                            Tambah ke Tas
                                        </button>
                                        <button
                                            onClick={() => navigate(`/product/${item.product.id}`)}
                                            className="block w-full bg-white text-slate-400 border border-slate-100 font-bold py-3 rounded-sm hover:bg-slate-50 transition text-[9px] uppercase tracking-widest"
                                        >
                                            Detail Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;
