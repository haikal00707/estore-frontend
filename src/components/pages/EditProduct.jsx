import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../assets/services/api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        category_id: "",
        stock: 0
    });
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Categories
        API.get("/categories")
            .then(res => {
                console.log("Fetched Categories:", res.data);
                setCategories(res.data);
            })
            .catch(err => {
                console.error("Could not fetch categories", err);
            });

        // Fetch Product Data
        API.get(`/products/${id}`)
            .then(res => {
                const product = res.data;
                setFormData({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: "", // Don't pre-fill base64 image
                    category_id: product.category_id,
                    stock: product.stock
                });
                setPreview(product.image);
                setLoading(false);
            })
            .catch(err => {
                console.error("Could not fetch product", err);
                alert("Product not found");
                navigate("/admin");
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                setFormData(prev => ({
                    ...prev,
                    image: base64String
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData = { ...formData };
            if (!submitData.image) delete submitData.image; // Don't send empty image

            await API.put(`/products/${id}`, {
                ...submitData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            });
            alert("Product updated successfully!");
            navigate("/admin");
        } catch (err) {
            console.error("Failed to update product", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Gagal update produk: ${errorMsg}\nCek console buat detailnya.`);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">Loading Product Data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate("/admin")}
                    className="mb-8 flex items-center text-slate-600 font-bold hover:text-slate-900 transition text-[10px] uppercase tracking-widest"
                >
                    <span className="mr-2 text-lg">←</span> Hubungi Inventory
                </button>

                <div className="bg-white rounded-sm shadow-2xl border border-slate-100 p-10 sm:p-12">
                    <h1 className="text-2xl font-black text-slate-900 mb-12 text-center uppercase tracking-[0.2em]">Update Item</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Cool Sneakers"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 500000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none bg-slate-50/50 text-sm font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category Selection</label>
                            <div className="relative">
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none appearance-none bg-slate-50/50 text-sm font-medium"
                                >
                                    {categories.length === 0 ? (
                                        <option value="">LOADING...</option>
                                    ) : (
                                        <>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Photo</label>
                            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-10 pb-10 border-2 border-slate-200 border-dashed rounded-sm hover:border-slate-400 transition cursor-pointer relative bg-slate-50/30">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {preview ? (
                                    <div className="w-full">
                                        <img src={preview} alt="Preview" className="h-56 w-full object-cover rounded-sm" />
                                        <p className="mt-4 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ganti Foto Item</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 text-center">
                                        <div className="text-3xl grayscale">🖼️</div>
                                        <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                                            Click to upload image
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="..."
                                className="w-full px-4 py-4 rounded-sm border border-slate-200 focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition outline-none resize-none bg-slate-50/50 text-sm font-medium"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-sm hover:bg-black transition shadow-2xl shadow-slate-900/20 text-xs uppercase tracking-[0.3em] mt-10"
                        >
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;
