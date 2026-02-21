import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../assets/services/api";

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        category_id: "",
        stock: 10
    });
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        API.get("/categories")
            .then(res => {
                console.log("Fetched Categories:", res.data);
                setCategories(res.data);
                if (res.data.length > 0 && !formData.category_id) {
                    setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
                }
            })
            .catch(err => {
                console.error("Could not fetch categories", err);
                alert("Gagal ambil kategori! Pastiin backend nyala & udah di-seed.");
            });
    }, []);

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

        if (!formData.name || !formData.price || !formData.image || !formData.category_id) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            await API.post("/products", {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            });
            alert("Product added successfully to database!");
            navigate("/admin");
        } catch (err) {
            console.error("Failed to add product", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Gagal nambah produk: ${errorMsg}\nCek console buat detailnya.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate("/admin")}
                    className="mb-8 flex items-center text-slate-600 font-bold hover:text-slate-900 transition text-[10px] uppercase tracking-widest"
                >
                    <span className="mr-2 text-lg">←</span> Batal Tambah Item
                </button>

                <div className="bg-white rounded-sm shadow-2xl border border-slate-100 p-10 sm:p-12">
                    <h1 className="text-2xl font-black text-slate-900 mb-12 text-center uppercase tracking-[0.2em]">New Item</h1>

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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none appearance-none"
                            >
                                {categories.length === 0 ? (
                                    <option value="">Loading Categories...</option>
                                ) : (
                                    <>
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Photo</label>
                            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-400 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {preview ? (
                                    <div className="w-full">
                                        <img src={preview} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                                        <p className="mt-2 text-center text-sm text-indigo-600 font-medium">Click to change photo</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-center">
                                        <div className="text-4xl">📸</div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 1MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describe your product..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition outline-none resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-sm hover:bg-black transition shadow-2xl shadow-slate-900/20 text-xs uppercase tracking-[0.3em] mt-10"
                        >
                            Publish Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
