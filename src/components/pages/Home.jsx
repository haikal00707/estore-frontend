import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../assets/services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get("/products")
            .then(res => {
                const data = res.data.data || res.data;
                if (Array.isArray(data)) {
                    setProducts(data.slice(0, 4));
                } else {
                    console.error("API did not return an array:", data);
                }
            })
            .catch(err => console.error("Error fetching homepage products", err))
            .finally(() => setLoading(false));
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-16 md:py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.4),transparent_70%)]"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">ELEVATE YOUR STYLE</h1>
                    <p className="text-base md:text-xl text-slate-300 mb-10 max-w-xl mx-auto font-medium">Curated collection of premium products. Minimalist design, maximum impact.</p>
                    <Link to="/shop" className="inline-block bg-white text-slate-900 font-extrabold py-4 px-10 rounded-sm hover:bg-slate-100 transition shadow-2xl transform active:scale-95 duration-200 tracking-widest text-sm uppercase">Shop Collection</Link>
                </div>
            </section>

            <section id="products" className="max-w-7xl mx-auto px-4 py-20 w-full flex-grow">
                <h2 className="text-2xl font-black text-slate-900 mb-16 text-center uppercase tracking-[0.2em]">Latest Arrivals</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.slice(0, 4).map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src={product.image || `https://via.placeholder.com/400x300?text=${product.name}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{product.category?.name || "General"}</span>
                                <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-sm font-medium text-slate-500 mb-6">{formatPrice(product.price)}</p>
                                <Link
                                    to={`/product/${product.id}`}
                                    state={{ product }}
                                    className="w-full bg-slate-900 text-white text-center font-bold py-3 rounded-sm hover:bg-slate-800 transition tracking-widest text-[10px] uppercase mt-auto"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/shop" className="text-indigo-600 font-bold hover:underline">View All Products →</Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
