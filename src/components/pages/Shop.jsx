import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../assets/services/api";

function Shop() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get("/products")
            .then(res => {
                const data = res.data.data || res.data;
                if (Array.isArray(data)) {
                    setAllProducts(data);
                    setFilteredProducts(data);
                } else {
                    console.error("Shop API did not return an array:", data);
                }
            })
            .catch(err => console.error("Error fetching products", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const results = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category?.name || "General").toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, allProducts]);

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
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.2em]">Shop Collection</h1>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="SEARCH COLLECTION..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none shadow-sm text-xs font-bold tracking-widest uppercase"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                    <img
                                        src={product.image || `https://via.placeholder.com/400x300?text=${product.name}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                    />
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{product.category?.name || "General"}</span>
                                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-6">{formatPrice(product.price)}</p>
                                    <div className="mt-auto">
                                        <Link
                                            to={`/product/${product.id}`}
                                            state={{ product }}
                                            className="block w-full bg-slate-900 text-white text-center font-bold py-3 rounded-sm hover:bg-slate-800 transition tracking-widest text-[10px] uppercase"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-5xl mb-4">🛒</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">No products found</h3>
                            <p className="text-gray-500">Try searching for something else!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;
