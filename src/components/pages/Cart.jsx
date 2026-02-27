import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cart() {
    const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const totalPrice = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-[0.2em]">Shopping Bag</h1>
                    {cart?.items?.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition uppercase tracking-widest"
                        >
                            EMPTY BAG
                        </button>
                    )}
                </div>

                {!cart || cart.items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-sm border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Your Bag is Empty</h2>
                        <p className="text-slate-500 mb-8 text-[10px] uppercase tracking-widest">Discover our latest collection today.</p>
                        <button
                            onClick={() => navigate("/shop")}
                            className="inline-block bg-slate-900 text-white px-10 py-4 font-black transition text-xs uppercase tracking-[0.3em] hover:bg-black"
                        >
                            SHOP COLLECTION
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={item.product.image || `https://via.placeholder.com/100x100?text=${item.product.name}`}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                                            {item.product.category?.name || "General"}
                                        </span>
                                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">{item.product.name}</h3>
                                        <p className="text-sm font-bold text-slate-500">{formatPrice(item.product.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-slate-200">
                                            <button
                                                onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-slate-50 transition text-slate-600 font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 text-sm font-black text-slate-900 border-x border-slate-200 min-w-[40px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-slate-50 transition text-slate-600 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="min-w-[120px] text-right hidden sm:block">
                                        <p className="text-sm font-black text-slate-900">{formatPrice(item.product.price * item.quantity)}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[9px] font-black text-slate-300 hover:text-red-500 transition uppercase tracking-widest"
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-2xl sticky top-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-4">
                                    Order Summary
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Total</span>
                                        <span className="text-xl font-black text-slate-900">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/payment")}
                                    className="w-full bg-slate-900 text-white font-black py-5 rounded-sm hover:bg-black transition text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20"
                                >
                                    PROCEED TO CHECKOUT
                                </button>
                                <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest leading-relaxed">
                                    Tax Included. Standard shipping is free for all orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
