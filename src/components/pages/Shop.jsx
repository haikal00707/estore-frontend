import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../assets/services/api";
import { useCart } from "../../context/CartContext";

function Shop() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(null);

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
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-20 gap-8">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-[0.2em] text-center md:text-left">Shop Collection</h1>
                    <div className="relative w-full md:w-80 lg:w-96 text-center">
                        <input
                            type="text"
                            placeholder="SEARCH COLLECTION..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none shadow-sm text-xs font-bold tracking-widest uppercase"
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
                                    <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 uppercase tracking-tight">{product.name}</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-6">{formatPrice(product.price)}</p>
                                    <div className="mt-auto space-y-2">
                                        <button
                                            onClick={async () => {
                                                setIsAdding(product.id);
                                                const success = await addToCart(product.id, 1);
                                                setTimeout(() => setIsAdding(null), 2000);
                                            }}
                                            className={`block w-full font-black py-4 rounded-sm transition tracking-[0.2em] text-[10px] uppercase shadow-lg shadow-slate-900/10 ${isAdding === product.id ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                                        >
                                            {isAdding === product.id ? 'Added!' : 'Add to Bag'}
                                        </button>
                                        <Link
                                            to={`/product/${product.id}`}
                                            state={{ product }}
                                            className="block w-full bg-white text-slate-400 border border-slate-100 text-center font-bold py-3 rounded-sm hover:bg-slate-50 transition tracking-widest text-[9px] uppercase"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 uppercase tracking-widest">No products found</h3>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Try searching for something else!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;
