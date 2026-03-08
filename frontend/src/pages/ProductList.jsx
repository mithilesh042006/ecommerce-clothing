import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        API.get('/products/categories/').then(res => {
            setCategories(res.data.results || res.data);
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        API.get('/products/', { params }).then(res => {
            setProducts(res.data.results || res.data);
        }).finally(() => setLoading(false));
    }, [activeCategory, searchQuery]);

    const setCategory = (slug) => {
        const params = new URLSearchParams(searchParams);
        if (slug) params.set('category', slug);
        else params.delete('category');
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) params.set('search', e.target.value);
        else params.delete('search');
        setSearchParams(params);
    };

    return (
        <div className="product-list-page">
            <div className="product-list-header">
                <h1>Our Collection</h1>
                <div className="search-bar">
                    <input type="text" placeholder="Search products..." value={searchQuery}
                        onChange={handleSearch} />
                </div>
            </div>

            <div className="product-list-layout">
                <aside className="filter-sidebar">
                    <h3>Categories</h3>
                    <ul className="category-filters">
                        <li>
                            <button className={!activeCategory ? 'active' : ''} onClick={() => setCategory('')}>
                                All Products
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat.id}>
                                <button className={activeCategory === cat.slug ? 'active' : ''} onClick={() => setCategory(cat.slug)}>
                                    {cat.name} <span className="filter-count">({cat.product_count})</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="product-list-content">
                    {loading ? (
                        <div className="products-grid">
                            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="products-grid">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
