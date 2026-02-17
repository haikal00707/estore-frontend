import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ID-Estore</h1>
          <p>Discover the best products at unbeatable prices. Shop the latest trends today.</p>
          <a href="#products" className="hero-btn">Shop Now</a>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="products-section">
        <h2 className="section-title">Latest Products</h2>

        {products.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada produk yang tersedia saat ini.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  {/* Placeholder for product image if not available */}
                  <div className="product-image-placeholder">📦</div>
                </div>
                <div className="product-info">
                  <span className="product-category">Electronics</span> {/* Static for now */}
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <button className="add-to-cart-btn">Add to Cart</button>
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
