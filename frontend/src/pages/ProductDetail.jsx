import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        API.get(`/products/${slug}/`).then(res => {
            setProduct(res.data);
            if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
            if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
        }).catch(() => navigate('/products'))
            .finally(() => setLoading(false));
    }, [slug, navigate]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setAdding(true);
        try {
            await addToCart(product.id, quantity, selectedSize, selectedColor);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!product) return null;

    return (
        <div className="product-detail-page">
            <div className="product-detail-grid">
                <div className="product-image-section">
                    <div className="product-main-image">
                        <img src={product.image || 'https://placehold.co/600x700/1a1a2e/c084fc?text=No+Image'}
                            alt={product.name} />
                    </div>
                </div>

                <div className="product-info-section">
                    <span className="product-detail-category">{product.category_name}</span>
                    <h1 className="product-detail-name">{product.name}</h1>
                    <p className="product-detail-price">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-detail-desc">{product.description}</p>

                    <div className="product-stock-status">
                        {product.in_stock ? (
                            <span className="in-stock">✓ In Stock ({product.stock} available)</span>
                        ) : (
                            <span className="out-of-stock">✗ Out of Stock</span>
                        )}
                    </div>

                    {product.sizes?.length > 0 && (
                        <div className="option-group">
                            <label>Size</label>
                            <div className="option-buttons">
                                {product.sizes.map(s => (
                                    <button key={s} className={`option-btn ${selectedSize === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}>{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors?.length > 0 && (
                        <div className="option-group">
                            <label>Color</label>
                            <div className="option-buttons">
                                {product.colors.map(c => (
                                    <button key={c} className={`option-btn color-option ${selectedColor === c ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(c)}>
                                        <span className="color-swatch" style={{ background: c.toLowerCase() }}></span>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="option-group">
                        <label>Quantity</label>
                        <div className="quantity-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <button className={`btn-add-to-cart ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={!product.in_stock || adding}>
                        {added ? '✓ Added to Cart!' : adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
