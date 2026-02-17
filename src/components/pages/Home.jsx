import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../assets/services/api";


function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get("/products")
            .then((res) => {
                // Handle Laravel Pagination/Resource wrapper (res.data.data) or simple array (res.data)
                const productData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setProducts(productData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Format currency helper
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
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Welcome to kal-store</h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Discover the best products at unbeatable prices. Shop the latest trends today.</p>
                    <Link to="/shop" className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg transform hover:scale-105 duration-200">Shop Now</Link>
                </div>
            </section>

            {/* Products Grid */}
            <section id="products" className="max-w-7xl mx-auto px-4 py-16 w-full flex-grow">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center relative after:content-[''] after:block after:w-20 after:h-1 after:bg-indigo-600 after:mx-auto after:mt-4">Latest Products</h2>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Belum ada produk yang tersedia saat ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden group">
                                    {/* Check for image_url (API Resource) or image (database field) */}
                                    {product.image || product.image_url ? (
                                        <img
                                            src={product.image_url || (product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`)}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                                        />
                                    ) : (
                                        <div className="text-4xl transform group-hover:scale-110 transition duration-300">📦</div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Electronics</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    <p className="text-xl font-bold text-gray-900 mt-auto">{formatPrice(product.price)}</p>
                                    <button className="mt-4 w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-500/20">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
