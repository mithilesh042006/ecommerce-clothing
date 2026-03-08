import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
    const { cart, updateItem, removeItem, clearCart, loading } = useCart();

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            {cart.items.length === 0 ? (
                <div className="cart-empty">
                    <span className="cart-empty-icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Add some items to get started!</p>
                    <Link to="/products" className="btn-primary">Browse Products</Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.product_detail?.image || 'https://placehold.co/120x150/1a1a2e/c084fc?text=No+Img'}
                                        alt={item.product_detail?.name} />
                                </div>
                                <div className="cart-item-info">
                                    <Link to={`/products/${item.product_detail?.slug}`} className="cart-item-name">
                                        {item.product_detail?.name}
                                    </Link>
                                    <p className="cart-item-meta">
                                        {item.size && <span>Size: {item.size}</span>}
                                        {item.color && <span>Color: {item.color}</span>}
                                    </p>
                                    <p className="cart-item-price">${parseFloat(item.product_detail?.price || 0).toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <p className="cart-item-subtotal">${parseFloat(item.subtotal).toFixed(2)}</p>
                                    <button className="btn-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                        <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Items ({cart.total_items})</span>
                            <span>${parseFloat(cart.total_price).toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${parseFloat(cart.total_price).toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn-primary btn-checkout">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
