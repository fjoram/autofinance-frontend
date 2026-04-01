import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

    const getDashboardPath = () => {
        const type = user?.user_metadata?.user_type;
        if (type === 'buyer') return '/buyer-dashboard';
        if (type === 'seller') return '/seller-dashboard';
        if (type === 'bank') return '/bank-dashboard';
        if (type === 'insurance') return '/insurance-dashboard';
        return '/login';
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#525252',
        fontWeight: 500,
        fontSize: '0.9375rem',
        transition: 'color 0.2s'
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
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f62fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🚗 AutoFinance
                    </div>
                </Link>

                {/* Center links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/cars" style={linkStyle}>Browse Cars</Link>
                    <Link to="/how-it-works" style={linkStyle}>How It Works</Link>
                    <Link to="/about" style={linkStyle}>About</Link>
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {user ? (
                        <>
                            <Link to={getDashboardPath()} style={{
                                textDecoration: 'none',
                                background: '#0f62fe',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}>
                                My Dashboard
                            </Link>
                            <button onClick={handleLogout} style={{
                                background: 'none',
                                border: '1px solid #e0e0e0',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: '#525252'
                            }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                color: '#0f62fe',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                padding: '0.5rem 1rem'
                            }}>
                                Login
                            </Link>
                            <Link to="/register" style={{
                                textDecoration: 'none',
                                background: '#0f62fe',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}>
                                Register Free
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default PublicNav;
