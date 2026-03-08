import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import './Checkout.css';

export default function Checkout() {
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        shipping_address: '', city: '', state: '', zip_code: '', phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await API.post('/orders/create/', form);
            await fetchCart();
            navigate(`/orders/${data.id}`, { state: { justOrdered: true } });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-layout">
                <form onSubmit={handleSubmit} className="checkout-form">
                    <h2>Shipping Information</h2>
                    {error && <div className="auth-error">{error}</div>}
                    <div className="form-group">
                        <label>Shipping Address *</label>
                        <textarea value={form.shipping_address} onChange={update('shipping_address')}
                            placeholder="Enter your full address" required rows={3} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City *</label>
                            <input type="text" value={form.city} onChange={update('city')} placeholder="City" required />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input type="text" value={form.state} onChange={update('state')} placeholder="State" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ZIP Code *</label>
                            <input type="text" value={form.zip_code} onChange={update('zip_code')} placeholder="12345" required />
                        </div>
                        <div className="form-group">
                            <label>Phone *</label>
                            <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+1 (555) 000-0000" required />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary btn-place-order" disabled={loading}>
                        {loading ? 'Placing Order...' : `Place Order — $${parseFloat(cart.total_price).toFixed(2)}`}
                    </button>
                </form>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    {cart.items.map(item => (
                        <div key={item.id} className="checkout-item">
                            <div className="checkout-item-info">
                                <span className="checkout-item-name">{item.product_detail?.name}</span>
                                <span className="checkout-item-qty">× {item.quantity}</span>
                            </div>
                            <span className="checkout-item-price">${parseFloat(item.subtotal).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>${parseFloat(cart.total_price).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
