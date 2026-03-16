import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

function Register() {
    const [userType, setUserType] = useState('buyer');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
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
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        phone: formData.phone,
                        user_type: userType
                    }
                }
            });

            if (authError) throw authError;

            if (!authData.user) {
                throw new Error('User creation failed - no user data returned');
            }

            console.log('User created in Auth:', authData.user.id);

            // Step 2: Create profile based on user type
            // We'll create profile records WITHOUT the custom users table
            
            if (userType === 'buyer') {
                // Just create buyer profile - no users table needed
                const { error: profileError } = await supabase
                    .from('buyers')
                    .insert([{
                        buyer_id: authData.user.id
                        // All other fields are optional or have defaults
                    }]);
                
                if (profileError) {
                    console.error('Buyer profile error:', profileError);
                    // Don't throw - auth user is created, this is just profile
                }
            }

            if (userType === 'seller') {
                const { error: profileError } = await supabase
                    .from('sellers')
                    .insert([{
                        seller_id: authData.user.id,
                        business_name: `${formData.firstName} ${formData.lastName}`,
                        business_type: 'dealer'
                    }]);
                
                if (profileError) {
                    console.error('Seller profile error:', profileError);
                }
            }

            if (userType === 'bank') {
                const { error: profileError } = await supabase
                    .from('banks')
                    .insert([{
                        bank_id: authData.user.id,
                        bank_name: `${formData.firstName} ${formData.lastName}`
                    }]);
                
                if (profileError) {
                    console.error('Bank profile error:', profileError);
                }
            }

            if (userType === 'insurance') {
                const { error: profileError } = await supabase
                    .from('insurance_companies')
                    .insert([{
                        insurance_id: authData.user.id,
                        company_name: `${formData.firstName} ${formData.lastName}`
                    }]);
                
                if (profileError) {
                    console.error('Insurance profile error:', profileError);
                }
            }

            setMessage('✅ Registration successful! You can now login.');
            
            // Clear form
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                phone: ''
            });

            // Auto redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            
        } catch (error) {
            console.error('Registration error:', error);
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
                        type="button"
                    >
                        🚗 Buyer
                    </button>
                    <button 
                        className={userType === 'seller' ? 'active' : ''}
                        onClick={() => setUserType('seller')}
                        type="button"
                    >
                        💼 Seller
                    </button>
                    <button 
                        className={userType === 'bank' ? 'active' : ''}
                        onClick={() => setUserType('bank')}
                        type="button"
                    >
                        🏦 Bank
                    </button>
                    <button 
                        className={userType === 'insurance' ? 'active' : ''}
                        onClick={() => setUserType('insurance')}
                        type="button"
                    >
                        🛡️ Insurance
                    </button>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your last name"
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
