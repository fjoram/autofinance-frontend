import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Login with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            // Get user type from metadata
            const userType = authData.user.user_metadata.user_type;

            // Redirect to appropriate dashboard
            if (userType === 'buyer') {
                navigate('/buyer-dashboard');
            } else if (userType === 'seller') {
                navigate('/seller-dashboard');
            } else if (userType === 'bank') {
                navigate('/bank-dashboard');
            } else if (userType === 'insurance') {
                navigate('/insurance-dashboard');
            } else {
                navigate('/');
            }

        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗 AutoFinance Hub</h1>
                    <h2 style={{ fontSize: '1.5rem', color: '#6c757d' }}>Login</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {message && (
                        <div className="error-message">
                            {message}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a href="/forgot-password" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Forgot Password?
                        </a>
                    </div>
                </form>

                <p className="auth-footer">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;