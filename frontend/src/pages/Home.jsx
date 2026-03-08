import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [prodRes, catRes] = await Promise.all([
                    API.get('/products/'),
                    API.get('/products/categories/'),
                ]);
                setProducts(prodRes.data.results || prodRes.data);
                setCategories(catRes.data.results || catRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">New Collection 2026</span>
                    <h1 className="hero-title">
                        Elevate Your <span className="gradient-text">Style</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover curated fashion that speaks to your unique identity. From timeless classics to bold statements.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary">Shop Now</Link>
                        <Link to="/products" className="btn-secondary">Browse Collections</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><span className="stat-number">500+</span><span className="stat-label">Products</span></div>
                        <div className="stat"><span className="stat-number">50+</span><span className="stat-label">Brands</span></div>
                        <div className="stat"><span className="stat-number">10k+</span><span className="stat-label">Customers</span></div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-glow"></div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h2>Shop by Category</h2>
                        <p>Find your perfect fit in our curated collections</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat) => (
                            <Link to={`/products?category=${cat.slug}`} key={cat.id} className="category-card">
                                <div className="category-icon">
                                    {cat.name.includes('Men') ? '👔' : cat.name.includes('Women') ? '👗' : cat.name.includes('Kid') ? '🧸' : '✨'}
                                </div>
                                <h3>{cat.name}</h3>
                                <span className="category-count">{cat.product_count} items</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <Link to="/products" className="view-all">View All →</Link>
                </div>
                {loading ? (
                    <div className="loading-grid">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                {!loading && products.length === 0 && (
                    <div className="empty-state">
                        <p>No products yet. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="cta-content">
                    <h2>Ready to refresh your wardrobe?</h2>
                    <p>Join thousands of fashion-forward shoppers</p>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </section>
        </div>
    );
}
