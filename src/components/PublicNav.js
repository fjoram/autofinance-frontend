import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Public.css';

function PublicNav() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Close mobile menu on route change
    const handleNav = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const getDashboardPath = () => {
        const type = user?.user_metadata?.user_type;
        if (type === 'buyer') return '/buyer-dashboard';
        if (type === 'seller') return '/seller-dashboard';
        if (type === 'bank') return '/bank-dashboard';
        if (type === 'insurance') return '/insurance-dashboard';
        return '/login';
    };

    const handleLogout = async () => {
        setMenuOpen(false);
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav style={{ position: 'sticky', top: 0, zIndex: 200 }}>
            {/* Portal Strip */}
            <div style={{ background: '#0f1b35' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '0', overflowX: 'auto', padding: '0 4rem' }}>
                    {[
                        { icon: '🚗', label: 'Buyer Portal', path: user?.user_metadata?.user_type === 'buyer' ? '/buyer-dashboard' : '/login', color: '#4589ff' },
                        { icon: '🏪', label: 'Seller Portal', path: user?.user_metadata?.user_type === 'seller' ? '/seller-dashboard' : '/login', color: '#42be65' },
                        { icon: '🏦', label: 'Bank Portal', path: user?.user_metadata?.user_type === 'bank' ? '/bank-dashboard' : '/login', color: '#f0a500' },
                        { icon: '🔐', label: 'Admin Portal', path: '/admin-dashboard', color: '#be95ff' },
                    ].map((portal) => (
                        <Link key={portal.label} to={portal.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                                padding: '0.375rem 1rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                borderBottom: '2px solid transparent',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = portal.color; e.currentTarget.style.borderBottomColor = portal.color; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >
                                <span>{portal.icon}</span>{portal.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        <div style={{
            background: 'white',
            borderBottom: '1px solid #e0e0e0',
            padding: '0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '64px',
                padding: '0 4rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ height: '64px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                        <img
                            src="/logo.png"
                            alt="AutoFinance"
                            style={{ height: '260px', width: 'auto', marginTop: '-8px', display: 'block' }}
                        />
                    </div>
                </Link>

                {/* Desktop Center Links */}
                <div className="pub-nav-links">
                    <Link to="/cars" style={{ textDecoration: 'none', color: '#525252', fontWeight: 500, fontSize: '0.9375rem' }}>Browse Cars</Link>
                    <Link to="/how-it-works" style={{ textDecoration: 'none', color: '#525252', fontWeight: 500, fontSize: '0.9375rem' }}>How It Works</Link>
                    <Link to="/about" style={{ textDecoration: 'none', color: '#525252', fontWeight: 500, fontSize: '0.9375rem' }}>About</Link>
                </div>

                {/* Desktop Right Actions */}
                <div className="pub-nav-actions">
                    {user ? (
                        <>
                            <Link to={getDashboardPath()} style={{
                                textDecoration: 'none', background: '#0f62fe', color: 'white',
                                padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem'
                            }}>My Dashboard</Link>
                            <button onClick={handleLogout} style={{
                                background: 'none', border: '1px solid #e0e0e0', padding: '0.5rem 1.25rem',
                                borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#525252'
                            }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                textDecoration: 'none', color: '#0f62fe', fontWeight: 600, fontSize: '0.875rem', padding: '0.5rem 1rem'
                            }}>Login</Link>
                            <Link to="/register" style={{
                                textDecoration: 'none', background: '#0f62fe', color: 'white',
                                padding: '0.5rem 1.25rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.875rem'
                            }}>Register Free</Link>
                        </>
                    )}
                </div>

                {/* Hamburger — mobile only */}
                <button
                    className="pub-hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`pub-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <a onClick={() => handleNav('/cars')} style={{ cursor: 'pointer' }}>Browse Cars</a>
                <a onClick={() => handleNav('/how-it-works')} style={{ cursor: 'pointer' }}>How It Works</a>
                <a onClick={() => handleNav('/about')} style={{ cursor: 'pointer' }}>About</a>
                {user ? (
                    <>
                        <a onClick={() => handleNav(getDashboardPath())} style={{ cursor: 'pointer' }}>My Dashboard</a>
                        <a onClick={handleLogout} className="mobile-cta" style={{ cursor: 'pointer' }}>Logout</a>
                    </>
                ) : (
                    <>
                        <a onClick={() => handleNav('/login')} style={{ cursor: 'pointer' }}>Login</a>
                        <a onClick={() => handleNav('/register')} className="mobile-cta" style={{ cursor: 'pointer' }}>Register Free</a>
                    </>
                )}
            </div>

        </div>
        </nav>
    );
}

export default PublicNav;
