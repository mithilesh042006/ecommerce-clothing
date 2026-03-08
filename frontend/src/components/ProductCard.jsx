import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const imageUrl = product.image || 'https://placehold.co/400x500/1a1a2e/c084fc?text=No+Image';

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            <div className="product-card-image">
                <img src={imageUrl} alt={product.name} />
                {!product.in_stock && <span className="out-of-stock-badge">Out of Stock</span>}
            </div>
            <div className="product-card-info">
                <span className="product-category">{product.category_name}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-card-footer">
                    <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                    {product.colors?.length > 0 && (
                        <div className="product-colors">
                            {product.colors.slice(0, 4).map((c, i) => (
                                <span key={i} className="color-dot" title={c}
                                    style={{ background: c.toLowerCase() }}></span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
