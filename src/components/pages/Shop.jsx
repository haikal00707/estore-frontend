
import { useEffect, useState } from "react";
import API from "../../assets/services/api";

function Shop() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get("/products")
            .then((res) => {
                // Ensure res.data is an array (handle Laravel pagination wrapper if generic)
                // Assuming standard array for now based on Home.jsx
                setProducts(Array.isArray(res.data) ? res.data : res.data.data || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

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
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop All Products</h1>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                    {product.image ? (
                                        <img
                                            src={product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                        />
                                    ) : (
                                        <div className="text-4xl transform group-hover:scale-110 transition duration-300">📦</div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Category</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    <p className="text-xl font-bold text-gray-900 mt-auto">{formatPrice(product.price)}</p>
                                    <button className="mt-4 w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-500/20">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Shop;
