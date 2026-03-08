import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
    const [form, setForm] = useState({
        username: '', email: '', first_name: '', last_name: '',
        password: '', password2: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.password2) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                const msg = Object.values(data).flat().join(' ');
                setError(msg);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join StyleVault for the best fashion experience</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={form.first_name} onChange={update('first_name')} placeholder="John" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" value={form.last_name} onChange={update('last_name')} placeholder="Doe" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Username *</label>
                        <input type="text" value={form.username} onChange={update('username')} placeholder="johndoe" required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" value={form.email} onChange={update('email')} placeholder="john@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <input type="password" value={form.password} onChange={update('password')} placeholder="Min 6 characters" required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password *</label>
                        <input type="password" value={form.password2} onChange={update('password2')} placeholder="Repeat password" required />
                    </div>
                    <button type="submit" className="btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
