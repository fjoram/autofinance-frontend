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
        <nav style={{
            background: 'white',
            borderBottom: '1px solid #e0e0e0',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 200,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '64px'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect width="34" height="34" rx="7" fill="#0f62fe"/>
                            <path d="M6.5 22.5l3.8-8.5h13.4l3.8 8.5H6.5z" fill="white"/>
                            <rect x="5.5" y="22.5" width="23" height="3" rx="1.5" fill="white"/>
                            <circle cx="11" cy="25.5" r="2.8" fill="#0f62fe" stroke="white" strokeWidth="1.5"/>
                            <circle cx="23" cy="25.5" r="2.8" fill="#0f62fe" stroke="white" strokeWidth="1.5"/>
                            <path d="M12.5 18.5l1.8-4h7.4l1.8 4H12.5z" fill="#0043ce"/>
                            <rect x="7" y="10" width="6" height="1.5" rx="0.75" fill="#f0a500"/>
                            <rect x="21" y="10" width="6" height="1.5" rx="0.75" fill="#1eb53a"/>
                        </svg>
                        <span style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f62fe', letterSpacing: '-0.02em' }}>AutoFinance</span>
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
        </nav>
    );
}

export default PublicNav;
