import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3><span className="brand-icon">👗</span> StyleVault</h3>
                        <p>Premium fashion curated for every style. Discover your look with our handpicked collections.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/products">Shop All</a></li>
                            <li><a href="/products?category=mens-wear">Men's Wear</a></li>
                            <li><a href="/products?category=womens-wear">Women's Wear</a></li>
                            <li><a href="/products?category=kids-wear">Kids Wear</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Shipping Info</a></li>
                            <li><a href="#">Returns & Exchanges</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Follow Us</h4>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Pinterest</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 StyleVault. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
