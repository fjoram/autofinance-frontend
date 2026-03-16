import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Import your existing dashboard components
// (Keep all your existing mock data and components)

const MOCK_CARS = [
    // ... keep your existing mock data
];

const MOCK_BANKS = [
    // ... keep your existing mock data
];

// ... keep all your existing components (TopNav, Sidebar, BuyerDashboard, etc.)

// Protected Route Component
function ProtectedRoute({ children, allowedUserType }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Check user type if specified
    if (allowedUserType && user.user_metadata.user_type !== allowedUserType) {
        return <Navigate to="/login" />;
    }

    return children;
}

// Main App Component
function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                    path="/buyer-dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="buyer">
                            <>
                                <TopNav user={user} onLogout={handleLogout} />
                                <div className="app-layout">
                                    <BuyerDashboard />
                                </div>
                            </>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/bank-dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="bank">
                            <>
                                <TopNav user={user} onLogout={handleLogout} />
                                <div className="app-layout">
                                    <BankDashboard />
                                </div>
                            </>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/seller-dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="seller">
                            <>
                                <TopNav user={user} onLogout={handleLogout} />
                                <div className="app-layout">
                                    <SellerDashboard />
                                </div>
                            </>
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/insurance-dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="insurance">
                            <>
                                <TopNav user={user} onLogout={handleLogout} />
                                <div className="app-layout">
                                    <InsuranceDashboard />
                                </div>
                            </>
                        </ProtectedRoute>
                    } 
                />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

// Keep ALL your existing components below
// (TopNav, Sidebar, BuyerDashboard, BankDashboard, SellerDashboard, InsuranceDashboard)
// Don't delete anything - just add the Router stuff above

export default App;