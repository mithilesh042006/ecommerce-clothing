import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import './AdminDashboard.css';

function ImageUploader({ imageUrl, onImageUploaded }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileRef = useRef(null);

    const uploadFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('folder', 'stylevault/products');
            const { data } = await API.post('/products/admin/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onImageUploaded(data.url);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) uploadFile(file);
    };

    return (
        <div className="form-group image-upload-group">
            <label>Product Image</label>
            <div
                className={`image-dropzone ${dragActive ? 'drag-active' : ''} ${imageUrl ? 'has-image' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
            >
                {uploading ? (
                    <div className="upload-loading">
                        <div className="spinner"></div>
                        <span>Uploading to Cloudinary...</span>
                    </div>
                ) : imageUrl ? (
                    <div className="upload-preview">
                        <img src={imageUrl} alt="Preview" />
                        <div className="upload-overlay">
                            <span>Click or drag to replace</span>
                        </div>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <span className="upload-icon">📸</span>
                        <span className="upload-text">Click or drag image here</span>
                        <span className="upload-hint">JPG, PNG, WebP — max 10MB</span>
                    </div>
                )}
            </div>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => uploadFile(e.target.files[0])}
            />
            {imageUrl && (
                <button type="button" className="btn-remove-image" onClick={(e) => { e.stopPropagation(); onImageUploaded(''); }}>
                    Remove Image
                </button>
            )}
        </div>
    );
}

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '', slug: '', description: '', price: '', category: '', sizes: '["S","M","L","XL"]',
        colors: '["Black","White"]', stock: 0, is_active: true, image: '',
    });

    useEffect(() => {
        fetchProducts();
        API.get('/products/categories/').then(r => setCategories(r.data.results || r.data));
    }, []);

    const fetchProducts = () => {
        API.get('/products/admin/products/').then(r => setProducts(r.data.results || r.data));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            category: parseInt(form.category),
            sizes: JSON.parse(form.sizes),
            colors: JSON.parse(form.colors),
        };
        if (editing) {
            await API.put(`/products/admin/products/${editing}/`, payload);
        } else {
            await API.post('/products/admin/products/', payload);
        }
        setShowForm(false);
        setEditing(null);
        resetForm();
        fetchProducts();
    };

    const resetForm = () => {
        setForm({ name: '', slug: '', description: '', price: '', category: '', sizes: '["S","M","L","XL"]', colors: '["Black","White"]', stock: 0, is_active: true, image: '' });
    };

    const handleEdit = (p) => {
        setEditing(p.id);
        setForm({
            name: p.name, slug: p.slug, description: p.description || '', price: p.price,
            category: p.category, sizes: JSON.stringify(p.sizes), colors: JSON.stringify(p.colors),
            stock: p.stock, is_active: p.is_active, image: p.image || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this product?')) {
            await API.delete(`/products/admin/products/${id}/`);
            fetchProducts();
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

    return (
        <div>
            <div className="admin-section-header">
                <h2>Products</h2>
                <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); if (showForm) resetForm(); }}>
                    {showForm ? 'Cancel' : '+ Add Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <ImageUploader
                        imageUrl={form.image}
                        onImageUploaded={(url) => setForm({ ...form, image: url })}
                    />
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input value={form.name} onChange={update('name')} required />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input value={form.slug} onChange={update('slug')} required placeholder="product-name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={update('description')} rows={3} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" step="0.01" value={form.price} onChange={update('price')} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category} onChange={update('category')} required>
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Stock</label>
                            <input type="number" value={form.stock} onChange={update('stock')} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Sizes (JSON)</label>
                            <input value={form.sizes} onChange={update('sizes')} />
                        </div>
                        <div className="form-group">
                            <label>Colors (JSON)</label>
                            <input value={form.colors} onChange={update('colors')} />
                        </div>
                    </div>
                    <label className="checkbox-label">
                        <input type="checkbox" checked={form.is_active} onChange={update('is_active')} />
                        Active
                    </label>
                    <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'} Product</button>
                </form>
            )}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Active</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div className="table-thumb">
                                        {p.image ? (
                                            <img src={p.image} alt={p.name} />
                                        ) : (
                                            <span className="no-thumb">—</span>
                                        )}
                                    </div>
                                </td>
                                <td>{p.name}</td>
                                <td>${parseFloat(p.price).toFixed(2)}</td>
                                <td>{p.stock}</td>
                                <td>{p.is_active ? '✓' : '✗'}</td>
                                <td>
                                    <button className="btn-table-edit" onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="btn-table-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <p className="table-empty">No products yet.</p>}
            </div>
        </div>
    );
}

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', slug: '', description: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = () => {
        API.get('/products/categories/').then(r => setCategories(r.data.results || r.data));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post('/products/categories/', form);
        setForm({ name: '', slug: '', description: '' });
        setShowForm(false);
        fetchCategories();
    };

    const handleDelete = async (slug) => {
        if (confirm('Delete this category?')) {
            await API.delete(`/products/categories/${slug}/`);
            fetchCategories();
        }
    };

    return (
        <div>
            <div className="admin-section-header">
                <h2>Categories</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Category'}
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="form-group"><label>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required placeholder="category-slug" /></div>
                    </div>
                    <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>
                    <button type="submit" className="btn-primary">Create Category</button>
                </form>
            )}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>Name</th><th>Slug</th><th>Products</th><th>Actions</th></tr></thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td><td>{c.slug}</td><td>{c.product_count}</td>
                                <td><button className="btn-table-delete" onClick={() => handleDelete(c.slug)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && <p className="table-empty">No categories yet.</p>}
            </div>
        </div>
    );
}

function OrderManager() {
    const [orders, setOrders] = useState([]);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = () => {
        API.get('/orders/admin/orders/').then(r => setOrders(r.data.results || r.data));
    };

    const updateStatus = async (id, status) => {
        await API.patch(`/orders/admin/orders/${id}/`, { status });
        fetchOrders();
    };

    return (
        <div>
            <h2>Orders</h2>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td>{o.username}</td>
                                <td>${parseFloat(o.total_amount).toFixed(2)}</td>
                                <td><span className={`table-status status-${o.status}`}>{o.status}</span></td>
                                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                <td>
                                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="status-select">
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && <p className="table-empty">No orders yet.</p>}
            </div>
        </div>
    );
}

function UserManager() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get('/auth/users/').then(r => setUsers(r.data.results || r.data));
    }, []);

    return (
        <div>
            <h2>Users</h2>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>Username</th><th>Email</th><th>Name</th><th>Staff</th><th>Joined</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.first_name} {u.last_name}</td>
                                <td>{u.is_staff ? '✓' : '—'}</td>
                                <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <p className="table-empty">No users found.</p>}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [tab, setTab] = useState('products');

    const tabs = [
        { id: 'products', label: 'Products', icon: '📦' },
        { id: 'categories', label: 'Categories', icon: '🏷️' },
        { id: 'orders', label: 'Orders', icon: '📋' },
        { id: 'users', label: 'Users', icon: '👥' },
    ];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
            </div>
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    {tabs.map(t => (
                        <button key={t.id}
                            className={`admin-tab ${tab === t.id ? 'active' : ''}`}
                            onClick={() => setTab(t.id)}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </aside>
                <main className="admin-content">
                    {tab === 'products' && <ProductManager />}
                    {tab === 'categories' && <CategoryManager />}
                    {tab === 'orders' && <OrderManager />}
                    {tab === 'users' && <UserManager />}
                </main>
            </div>
        </div>
    );
}
