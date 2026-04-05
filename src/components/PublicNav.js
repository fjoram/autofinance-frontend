import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Public.css';

function PublicNav() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [howToOpen, setHowToOpen] = useState(false);
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

    const PORTALS = [
        { label: 'Buyer Portal', path: user?.user_metadata?.user_type === 'buyer' ? '/buyer-dashboard' : '/login', color: '#0f62fe' },
        { label: 'Seller Portal', path: user?.user_metadata?.user_type === 'seller' ? '/seller-dashboard' : '/login', color: '#24a148' },
        { label: 'Bank Portal', path: user?.user_metadata?.user_type === 'bank' ? '/bank-dashboard' : '/login', color: '#f0a500' },
        { label: 'Admin Portal', path: '/admin-dashboard', color: '#8a3ffc' },
    ];

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 200,
            background: 'white',
            borderBottom: '1px solid #e0e0e0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                height: '64px',
                padding: '0 4rem',
                gap: '0'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: '1.5rem' }}>
                    <div style={{ height: '64px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="AutoFinance"
                            style={{ height: '260px', width: 'auto', marginTop: '-8px', display: 'block' }} />
                    </div>
                </Link>

                {/* Main links */}
                <div className="pub-nav-links" style={{ marginRight: '0.5rem' }}>
                    {/* How To dropdown */}
                    <div style={{ position: 'relative' }}
                        onMouseEnter={() => setHowToOpen(true)}
                        onMouseLeave={() => setHowToOpen(false)}
                    >
                        <span style={{
                            color: '#525252', fontWeight: 500, fontSize: '0.875rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                            whiteSpace: 'nowrap'
                        }}>
                            How To <span style={{ fontSize: '0.625rem' }}>▾</span>
                        </span>
                        {howToOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0,
                                background: 'white', borderRadius: '6px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                border: '1px solid #e0e0e0',
                                minWidth: '200px', zIndex: 300,
                                padding: '0.5rem 0',
                                marginTop: '0.5rem'
                            }}>
                                {[
                                    { label: 'How It Works', path: '/how-it-works' },
                                    { label: 'For Buyers', path: '/how-it-works#buyers' },
                                    { label: 'For Sellers', path: '/how-it-works#sellers' },
                                    { label: 'For Banks', path: '/how-it-works#banks' },
                                ].map(item => (
                                    <Link key={item.label} to={item.path} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            padding: '0.625rem 1.25rem',
                                            fontSize: '0.875rem', color: '#161616', fontWeight: 500,
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f4f4f4'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >{item.label}</div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/about" style={{ textDecoration: 'none', color: '#525252', fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>About</Link>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '20px', background: '#e0e0e0', margin: '0 0.75rem', flexShrink: 0 }} className="pub-nav-divider" />

                {/* Portal links */}
                <div className="pub-nav-portals">
                    {PORTALS.map(p => (
                        <Link key={p.label} to={p.path} style={{ textDecoration: 'none' }}>
                            <span style={{
                                fontSize: '0.8rem', fontWeight: 600, color: '#525252',
                                padding: '0.25rem 0', whiteSpace: 'nowrap',
                                borderBottom: '2px solid transparent', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = p.color; e.currentTarget.style.borderBottomColor = p.color; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#525252'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >{p.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Auth actions */}
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
                <button className="pub-hamburger" onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu" aria-expanded={menuOpen}>
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div className={`pub-mobile-menu ${menuOpen ? 'open' : ''}`}>
                <a onClick={() => handleNav('/how-it-works')} style={{ cursor: 'pointer' }}>How It Works</a>
                <a onClick={() => handleNav('/how-it-works#buyers')} style={{ cursor: 'pointer', paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6f6f6f' }}>↳ For Buyers</a>
                <a onClick={() => handleNav('/how-it-works#sellers')} style={{ cursor: 'pointer', paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6f6f6f' }}>↳ For Sellers</a>
                <a onClick={() => handleNav('/how-it-works#banks')} style={{ cursor: 'pointer', paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#6f6f6f' }}>↳ For Banks</a>
                <a onClick={() => handleNav('/about')} style={{ cursor: 'pointer' }}>About</a>
                <a onClick={() => handleNav('/login')} style={{ cursor: 'pointer' }}>Buyer Portal</a>
                <a onClick={() => handleNav('/login')} style={{ cursor: 'pointer' }}>Seller Portal</a>
                <a onClick={() => handleNav('/login')} style={{ cursor: 'pointer' }}>Bank Portal</a>
                <a onClick={() => handleNav('/admin-dashboard')} style={{ cursor: 'pointer' }}>Admin Portal</a>
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
