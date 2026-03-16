import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

function Register() {
    const [userType, setUserType] = useState('buyer');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: ''
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Register user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        user_type: userType
                    }
                }
            });

            if (authError) throw authError;

            // Step 2: Create profile in appropriate table
            if (userType === 'buyer') {
                const { error: profileError } = await supabase
                    .from('buyers')
                    .insert([{
                        buyer_id: authData.user.id,
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone
                    }]);
                
                if (profileError) throw profileError;
            }

            if (userType === 'seller') {
                const { error: profileError } = await supabase
                    .from('sellers')
                    .insert([{
                        seller_id: authData.user.id,
                        business_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone
                    }]);
                
                if (profileError) throw profileError;
            }

            setMessage('✅ Registration successful! Please check your email to verify your account.');
            
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                
                {/* User Type Selection */}
                <div className="user-type-selector">
                    <button 
                        className={userType === 'buyer' ? 'active' : ''}
                        onClick={() => setUserType('buyer')}
                    >
                        🚗 Buyer
                    </button>
                    <button 
                        className={userType === 'seller' ? 'active' : ''}
                        onClick={() => setUserType('seller')}
                    >
                        💼 Seller
                    </button>
                    <button 
                        className={userType === 'bank' ? 'active' : ''}
                        onClick={() => setUserType('bank')}
                    >
                        🏦 Bank
                    </button>
                    <button 
                        className={userType === 'insurance' ? 'active' : ''}
                        onClick={() => setUserType('insurance')}
                    >
                        🛡️ Insurance
                    </button>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name / Business Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>

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
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+255 XXX XXX XXX"
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
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter password"
                        />
                    </div>

                    {message && (
                        <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
                            {message}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default Register;