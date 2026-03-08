import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import API from '../api/axios';
import './OrderHistory.css';

function StatusBadge({ status }) {
    const colors = {
        pending: '#f59e0b',
        confirmed: '#3b82f6',
        shipped: '#8b5cf6',
        delivered: '#22c55e',
        cancelled: '#ef4444',
    };
    return (
        <span className="status-badge" style={{ background: `${colors[status]}22`, color: colors[status], borderColor: `${colors[status]}44` }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function OrderDetail() {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/orders/${id}/`).then(res => setOrder(res.data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!order) return <div className="order-page"><p>Order not found.</p></div>;

    return (
        <div className="order-page">
            {location.state?.justOrdered && (
                <div className="order-success-banner">
                    <span>🎉</span>
                    <div>
                        <h3>Order Placed Successfully!</h3>
                        <p>Thank you for your order. We'll start processing it right away.</p>
                    </div>
                </div>
            )}

            <div className="order-detail-header">
                <div>
                    <h1>Order #{order.id}</h1>
                    <p className="order-date">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            <div className="order-detail-grid">
                <div className="order-items-card">
                    <h3>Items</h3>
                    {order.items.map(item => (
                        <div key={item.id} className="order-item-row">
                            <div className="order-item-info">
                                <span className="order-item-name">{item.product_name}</span>
                                <span className="order-item-meta">
                                    {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`}
                                </span>
                            </div>
                            <div className="order-item-numbers">
                                <span>× {item.quantity}</span>
                                <span className="order-item-price">${parseFloat(item.subtotal).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="order-total-row">
                        <strong>Total</strong>
                        <strong>${parseFloat(order.total_amount).toFixed(2)}</strong>
                    </div>
                </div>

                <div className="order-shipping-card">
                    <h3>Shipping Details</h3>
                    <p>{order.shipping_address}</p>
                    <p>{order.city}, {order.state} {order.zip_code}</p>
                    <p>Phone: {order.phone}</p>
                </div>
            </div>

            <Link to="/orders" className="back-link">← Back to All Orders</Link>
        </div>
    );
}

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/orders/').then(res => setOrders(res.data.results || res.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

    return (
        <div className="order-page">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <div className="cart-empty">
                    <span className="cart-empty-icon">📦</span>
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here!</p>
                    <Link to="/products" className="btn-primary">Browse Products</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <Link key={order.id} to={`/orders/${order.id}`} className="order-card">
                            <div className="order-card-header">
                                <span className="order-card-id">Order #{order.id}</span>
                                <StatusBadge status={order.status} />
                            </div>
                            <div className="order-card-body">
                                <p className="order-card-date">{new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                                <p className="order-card-items">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="order-card-total">${parseFloat(order.total_amount).toFixed(2)}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export { OrderList, OrderDetail };
