import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">👗</span>
                    <span className="brand-text">StyleVault</span>
                </Link>

                <div className="navbar-links">
                    {!isAdmin && <Link to="/products" className="nav-link">Shop</Link>}
                    {isAuthenticated ? (
                        <>
                            {!isAdmin && <Link to="/orders" className="nav-link">My Orders</Link>}
                            {isAdmin && <Link to="/admin" className="nav-link nav-admin">Dashboard</Link>}
                            {!isAdmin && (
                                <Link to="/cart" className="nav-link cart-link">
                                    🛒
                                    {cart.total_items > 0 && <span className="cart-badge">{cart.total_items}</span>}
                                </Link>
                            )}
                            <div className="nav-user">
                                <span className="user-greeting">Hi, {user?.first_name || user?.username}</span>
                                <button onClick={handleLogout} className="btn-logout">Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/register" className="btn-register">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

