import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    const [selectedMethod, setSelectedMethod] = useState("");
    const [loading, setLoading] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No product selected for payment</h2>
                <button
                    onClick={() => navigate("/profile")}
                    className="bg-slate-900 text-white px-6 py-2 rounded-sm hover:bg-black transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const paymentMethods = [
        { id: "bca", name: "BCA Virtual Account", icon: "🏦" },
        { id: "mandiri", name: "Mandiri Transfer", icon: "🏢" },
        { id: "gopay", name: "GoPay / QRIS", icon: "📱" },
        { id: "ovo", name: "OVO Cash", icon: "💜" },
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            alert("Silakan pilih metode pembayaran terlebih dahulu.");
            return;
        }

        const newOrder = {
            id: Math.floor(Math.random() * 900) + 100,
            created_at: new Date().toISOString(),
            total_price: product.price,
            payment_method: selectedMethod,
            status: "Menunggu Konfirmasi",
            item: product.name
        };

        setLoading(true);
        try {
            // Real API call to create order
            await API.post("/orders", {
                address: "Demo Address", // In a real app, this would come from a form
                payment_method: selectedMethod,
                items: [
                    {
                        product_id: product.id,
                        quantity: 1,
                    }
                ]
            });

            alert("Pesanan Diterima! Silakan transfer sesuai instruksi. Admin akan segera mengkonfirmasi pembayaran Anda. Anda bisa mengecek status pesanan di halaman Profil.");
            navigate("/profile");
        } catch (err) {
            console.error("Payment API error:", err);
            alert(err.response?.data?.message || "Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const getBankDetails = (methodId) => {
        const banks = {
            bca: { number: "123-456-7890", owner: "KAL STORE", bank: "BCA" },
            mandiri: { number: "900-00-1234567-8", owner: "KAL STORE", bank: "MANDIRI" },
            gopay: { number: "0812-3456-7890", owner: "KAL STORE", bank: "GOPAY" },
            ovo: { number: "0812-3456-7890", owner: "KAL STORE", bank: "OVO" }
        };
        return banks[methodId] || null;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center text-slate-600 font-bold hover:text-slate-900 transition text-[10px] uppercase tracking-widest pl-2"
                >
                    <span className="mr-2 text-lg">←</span> Batal Pembayaran
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Summary Section */}
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-100 p-8 sm:p-10">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Order Summary</h2>
                        <div className="flex gap-4 mb-8">
                            <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                <img
                                    src={product.image?.startsWith('http') ? product.image : (product.image_url || `https://via.placeholder.com/200x200?text=${product.name}`)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{product.name}</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                                    {product.category?.name || "Premium Item"}
                                </p>
                                <p className="text-xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
                                <span className="font-bold text-slate-900">{formatPrice(product.price)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Fee</span>
                                <span className="font-bold text-green-600 text-xs uppercase tracking-widest">Free for Demo</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-6">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Total Amount</span>
                                <span className="text-2xl font-black text-slate-900">{formatPrice(product.price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-100 p-8 sm:p-10">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Select Payment Method</h2>

                        <div className="space-y-4 mb-10">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-sm border transition-all ${selectedMethod === method.id
                                        ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/5 shadow-lg"
                                        : "border-slate-100 hover:border-slate-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{method.icon}</span>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{method.name}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === method.id
                                        ? "border-slate-900 bg-slate-900"
                                        : "border-slate-200"
                                        }`}>
                                        {selectedMethod === method.id && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedMethod && (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm p-6 mb-10 transition-all animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Transfer Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank / Platform</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{getBankDetails(selectedMethod).bank}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Number</span>
                                        <span className="text-lg font-black text-slate-900 tracking-wider selection:bg-slate-900 selection:text-white">
                                            {getBankDetails(selectedMethod).number}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Owner</span>
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{getBankDetails(selectedMethod).owner}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                        * Silakan transfer tepat sesuai nominal Total Amount. Pesanan akan diproses otomatis setelah admin melakukan verifikasi.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={loading || !selectedMethod}
                            className={`w-full font-black py-5 rounded-sm transition shadow-2xl text-xs uppercase tracking-[0.3em] ${loading || !selectedMethod
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-black shadow-slate-900/20"
                                }`}
                        >
                            {loading ? "PROCESSING..." : "KONFIRMASI PEMBAYARAN"}
                        </button>

                        <p className="text-[9px] text-center text-slate-400 mt-6 uppercase tracking-widest font-bold">
                            {/* 🔒 Secure Manual Payment Demo Mode */}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
