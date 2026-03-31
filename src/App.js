import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// Mock Data
const MOCK_CARS = [
    {
        id: 1,
        make: "Toyota",
        model: "Land Cruiser Prado",
        year: 2020,
        price: 45000000,
        mileage: 45000,
        transmission: "Automatic",
        fuelType: "Diesel",
        bodyType: "SUV",
        color: "White",
        location: "Dar es Salaam",
        condition: "Used",
        sellerId: 1,
        sellerName: "Premium Motors",
        status: "available"
    },
    {
        id: 2,
        make: "Honda",
        model: "CR-V",
        year: 2019,
        price: 32500000,
        mileage: 38000,
        transmission: "Automatic",
        fuelType: "Petrol",
        bodyType: "SUV",
        color: "Silver",
        location: "Arusha",
        condition: "Used",
        sellerId: 2,
        sellerName: "Elite Auto Sales",
        status: "available"
    },
    {
        id: 3,
        make: "Mercedes-Benz",
        model: "C-Class",
        year: 2021,
        price: 52000000,
        mileage: 15000,
        transmission: "Automatic",
        fuelType: "Petrol",
        bodyType: "Sedan",
        color: "Black",
        location: "Dar es Salaam",
        condition: "Certified Pre-Owned",
        sellerId: 1,
        sellerName: "Premium Motors",
        status: "available"
    }
];

const MOCK_BANKS = [
    {
        id: 1,
        name: "CRDB Bank",
        products: [
            {
                id: 1,
                name: "Auto Loan Premium",
                interestRate: 15.0,
                minDownPayment: 20,
                processingFee: 1.5,
                terms: [12, 24, 36, 48, 60]
            }
        ]
    },
    {
        id: 2,
        name: "NMB Bank",
        products: [
            {
                id: 2,
                name: "Car Finance",
                interestRate: 14.0,
                minDownPayment: 20,
                processingFee: 2.0,
                terms: [12, 24, 36, 48, 60]
            }
        ]
    },
    {
        id: 3,
        name: "Stanbic Bank",
        products: [
            {
                id: 3,
                name: "Vehicle Loan",
                interestRate: 16.0,
                minDownPayment: 25,
                processingFee: 1.0,
                terms: [12, 24, 36, 48, 60]
            }
        ]
    }
];

const MOCK_INSURANCE = [
    { id: 1, name: "AAR Insurance", type: "Comprehensive", premium: 850000, basePremiumPercent: 3.5 },
    { id: 2, name: "Jubilee Insurance", type: "Comprehensive", premium: 780000, basePremiumPercent: 3.0 },
    { id: 3, name: "Heritage Insurance", type: "Third Party", premium: 520000, basePremiumPercent: 2.5 }
];

function calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
}

// AdminSidebar Component - IMPROVED STYLING
function AdminSidebar({ activeView, onNavigate }) {
    return (
        <div className="sidebar" style={{
            width: '260px',
            background: '#fff',
            borderRight: '1px solid #e9ecef',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto'
        }}>
            {/* Header */}
            <div style={{
                padding: '2rem 1.5rem',
                borderBottom: '1px solid #e9ecef',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '0.25rem'
                }}>
                    🔐 Admin Panel
                </h2>
                <p style={{
                    fontSize: '13px',
                    margin: 0,
                    opacity: 0.9
                }}>
                    Platform Management
                </p>
            </div>
            
            {/* Navigation */}
            <nav style={{ padding: '1rem 0' }}>
                <button
                    onClick={() => onNavigate('overview')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'overview' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'overview' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'overview' ? '600' : '400',
                        color: activeView === 'overview' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'overview') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'overview') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>📊</span>
                    <span>Overview</span>
                </button>

                <button
                    onClick={() => onNavigate('seller-verification')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'seller-verification' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'seller-verification' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'seller-verification' ? '600' : '400',
                        color: activeView === 'seller-verification' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'seller-verification') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'seller-verification') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>✅</span>
                    <span>Seller Verification</span>
                </button>

                <button
                    onClick={() => onNavigate('users')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'users' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'users' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'users' ? '600' : '400',
                        color: activeView === 'users' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'users') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'users') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>👥</span>
                    <span>Users</span>
                </button>

                <button
                    onClick={() => onNavigate('cars')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'cars' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'cars' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'cars' ? '600' : '400',
                        color: activeView === 'cars' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'cars') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'cars') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>🚗</span>
                    <span>Car Listings</span>
                </button>

                <button
                    onClick={() => onNavigate('applications')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'applications' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'applications' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'applications' ? '600' : '400',
                        color: activeView === 'applications' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'applications') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'applications') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>📋</span>
                    <span>Applications</span>
                </button>

                <button
                    onClick={() => onNavigate('revenue')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'revenue' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'revenue' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'revenue' ? '600' : '400',
                        color: activeView === 'revenue' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'revenue') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'revenue') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>💰</span>
                    <span>Revenue</span>
                </button>

                <button
                    onClick={() => onNavigate('analytics')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'analytics' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'analytics' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'analytics' ? '600' : '400',
                        color: activeView === 'analytics' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'analytics') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'analytics') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>📈</span>
                    <span>Analytics</span>
                </button>

                <button
                    onClick={() => onNavigate('settings')}
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        border: 'none',
                        background: activeView === 'settings' ? '#f3f4f6' : 'transparent',
                        borderLeft: activeView === 'settings' ? '3px solid #667eea' : '3px solid transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '14px',
                        fontWeight: activeView === 'settings' ? '600' : '400',
                        color: activeView === 'settings' ? '#667eea' : '#6c757d',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (activeView !== 'settings') {
                            e.target.style.background = '#f8f9fa';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeView !== 'settings') {
                            e.target.style.background = 'transparent';
                        }
                    }}
                >
                    <span style={{ fontSize: '18px' }}>⚙️</span>
                    <span>Settings</span>
                </button>
            </nav>
        </div>
    );
}

// AdminOverview Component - Dashboard Homepage
function AdminOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBuyers: 0,
        totalSellers: 0,
        totalBanks: 0,
        totalCars: 0,
        activeCars: 0,
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingSellers: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchAdminStats();
        fetchRecentActivity();
    }, []);

    const fetchAdminStats = async () => {
        setLoading(true);
        try {
            // Count buyers
            const { count: buyersCount } = await supabase
                .from('buyers')
                .select('*', { count: 'exact', head: true });

            // Count sellers
            const { count: sellersCount } = await supabase
                .from('sellers')
                .select('*', { count: 'exact', head: true });

            // Count banks
            const { count: banksCount } = await supabase
                .from('banks')
                .select('*', { count: 'exact', head: true });

            // Count cars
            const { data: carsData } = await supabase
                .from('cars')
                .select('car_id, status');

            // Count applications
            const { data: appsData } = await supabase
                .from('loan_applications')
                .select('application_id, status, loan_amount');

            // Count pending sellers
            const { count: pendingSellersCount } = await supabase
                .from('sellers')
                .select('*', { count: 'exact', head: true })
                .eq('verification_status', 'pending');

            // Calculate revenue (this will be updated when commission system is added)
            const totalRevenue = 0; // Placeholder
            const monthlyRevenue = 0; // Placeholder

            setStats({
                totalUsers: (buyersCount || 0) + (sellersCount || 0) + (banksCount || 0),
                totalBuyers: buyersCount || 0,
                totalSellers: sellersCount || 0,
                totalBanks: banksCount || 0,
                totalCars: carsData?.length || 0,
                activeCars: carsData?.filter(c => c.status === 'available').length || 0,
                totalApplications: appsData?.length || 0,
                pendingApplications: appsData?.filter(a => a.status === 'submitted').length || 0,
                approvedApplications: appsData?.filter(a => a.status === 'approved').length || 0,
                totalRevenue,
                monthlyRevenue,
                pendingSellers: pendingSellersCount || 0
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            // Get recent applications
            const { data: recentApps } = await supabase
                .from('loan_applications')
                .select(`
                    application_id,
                    created_at,
                    status,
                    car_make,
                    car_model,
                    buyer:buyers!buyer_id(user:users!buyers_user_id_fkey(first_name, last_name))
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentActivity(recentApps || []);
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <>
            <div className="card-header">
                <h1 className="card-title">Platform Overview</h1>
                <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                    Welcome back! Here's what's happening on AutoFinance Hub.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
            }}>
                <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-change">
                        Buyers: {stats.totalBuyers} | Sellers: {stats.totalSellers}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Cars Listed</div>
                    <div className="stat-value">{stats.totalCars}</div>
                    <div className="stat-change">{stats.activeCars} active</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Loan Applications</div>
                    <div className="stat-value">{stats.totalApplications}</div>
                    <div className="stat-change">
                        {stats.pendingApplications} pending review
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Pending Verifications</div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>
                        {stats.pendingSellers}
                    </div>
                    <div className="stat-change">Sellers awaiting approval</div>
                </div>
            </div>

            {/* Alerts Section */}
            {stats.pendingSellers > 0 && (
                <div className="card" style={{
                    background: '#fef3c7',
                    borderLeft: '4px solid #f59e0b',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                        ⚠️ Action Required
                    </h3>
                    <p style={{ color: '#78350f', marginBottom: '1rem' }}>
                        You have {stats.pendingSellers} seller(s) waiting for verification.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.hash = '#seller-verification'}
                        style={{ background: '#f59e0b', borderColor: '#f59e0b' }}
                    >
                        Review Sellers →
                    </button>
                </div>
            )}

            {/* Recent Activity */}
            <div className="card">
                <h3 className="card-title">Recent Activity</h3>
                {recentActivity.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                        No recent activity
                    </p>
                ) : (
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Activity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map(activity => (
                                <tr key={activity.application_id}>
                                    <td>{new Date(activity.created_at).toLocaleDateString()}</td>
                                    <td>
                                        {activity.buyer?.user?.first_name} applied for{' '}
                                        {activity.car_make} {activity.car_model}
                                    </td>
                                    <td>
                                        <span className={`badge badge-${
                                            activity.status === 'approved' ? 'success' :
                                            activity.status === 'rejected' ? 'danger' : 'warning'
                                        }`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Platform Health */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="card">
                    <h4 style={{ marginBottom: '1rem' }}>Approval Rate</h4>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                        {stats.totalApplications > 0
                            ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
                            : 0}%
                    </div>
                    <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '0.5rem' }}>
                        {stats.approvedApplications} of {stats.totalApplications} applications approved
                    </p>
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: '1rem' }}>Active Banks</h4>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                        {stats.totalBanks}
                    </div>
                    <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '0.5rem' }}>
                        Partner banks on platform
                    </p>
                </div>
            </div>
        </>
    );
}


// SellerVerification Component
function SellerVerification() {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [verifiedSellers, setVerifiedSellers] = useState([]);
    const [rejectedSellers, setRejectedSellers] = useState([]);
    const [filter, setFilter] = useState('pending'); // 'pending', 'verified', 'rejected'
    const [loading, setLoading] = useState(true);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [verificationNotes, setVerificationNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchSellers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchSellers = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('sellers')
                .select(`
                    *,
                    user:users!sellers_user_id_fkey(email, phone)
                `)
                .order('created_at', { ascending: false });

            if (filter === 'pending') {
                query = query.eq('verification_status', 'pending');
            } else if (filter === 'verified') {
                query = query.eq('verification_status', 'verified');
            } else if (filter === 'rejected') {
                query = query.eq('verification_status', 'rejected');
            }

            const { data, error } = await query;

            if (error) throw error;

            if (filter === 'pending') {
                setPendingSellers(data || []);
            } else if (filter === 'verified') {
                setVerifiedSellers(data || []);
            } else if (filter === 'rejected') {
                setRejectedSellers(data || []);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            alert('Error loading sellers');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (seller) => {
        setSelectedSeller(seller);
        setVerificationNotes('');
        setRejectionReason('');
        setShowDetailModal(true);
    };

    const handleApproveSeller = async () => {
        if (!selectedSeller) return;

        const confirmed = window.confirm(
            `Are you sure you want to APPROVE ${selectedSeller.business_name}?`
        );
        if (!confirmed) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: adminData } = await supabase
                .from('admins')
                .select('admin_id')
                .eq('user_id', user.id)
                .single();

            const { error } = await supabase
                .from('sellers')
                .update({
                    verification_status: 'verified',
                    verified_at: new Date().toISOString(),
                    verified_by: adminData?.admin_id,
                    verification_notes: verificationNotes || null
                })
                .eq('seller_id', selectedSeller.seller_id);

            if (error) throw error;

            alert('✅ Seller approved successfully!');
            setShowDetailModal(false);
            fetchSellers();
        } catch (error) {
            console.error('Error approving seller:', error);
            alert('❌ Error approving seller: ' + error.message);
        }
    };

    const handleRejectSeller = async () => {
        if (!selectedSeller) return;
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to REJECT ${selectedSeller.business_name}?`
        );
        if (!confirmed) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: adminData } = await supabase
                .from('admins')
                .select('admin_id')
                .eq('user_id', user.id)
                .single();

            const { error } = await supabase
                .from('sellers')
                .update({
                    verification_status: 'rejected',
                    verified_by: adminData?.admin_id,
                    rejection_reason: rejectionReason,
                    verification_notes: verificationNotes || null
                })
                .eq('seller_id', selectedSeller.seller_id);

            if (error) throw error;

            alert('❌ Seller rejected');
            setShowDetailModal(false);
            fetchSellers();
        } catch (error) {
            console.error('Error rejecting seller:', error);
            alert('❌ Error rejecting seller: ' + error.message);
        }
    };

    const currentList = 
        filter === 'pending' ? pendingSellers :
        filter === 'verified' ? verifiedSellers :
        rejectedSellers;

    return (
        <>
            <div className="card-header">
                <h1 className="card-title">Seller Verification</h1>
                <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                    Review and approve sellers before they can receive payments
                </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e9ecef'
            }}>
                <button
                    onClick={() => setFilter('pending')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: filter === 'pending' ? '3px solid #667eea' : '3px solid transparent',
                        color: filter === 'pending' ? '#667eea' : '#6c757d',
                        fontWeight: filter === 'pending' ? '600' : '400',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}
                >
                    ⏳ Pending ({pendingSellers.length})
                </button>
                <button
                    onClick={() => setFilter('verified')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: filter === 'verified' ? '3px solid #10b981' : '3px solid transparent',
                        color: filter === 'verified' ? '#10b981' : '#6c757d',
                        fontWeight: filter === 'verified' ? '600' : '400',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}
                >
                    ✅ Verified ({verifiedSellers.length})
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: filter === 'rejected' ? '3px solid #ef4444' : '3px solid transparent',
                        color: filter === 'rejected' ? '#ef4444' : '#6c757d',
                        fontWeight: filter === 'rejected' ? '600' : '400',
                        cursor: 'pointer',
                        fontSize: '15px'
                    }}
                >
                    ❌ Rejected ({rejectedSellers.length})
                </button>
            </div>

            {/* Sellers List */}
            <div className="card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading sellers...</p>
                    </div>
                ) : currentList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <p>No {filter} sellers</p>
                    </div>
                ) : (
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Business Name</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Payment Method</th>
                                <th>Registered</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.map(seller => (
                                <tr key={seller.seller_id}>
                                    <td>
                                        <strong>{seller.business_name}</strong>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                            {seller.business_type || 'Dealership'}
                                        </div>
                                    </td>
                                    <td>{seller.city || 'N/A'}</td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>
                                            {seller.user?.email}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                            {seller.user?.phone || 'No phone'}
                                        </div>
                                    </td>
                                    <td>
                                        {seller.payment_method ? (
                                            <span className="badge badge-info">
                                                {seller.payment_method === 'bank_transfer' ? '🏦 Bank' : '📱 Mobile Money'}
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">⚠️ Not Set</span>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(seller.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleViewDetails(seller)}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Seller Detail Modal */}
            {showDetailModal && selectedSeller && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Review Seller: {selectedSeller.business_name}</h2>
                            <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Business Information */}
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>📋 Business Information</h4>
                                <table style={{ width: '100%', fontSize: '14px' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Business Name:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.business_name}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Business Type:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.business_type || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Location:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.city}, {selectedSeller.region}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Address:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.address || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Email:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.user?.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedSeller.user?.phone || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Registered:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {new Date(selectedSeller.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Payment Information */}
                            <div className="card" style={{ 
                                marginBottom: '1.5rem',
                                background: selectedSeller.payment_method ? '#f0fdf4' : '#fef3c7',
                                borderLeft: selectedSeller.payment_method ? '4px solid #10b981' : '4px solid #f59e0b'
                            }}>
                                <h4 style={{ marginBottom: '1rem' }}>
                                    💳 Payment Information
                                    {!selectedSeller.payment_method && (
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: '#f59e0b', 
                                            marginLeft: '1rem',
                                            fontWeight: '400'
                                        }}>
                                            ⚠️ Not configured yet
                                        </span>
                                    )}
                                </h4>
                                
                                {selectedSeller.payment_method === 'bank_transfer' ? (
                                    <table style={{ width: '100%', fontSize: '14px' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Payment Method:</td>
                                                <td style={{ padding: '0.5rem' }}>🏦 Bank Transfer</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Bank Name:</td>
                                                <td style={{ padding: '0.5rem' }}>{selectedSeller.bank_name || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Account Number:</td>
                                                <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>
                                                    {selectedSeller.bank_account_number || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Account Name:</td>
                                                <td style={{ padding: '0.5rem' }}>{selectedSeller.bank_account_name || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Branch:</td>
                                                <td style={{ padding: '0.5rem' }}>{selectedSeller.bank_branch || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : selectedSeller.payment_method === 'mobile_money' ? (
                                    <table style={{ width: '100%', fontSize: '14px' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Payment Method:</td>
                                                <td style={{ padding: '0.5rem' }}>📱 Mobile Money</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Provider:</td>
                                                <td style={{ padding: '0.5rem' }}>
                                                    {selectedSeller.mobile_money_provider || 'N/A'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone Number:</td>
                                                <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>
                                                    {selectedSeller.mobile_money_number || 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: '#92400e', fontSize: '14px' }}>
                                        ⚠️ Seller has not configured payment details yet. 
                                        You can still verify the business, but they won't receive payments until they add bank/mobile money details.
                                    </p>
                                )}
                            </div>

                            {/* Verification Notes */}
                            <div className="form-group">
                                <label>Verification Notes (Optional)</label>
                                <textarea
                                    className="form-input"
                                    value={verificationNotes}
                                    onChange={(e) => setVerificationNotes(e.target.value)}
                                    rows="3"
                                    placeholder="Add any notes about this verification (visible to other admins only)"
                                ></textarea>
                            </div>

                            {/* Rejection Reason (shown when rejecting) */}
                            {selectedSeller.verification_status === 'pending' && (
                                <div className="form-group">
                                    <label>Rejection Reason (Required if rejecting)</label>
                                    <textarea
                                        className="form-input"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows="2"
                                        placeholder="Explain why this seller is being rejected (seller will see this)"
                                    ></textarea>
                                </div>
                            )}

                            {/* Already Verified/Rejected Info */}
                            {selectedSeller.verification_status !== 'pending' && (
                                <div className="card" style={{ 
                                    background: selectedSeller.verification_status === 'verified' ? '#f0fdf4' : '#fee2e2',
                                    marginTop: '1rem'
                                }}>
                                    <h4 style={{ marginBottom: '0.5rem' }}>
                                        {selectedSeller.verification_status === 'verified' ? '✅ Verified' : '❌ Rejected'}
                                    </h4>
                                    {selectedSeller.verified_at && (
                                        <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                                            Date: {new Date(selectedSeller.verified_at).toLocaleDateString()}
                                        </p>
                                    )}
                                    {selectedSeller.verification_notes && (
                                        <p style={{ fontSize: '13px', marginTop: '0.5rem' }}>
                                            <strong>Notes:</strong> {selectedSeller.verification_notes}
                                        </p>
                                    )}
                                    {selectedSeller.rejection_reason && (
                                        <p style={{ fontSize: '13px', marginTop: '0.5rem', color: '#dc2626' }}>
                                            <strong>Rejection Reason:</strong> {selectedSeller.rejection_reason}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn btn-outline" 
                                onClick={() => setShowDetailModal(false)}
                            >
                                Close
                            </button>
                            
                            {selectedSeller.verification_status === 'pending' && (
                                <>
                                    <button 
                                        className="btn btn-outline" 
                                        onClick={handleRejectSeller}
                                        style={{ color: '#dc2626', borderColor: '#dc2626' }}
                                    >
                                        ❌ Reject
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleApproveSeller}
                                        style={{ background: '#10b981', borderColor: '#10b981' }}
                                    >
                                        ✅ Approve Seller
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


// Main AdminDashboard Component
function AdminDashboard() {
    const [view, setView] = useState('overview');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            // Check if user is admin
            const { data: adminData, error } = await supabase
                .from('admins')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (error || !adminData) {
                alert('⛔ Access Denied: You do not have admin privileges');
                window.location.href = '/';
                return;
            }

            setIsAdmin(true);
        } catch (error) {
            console.error('Error checking admin access:', error);
            alert('Error verifying admin access');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <p>Verifying admin access...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <AdminSidebar activeView={view} onNavigate={setView} />
            <div className="main-content" style={{ marginLeft: '260px', padding: '2rem' }}>
                {view === 'overview' && <AdminOverview />}
                {view === 'seller-verification' && <SellerVerification />}
                {view === 'users' && (
                    <div className="card">
                        <h3>User Management</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... View and manage all users.</p>
                    </div>
                )}
                {view === 'cars' && (
                    <div className="card">
                        <h3>Car Listings Management</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... Moderate and approve car listings.</p>
                    </div>
                )}
                {view === 'applications' && (
                    <div className="card">
                        <h3>Application Management</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... View all loan applications across the platform.</p>
                    </div>
                )}
                {view === 'revenue' && (
                    <div className="card">
                        <h3>Revenue Tracking</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... Track commissions and platform revenue.</p>
                    </div>
                )}
                {view === 'analytics' && (
                    <div className="card">
                        <h3>Platform Analytics</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... View detailed charts and insights.</p>
                    </div>
                )}
                {view === 'settings' && (
                    <div className="card">
                        <h3>Admin Settings</h3>
                        <p style={{ color: '#6c757d' }}>Coming soon... Configure platform settings and manage admin users.</p>
                    </div>
                )}
            </div>
        </>
    );
}


function TopNav({ user, onLogout }) {
    return (
        <nav className="top-nav">
            <div className="nav-container">
                <div className="logo">
                    <svg width="40" height="40" viewBox="0 0 80 80" style={{ marginRight: '10px' }}>
                        <circle cx="40" cy="40" r="38" fill="url(#gradient)" stroke="#fff" strokeWidth="4"/>
                        <path d="M25 35 L40 25 L55 35 L55 50 C55 52 53 54 51 54 L29 54 C27 54 25 52 25 50 Z" fill="white"/>
                        <rect x="35" y="42" width="10" height="12" fill="url(#gradient)"/>
                        <circle cx="32" cy="57" r="4" fill="#333"/>
                        <circle cx="48" cy="57" r="4" fill="#333"/>
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="80" y2="80">
                                <stop offset="0%" stopColor="#667eea"/>
                                <stop offset="100%" stopColor="#764ba2"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    AutoFinance Hub
                </div>
                <ul className="nav-links">
                    <li><a href="/">Magari</a></li>
                    <li><a href="/">Mikopo</a></li>
                    <li><a href="/">Kuhusu Sisi</a></li>
                </ul>
                <div className="user-menu">
                    {user && (
                        <>
                            <div className="user-avatar">
                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span style={{ 
                                marginRight: '1rem',
                                color: 'white',
                                fontWeight: '500'
                            }}>
                                {user.user_metadata?.full_name || user.email || 'User'}
                            </span>
                            <button 
                                onClick={onLogout}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: '#ffffff',
                                    border: '2px solid rgba(255,255,255,0.9)',
                                    borderRadius: '8px',
                                    color: '#667eea',  // Purple text - HIGH CONTRAST
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9ff';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                            >
                                    LOGOUT 
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}





// Sidebar Component
function Sidebar({ userType, activeView, onNavigate }) {
    const menus = {
        buyer: [
            { id: 'browse', label: 'Tafuta Magari', icon: '🚗' },
            { id: 'applications', label: 'Maombi Yangu', icon: '📋' },
            { id: 'saved', label: 'Magari Nipendeayo', icon: '❤️' }
        ],
        seller: [
            { id: 'dashboard', label: 'Dashibodi', icon: '📊' },
            { id: 'listings', label: 'Magari Yangu', icon: '🚗' },
            { id: 'applications', label: 'Maombi', icon: '📋' },
            { id: 'payment-settings', label: 'Mipangilio ya Malipo', icon: '💳' },
            { id: 'add-car', label: 'Ongeza Gari', icon: '➕' }
        ],
        bank: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'applications', label: 'Applications', icon: '📋' },
            { id: 'products', label: 'Loan Products', icon: '💰' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
        ],
        insurance: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'requests', label: 'Policy Requests', icon: '📋' },
            { id: 'products', label: 'Insurance Products', icon: '🛡️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
        ]
    };

    return (
        <div className="sidebar">
            <ul className="sidebar-nav">
                {menus[userType].map(item => (
                    <li key={item.id}>
                        <button
                            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                            style={{ 
                                width: '100%', 
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}




// Buyer Dashboard
function BuyerDashboard() {
    const [view, setView] = useState('browse');
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loanProducts, setLoanProducts] = useState([]);
    const [loanDetails, setLoanDetails] = useState({
        downPayment: 0,
        term: 36
    });

    // Fetch cars from database on mount
    useEffect(() => {
        fetchCarsFromDB();
    }, []);

    const fetchCarsFromDB = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('cars')
                .select(`
                    *,
                    seller:sellers(
                        seller_id,
                        business_name,
                        city,
                        verification_status
                    )
                `)
                .eq('status', 'available')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCars(data || []);
        } catch (error) {
            console.error('Error fetching cars:', error);
            alert('Error loading cars. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch loan products when car is selected
    const handleCarSelect = async (car) => {
        setSelectedCar(car);
		setSelectedImageIndex(0); // ADD THIS LINE
        setLoanDetails({
            downPayment: Math.round(car.price * 0.2),
            term: 36
        });

        // Fetch available loan products
        try {
            const { data, error } = await supabase
                .from('loan_products')
                .select(`
                    *,
                    bank:banks(
                        bank_id,
                        bank_name,
                        bank_code
                    )
                `)
                .eq('is_active', true)
                .gte('max_loan_amount', car.price - Math.round(car.price * 0.2))
                .lte('min_loan_amount', car.price - Math.round(car.price * 0.2));

            if (error) throw error;

            setLoanProducts(data || []);
        } catch (error) {
            console.error('Error fetching loan products:', error);
        }
    };

    
	const getLoanComparison = () => {
    if (!selectedCar || loanProducts.length === 0) return [];
    
    const loanAmount = selectedCar.price - loanDetails.downPayment;
    
    return loanProducts
        // ✅ FILTER: Only show products where selected term <= max term
        .filter(product => {
            // Check if buyer's selected term is within bank's maximum
            if (product.max_loan_term_months) {
                return loanDetails.term <= product.max_loan_term_months;
            }
            // Fallback for old products with loan_terms array
            if (product.loan_terms && Array.isArray(product.loan_terms)) {
                return product.loan_terms.includes(loanDetails.term);
            }
            return false;
        })
        .map(product => {
            const monthlyPayment = calculateMonthlyPayment(
                loanAmount,
                product.interest_rate,
                loanDetails.term
            );
            const totalPayment = monthlyPayment * loanDetails.term;
            const totalInterest = totalPayment - loanAmount;
            
            return {
                productId: product.product_id,
                bankId: product.bank.bank_id,
                bank: product.bank.bank_name,
                product: product.product_name,
                interestRate: product.interest_rate,
                monthlyPayment,
                totalPayment,
                totalInterest,
                processingFee: product.processing_fee_percent
            };
        })
        .sort((a, b) => a.monthlyPayment - b.monthlyPayment);
};
	
	
	
	
    const handleApplyForLoan = async (loanOffer) => {
        if (!selectedCar) return;

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('Please login to apply for a loan');
            return;
        }

        // Get buyer_id
        const { data: buyerData } = await supabase
            .from('buyers')
            .select('buyer_id')
            .eq('user_id', user.id)
            .single();

        if (!buyerData) {
            alert('Buyer profile not found');
            return;
        }

        const loanAmount = selectedCar.price - loanDetails.downPayment;

        // Prepare application data
        const applicationData = {
            buyer_id: buyerData.buyer_id,
            car_id: selectedCar.car_id,
            seller_id: selectedCar.seller_id,
            bank_id: loanOffer.bankId,
            loan_product_id: loanOffer.productId,
            car_make: selectedCar.make,
            car_model: selectedCar.model,
            car_year: selectedCar.year,
            car_price: selectedCar.price,
            down_payment: loanDetails.downPayment,
            loan_amount: loanAmount,
            interest_rate: loanOffer.interestRate,
            loan_term_months: loanDetails.term,
            monthly_payment: loanOffer.monthlyPayment,
            total_interest: loanOffer.totalInterest,
            total_payable: loanOffer.totalPayment,
            processing_fee: (selectedCar.price * loanOffer.processingFee / 100),
            status: 'submitted',
            submitted_at: new Date().toISOString()
        };

        try {
            const { data, error } = await supabase
                .from('loan_applications')
                .insert([applicationData])
                .select()
                .single();

            if (error) throw error;

            alert('✅ Application submitted successfully!');
            setSelectedCar(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('❌ Error submitting application: ' + error.message);
        }
    };

    return (
        <>
            <Sidebar userType="buyer" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'browse' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Browse Cars</h1>
                            <p className="card-subtitle">Find your dream car and get financing</p>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '1.5rem', color: '#667eea' }}>Loading cars...</div>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="card">
                                <p style={{ textAlign: 'center', padding: '2rem' }}>
                                    No cars available at the moment. Check back soon!
                                </p>
                            </div>
                        ) : (
                            <div className="cars-grid">
                                {cars.map(car => (
                                    <div key={car.car_id} className="car-card" onClick={() => handleCarSelect(car)}>
                                      <div 
        className="car-image"
        style={{
            backgroundImage: car.images && car.images.length > 0 
                ? `url(${car.images[0]})` 
                : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}
    >
        {(!car.images || car.images.length === 0) && '🚗'}
    </div>
                                        <div className="car-details">
                                            <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
                                            <div className="car-price">TZS {car.price.toLocaleString()}</div>
                                            <div className="car-specs">
                                                <span className="spec-item">📍 {car.location_city}</span>
                                                <span className="spec-item">⚙️ {car.transmission}</span>
                                                <span className="spec-item">⛽ {car.fuel_type}</span>
                                                <span className="spec-item">🎨 {car.color}</span>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.5rem' }}>
                                                Seller: {car.seller?.business_name}
                                            </div>
                                            <button className="btn btn-primary">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
			
			

            {/* Car Details Modal - WITH IMAGES & GALLERY */}
			
            {selectedCar && (
                <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedCar.year} {selectedCar.make} {selectedCar.model}</h2>
                            <button className="modal-close" onClick={() => setSelectedCar(null)}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            {/* CAR IMAGES SECTION */}
                            {selectedCar.images && selectedCar.images.length > 0 ? (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {/* Main Image */}
                                    <div style={{
                                        height: '400px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        marginBottom: '1rem'
                                    }}>
                                        <img 
                                            src={selectedCar.images[selectedImageIndex]} 
                                            alt={`${selectedCar.make} ${selectedCar.model}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>

                                    {/* Thumbnail Gallery (if multiple images) */}
                                    {selectedCar.images.length > 1 && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                            gap: '0.5rem'
                                        }}>
                                            {selectedCar.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`View ${index + 1}`}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    style={{
                                                        width: '100%',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        border: index === selectedImageIndex ? '2px solid #667eea' : '2px solid #e9ecef',
                                                        transition: 'all 0.2s'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Placeholder if no images */
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    height: '300px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '120px',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem'
                                }}>
                                    🚗
                                </div>
                            )}

                            <div className="card">
                                <h3>Car Details</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Price:</td>
                                            <td style={{ padding: '0.5rem' }}>TZS {selectedCar.price.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Mileage:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.mileage.toLocaleString()} km</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Transmission:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.transmission}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Fuel Type:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.fuel_type}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Color:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.color}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Body Type:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.body_type}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Condition:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.condition}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Location:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.location_city}, {selectedCar.location_region}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Seller:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.seller?.business_name}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                {/* Show Features if available */}
                                {selectedCar.features && selectedCar.features.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Features:</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {selectedCar.features.map((feature, idx) => (
                                                <span key={idx} style={{
                                                    background: '#f8f9fa',
                                                    padding: '4px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    color: '#495057'
                                                }}>
                                                    ✓ {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Show Description if available */}
                                {selectedCar.description && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <h4 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: '600' }}>Description:</h4>
                                        <p style={{ fontSize: '14px', color: '#6c757d', lineHeight: '1.6' }}>
                                            {selectedCar.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="card">
                                <h3>Loan Calculator</h3>
                                <div className="form-group">
                                    <label>Down Payment (TZS)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={loanDetails.downPayment}
                                        onChange={(e) => setLoanDetails({ ...loanDetails, downPayment: parseInt(e.target.value) })}
                                        min="0"
                                        max={selectedCar.price}
                                    />
                                </div>
                              
							  <div className="form-group">
    <label>Loan Term (months)</label>
    <select
        className="form-select"
        value={loanDetails.term}
        onChange={(e) => setLoanDetails({ ...loanDetails, term: parseInt(e.target.value) })}
    >
        {/* Get unique loan terms from all available products */}
        {[...new Set(
            loanProducts.flatMap(product => 
                product.loan_terms && Array.isArray(product.loan_terms) 
                    ? product.loan_terms 
                    : []
            )
        )].sort((a, b) => a - b).map(term => (
            <option key={term} value={term}>{term} months</option>
        ))}
        
        {/* Fallback if no products loaded yet */}
        {loanProducts.length === 0 && (
            <>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
            </>
        )}
    </select>
</div>
							  
							  
							  
							  
							  
                            </div>

                            <div className="card">
                                <h3>Compare Bank Offers</h3>
                                {getLoanComparison().length === 0 ? (
                                    <p style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                                        Loading loan offers...
                                    </p>
                                ) : (
                                    <table className="comparison-table">
                                        <thead>
                                            <tr>
                                                <th>Bank</th>
                                                <th>Interest Rate</th>
                                                <th>Monthly Payment</th>
                                                <th>Total Interest</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getLoanComparison().map((offer, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="bank-name">
                                                            <div className="bank-logo">{offer.bank.charAt(0)}</div>
                                                            <div>
                                                                <strong>{offer.bank}</strong>
                                                                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                                                    {offer.product}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{offer.interestRate}%</td>
                                                    <td><strong>TZS {offer.monthlyPayment.toLocaleString()}</strong></td>
                                                    <td>TZS {offer.totalInterest.toLocaleString()}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleApplyForLoan(offer)}
                                                        >
                                                            Apply
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setSelectedCar(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


// Enhanced Loan Products View Component with MAX LOAN TERM
function ProductsView() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [bankId, setBankId] = useState(null);
    const [formData, setFormData] = useState({
        product_name: '',
        interest_rate: '',
        interest_type: 'fixed',
        min_loan_amount: '',
        max_loan_amount: '',
        min_down_payment_percent: '',
        processing_fee_percent: '',
        max_loan_term_months: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: bankData } = await supabase
                .from('banks')
                .select('bank_id, bank_name')
                .eq('user_id', user.id)
                .single();

            if (!bankData) {
                console.error('Bank profile not found');
                return;
            }

            setBankId(bankData.bank_id);

            const { data, error } = await supabase
                .from('loan_products')
                .select('*')
                .eq('bank_id', bankData.bank_id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setFormData({
            product_name: '',
            interest_rate: '',
            interest_type: 'fixed',
            min_loan_amount: '',
            max_loan_amount: '',
            min_down_payment_percent: '',
            processing_fee_percent: '',
            max_loan_term_months: ''
        });
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            product_name: product.product_name,
            interest_rate: product.interest_rate,
            interest_type: product.interest_type || 'fixed',
            min_loan_amount: product.min_loan_amount,
            max_loan_amount: product.max_loan_amount,
            min_down_payment_percent: product.min_down_payment_percent,
            processing_fee_percent: product.processing_fee_percent,
            max_loan_term_months: product.max_loan_term_months || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                bank_id: bankId,
                product_name: formData.product_name,
                interest_rate: parseFloat(formData.interest_rate),
                interest_type: formData.interest_type,
                min_loan_amount: parseFloat(formData.min_loan_amount),
                max_loan_amount: parseFloat(formData.max_loan_amount),
                min_down_payment_percent: parseFloat(formData.min_down_payment_percent),
                processing_fee_percent: parseFloat(formData.processing_fee_percent),
                max_loan_term_months: parseInt(formData.max_loan_term_months),
                is_active: true
            };

            if (editingProduct) {
                // Update existing product
                const { error } = await supabase
                    .from('loan_products')
                    .update(productData)
                    .eq('product_id', editingProduct.product_id);

                if (error) throw error;
                alert('✅ Product updated successfully!');
            } else {
                // Create new product
                const { error } = await supabase
                    .from('loan_products')
                    .insert([productData]);

                if (error) throw error;
                alert('✅ Product created successfully!');
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('❌ Error saving product: ' + error.message);
        }
    };

    const handleToggleActive = async (product) => {
        try {
            const { error } = await supabase
                .from('loan_products')
                .update({ is_active: !product.is_active })
                .eq('product_id', product.product_id);

            if (error) throw error;

            alert(`✅ Product ${!product.is_active ? 'activated' : 'deactivated'}!`);
            fetchProducts();
        } catch (error) {
            console.error('Error toggling product status:', error);
            alert('❌ Error updating product status');
        }
    };

    return (
        <>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="card-title">Your Loan Products</h3>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Add New Product
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        <p>No loan products yet.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Click "Add New Product" to create your first loan product.
                        </p>
                    </div>
                ) : (
                    <table className="comparison-table" style={{ marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Interest Rate</th>
                                <th>Min Loan</th>
                                <th>Max Loan</th>
                                <th>Max Term</th>
                                <th>Min Down Payment</th>
                                <th>Processing Fee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.product_id}>
                                    <td><strong>{product.product_name}</strong></td>
                                    <td>{product.interest_rate}%</td>
                                    <td>TZS {(parseFloat(product.min_loan_amount) / 1000000).toFixed(1)}M</td>
                                    <td>TZS {(parseFloat(product.max_loan_amount) / 1000000).toFixed(1)}M</td>
                                    <td>
                                        <strong>Up to {product.max_loan_term_months} months</strong>
                                    </td>
                                    <td>{product.min_down_payment_percent}%</td>
                                    <td>{product.processing_fee_percent}%</td>
                                    <td>
                                        {product.is_active ? (
                                            <span className="badge badge-success">Active</span>
                                        ) : (
                                            <span className="badge badge-danger">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleToggleActive(product)}
                                                style={{
                                                    background: product.is_active ? '#dc3545' : '#28a745',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                {product.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingProduct ? 'Edit Loan Product' : 'Add New Loan Product'}
                            </h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.product_name}
                                        onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                                        required
                                        placeholder="e.g., Auto Loan Premium"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Interest Rate (%) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-input"
                                        value={formData.interest_rate}
                                        onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                                        required
                                        placeholder="e.g., 15.5"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Minimum Loan Amount (TZS) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.min_loan_amount}
                                        onChange={(e) => setFormData({...formData, min_loan_amount: e.target.value})}
                                        required
                                        placeholder="e.g., 5000000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Maximum Loan Amount (TZS) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.max_loan_amount}
                                        onChange={(e) => setFormData({...formData, max_loan_amount: e.target.value})}
                                        required
                                        placeholder="e.g., 100000000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Maximum Loan Term *</label>
                                    <select
                                        className="form-select"
                                        value={formData.max_loan_term_months}
                                        onChange={(e) => setFormData({...formData, max_loan_term_months: e.target.value})}
                                        required
                                    >
                                        <option value="">Select maximum term...</option>
                                        <option value="12">12 months</option>
                                        <option value="24">24 months</option>
                                        <option value="36">36 months</option>
                                        <option value="48">48 months</option>
                                        <option value="60">60 months</option>
                                    </select>
                                    <small style={{ color: '#6c757d', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                                        💡 Buyers can choose any term up to this maximum
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Minimum Down Payment (%) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-input"
                                        value={formData.min_down_payment_percent}
                                        onChange={(e) => setFormData({...formData, min_down_payment_percent: e.target.value})}
                                        required
                                        placeholder="e.g., 20"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Processing Fee (%) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-input"
                                        value={formData.processing_fee_percent}
                                        onChange={(e) => setFormData({...formData, processing_fee_percent: e.target.value})}
                                        required
                                        placeholder="e.g., 1.5"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-outline" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

// DisbursementModal Component
function DisbursementModal({ application, onClose, onSuccess }) {
    const [disbursementData, setDisbursementData] = useState({
        reference: '',
        notes: '',
        confirmed: false
    });
    const [processing, setProcessing] = useState(false);

    const handleDisburse = async () => {
        if (!disbursementData.reference.trim()) {
            alert('❌ Please enter payment reference number');
            return;
        }

        if (!disbursementData.confirmed) {
            alert('❌ Please confirm that payment details are correct');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to disburse TZS ${application.loan_amount.toLocaleString()}?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setProcessing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error: loanError } = await supabase
                .from('loan_applications')
                .update({
                    status: 'disbursed',
                    disbursement_date: new Date().toISOString(),
                    disbursement_reference: disbursementData.reference,
                    disbursement_method: application.seller?.payment_method || 'bank_transfer',
                    disbursement_amount: application.loan_amount,
                    disbursed_by: user.id,
                    disbursement_notes: disbursementData.notes || null
                })
                .eq('application_id', application.application_id);

            if (loanError) throw loanError;

            const { error: carError } = await supabase
                .from('cars')
                .update({ status: 'sold' })
                .eq('car_id', application.car_id);

            if (carError) throw carError;

            alert('✅ Disbursement completed successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error processing disbursement:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">💸 Disburse Loan</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="card" style={{ background: '#f0fdf4', marginBottom: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: '#065f46' }}>📋 Loan Summary</h4>
                        <table style={{ width: '100%', fontSize: '14px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Loan Amount:</td>
                                    <td style={{ padding: '0.5rem', fontSize: '16px', fontWeight: '700', color: '#065f46' }}>
                                        TZS {application.loan_amount?.toLocaleString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Car:</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {application.car_make} {application.car_model} {application.car_year}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Buyer:</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {application.buyer?.user?.first_name} {application.buyer?.user?.last_name}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="card" style={{ 
                        background: application.seller?.payment_method ? '#fef3c7' : '#fee2e2',
                        borderLeft: application.seller?.payment_method ? '4px solid #f59e0b' : '4px solid #dc2626',
                        marginBottom: '1.5rem'
                    }}>
                        <h4 style={{ marginBottom: '1rem' }}>
                            💳 Payment Destination
                            {!application.seller?.payment_method && (
                                <span style={{ color: '#dc2626', fontSize: '13px', marginLeft: '1rem', fontWeight: '400' }}>
                                    ⚠️ Not configured
                                </span>
                            )}
                        </h4>

                        {application.seller?.payment_method === 'bank_transfer' ? (
                            <table style={{ width: '100%', fontSize: '14px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Payment Method:</td>
                                        <td style={{ padding: '0.5rem' }}>🏦 Bank Transfer</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Bank Name:</td>
                                        <td style={{ padding: '0.5rem' }}>{application.seller?.bank_name}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Account Number:</td>
                                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '15px', fontWeight: '600' }}>
                                            {application.seller?.bank_account_number}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Account Name:</td>
                                        <td style={{ padding: '0.5rem' }}>{application.seller?.bank_account_name}</td>
                                    </tr>
                                    {application.seller?.bank_branch && (
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Branch:</td>
                                            <td style={{ padding: '0.5rem' }}>{application.seller?.bank_branch}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : application.seller?.payment_method === 'mobile_money' ? (
                            <table style={{ width: '100%', fontSize: '14px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Payment Method:</td>
                                        <td style={{ padding: '0.5rem' }}>📱 Mobile Money</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Provider:</td>
                                        <td style={{ padding: '0.5rem' }}>{application.seller?.mobile_money_provider}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone Number:</td>
                                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '15px', fontWeight: '600' }}>
                                            {application.seller?.mobile_money_number}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>
                                ⚠️ Seller has not configured payment details. Cannot disburse funds.
                            </p>
                        )}

                        <p style={{ marginTop: '1rem', fontSize: '13px', color: '#92400e', marginBottom: 0 }}>
                            ⚠️ <strong>Important:</strong> Verify these details before transferring funds
                        </p>
                    </div>

                    {application.seller?.payment_method && (
                        <>
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Payment Reference Number *</label>
                                <input 
                                    type="text"
                                    className="form-input"
                                    value={disbursementData.reference}
                                    onChange={(e) => setDisbursementData({...disbursementData, reference: e.target.value})}
                                    placeholder="e.g., TRX-2024-001234"
                                    disabled={processing}
                                />
                                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                                    Enter transaction reference from your bank
                                </small>
                            </div>

                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Notes (Optional)</label>
                                <textarea 
                                    className="form-input"
                                    value={disbursementData.notes}
                                    onChange={(e) => setDisbursementData({...disbursementData, notes: e.target.value})}
                                    rows="2"
                                    placeholder="Additional notes"
                                    disabled={processing}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox"
                                        checked={disbursementData.confirmed}
                                        onChange={(e) => setDisbursementData({...disbursementData, confirmed: e.target.checked})}
                                        disabled={processing}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                        I confirm payment details are correct and funds have been transferred
                                    </span>
                                </label>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose} disabled={processing}>
                        Cancel
                    </button>
                    
                    {application.seller?.payment_method && (
                        <button 
                            className="btn btn-primary"
                            onClick={handleDisburse}
                            disabled={processing || !disbursementData.confirmed || !disbursementData.reference.trim()}
                            style={{ background: '#10b981', borderColor: '#10b981', minWidth: '180px' }}
                        >
                            {processing ? '⏳ Processing...' : '✅ Confirm Disbursement'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// PostApprovalTracker Component
function PostApprovalTracker({ application, onUpdate }) {
    const [statuses, setStatuses] = useState({
        inspection_status: application.inspection_status || 'pending',
        gps_tracker_status: application.gps_tracker_status || 'pending',
        logbook_status: application.logbook_status || 'pending'
    });
    const [updating, setUpdating] = useState(false);

    const updateStatus = async (field, value) => {
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('loan_applications')
                .update({ [field]: value })
                .eq('application_id', application.application_id);

            if (error) throw error;

            setStatuses({ ...statuses, [field]: value });
            alert(`✅ ${field.replace(/_/g, ' ')} updated!`);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const allComplete = 
        statuses.inspection_status === 'passed' &&
        statuses.gps_tracker_status === 'installed' &&
        statuses.logbook_status === 'collected';

    return (
        <div className="card" style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>📋 Post-Approval Checklist</h4>
            
            {allComplete && (
                <div style={{
                    background: '#d1fae5',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: '#065f46',
                    fontWeight: '600'
                }}>
                    ✅ All steps complete! You can now disburse funds to the seller.
                </div>
            )}

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h5 style={{ margin: 0, fontSize: '15px' }}>🔍 Vehicle Inspection</h5>
                    <span className={`badge badge-${
                        statuses.inspection_status === 'passed' ? 'success' :
                        statuses.inspection_status === 'failed' ? 'danger' : 'warning'
                    }`}>
                        {statuses.inspection_status}
                    </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    Physical inspection of vehicle condition
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('inspection_status', 'scheduled')}
                        disabled={updating}
                    >
                        📅 Scheduled
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('inspection_status', 'in_progress')}
                        disabled={updating}
                    >
                        ⏳ In Progress
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('inspection_status', 'passed')}
                        disabled={updating}
                        style={{ color: statuses.inspection_status === 'passed' ? '#10b981' : '#6c757d' }}
                    >
                        ✅ Passed
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('inspection_status', 'failed')}
                        disabled={updating}
                        style={{ color: statuses.inspection_status === 'failed' ? '#dc2626' : '#6c757d' }}
                    >
                        ❌ Failed
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h5 style={{ margin: 0, fontSize: '15px' }}>📍 GPS Tracker</h5>
                    <span className={`badge badge-${
                        statuses.gps_tracker_status === 'installed' ? 'success' : 'warning'
                    }`}>
                        {statuses.gps_tracker_status}
                    </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    GPS tracking device installed
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('gps_tracker_status', 'pending')}
                        disabled={updating}
                    >
                        ⏳ Pending
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('gps_tracker_status', 'ordered')}
                        disabled={updating}
                    >
                        📦 Ordered
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('gps_tracker_status', 'installed')}
                        disabled={updating}
                        style={{ color: statuses.gps_tracker_status === 'installed' ? '#10b981' : '#6c757d' }}
                    >
                        ✅ Installed
                    </button>
                </div>
            </div>

            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h5 style={{ margin: 0, fontSize: '15px' }}>📖 Logbook / Title</h5>
                    <span className={`badge badge-${
                        statuses.logbook_status === 'collected' ? 'success' : 'warning'
                    }`}>
                        {statuses.logbook_status}
                    </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    Original vehicle documents
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('logbook_status', 'pending')}
                        disabled={updating}
                    >
                        ⏳ Pending
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('logbook_status', 'requested')}
                        disabled={updating}
                    >
                        📨 Requested
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => updateStatus('logbook_status', 'collected')}
                        disabled={updating}
                        style={{ color: statuses.logbook_status === 'collected' ? '#10b981' : '#6c757d' }}
                    >
                        ✅ Collected
                    </button>
                </div>
            </div>
        </div>
    );
}



// Applications View Component
function ApplicationsView({ applications, loading, onSelectApplication, getStatusBadge }) {
    const [filter, setFilter] = useState('all');
    const [showDisbursementModal, setShowDisbursementModal] = useState(null);

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        if (filter === 'pending') return app.status === 'submitted' || app.status === 'under_review';
        if (filter === 'approved') return app.status === 'approved';
        if (filter === 'rejected') return app.status === 'rejected';
        return true;
    });

    return (
        <>
            {/* Filter Buttons */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({applications.length})
                    </button>
                    <button 
                        className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length})
                    </button>
                    <button 
                        className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved ({applications.filter(a => a.status === 'approved').length})
                    </button>
                    <button 
                        className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected ({applications.filter(a => a.status === 'rejected').length})
                    </button>
                </div>
            </div>

            {/* Applications Table */}
            <div className="card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
                        Loading applications...
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                        {filter === 'all' 
                            ? 'No applications yet. Applications will appear here when buyers apply for loans.'
                            : `No ${filter} applications.`}
                    </div>
                ) : (
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Applicant</th>
                                <th>Vehicle</th>
                                <th>Loan Amount</th>
                                <th>Monthly Payment</th>
                                <th>Term</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map(app => (
                                <tr key={app.application_id}>
                                    <td>
                                        {new Date(app.submitted_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div>
                                            <strong>
                                                {app.buyer?.user?.first_name} {app.buyer?.user?.last_name}
                                            </strong>
                                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                                {app.buyer?.user?.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{app.car_make} {app.car_model}</strong>
                                            <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                                {app.car_year}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>TZS {parseFloat(app.loan_amount).toLocaleString()}</strong>
                                    </td>
                                    <td>
                                        TZS {parseFloat(app.monthly_payment).toLocaleString()}
                                    </td>
                                    <td>{app.loan_term_months} months</td>
                                    <td>{getStatusBadge(app.status)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {app.status === 'submitted' && (
                                                <button 
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => onSelectApplication(app)}
                                                >
                                                    Review
                                                </button>
                                            )}
                                            
                                            {app.status === 'approved' && 
                                             app.inspection_status === 'passed' &&
                                             app.gps_tracker_status === 'installed' &&
                                             app.logbook_status === 'collected' && (
                                                <button 
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => setShowDisbursementModal(app)}
                                                    style={{ background: '#10b981', borderColor: '#10b981' }}
                                                >
                                                    💸 Disburse
                                                </button>
                                            )}
                                            
                                            {app.status === 'disbursed' && (
                                                <div style={{ fontSize: '12px' }}>
                                                    <div style={{ color: '#10b981', fontWeight: '600' }}>✅ Disbursed</div>
                                                    <div style={{ color: '#6c757d' }}>Ref: {app.disbursement_reference}</div>
                                                </div>
                                            )}
                                            
                                            {app.status !== 'submitted' && (
                                                <button 
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => onSelectApplication(app)}
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Disbursement Modal */}
            {showDisbursementModal && (
                <DisbursementModal
                    application={showDisbursementModal}
                    onClose={() => setShowDisbursementModal(null)}
                    onSuccess={() => {
                        setShowDisbursementModal(null);
                        window.location.reload();
                    }}
                />
            )}
        </>
    );
}






// Bank Dashboard
function BankDashboard() {
    const [view, setView] = useState('dashboard');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch applications on mount
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            // Get current bank user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get bank_id
            const { data: bankData } = await supabase
                .from('banks')
                .select('bank_id')
                .eq('user_id', user.id)
                .single();

            if (!bankData) {
                console.error('Bank profile not found');
                return;
            }

            // Fetch applications for this bank
            const { data, error } = await supabase
                .from('loan_applications')
                .select(`
                    *,
                    buyer:buyers!buyer_id(
                        buyer_id,
                        user:users!buyers_user_id_fkey(
                            first_name,
                            last_name,
                            email,
                            phone
                        )
                    ),
                    seller:sellers!seller_id(
                        seller_id,
                        business_name,
                        city,
                        region,
                        physical_location,
                        verification_status,
                        address,
                        payment_method,
                        bank_name,
                        bank_account_number,
                        bank_account_name,
                        bank_branch,
                        mobile_money_provider,
                        mobile_money_number
                    ),
                    car:cars!car_id(
                        car_id,
                        make,
                        model,
                        year,
                        price,
                        location_city
                    )
                `)
                .eq('bank_id', bankData.bank_id)
                .order('submitted_at', { ascending: false });

            if (error) throw error;

            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            alert('Error loading applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appId) => {
        try {
            const { error } = await supabase
                .from('loan_applications')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString()
                })
                .eq('application_id', appId);

            if (error) throw error;

            alert('✅ Application approved successfully!');
            setSelectedApplication(null);
            fetchApplications(); // Refresh list
        } catch (error) {
            console.error('Error approving application:', error);
            alert('❌ Error approving application');
        }
    };

    const handleReject = async (appId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            const { error } = await supabase
                .from('loan_applications')
                .update({
                    status: 'rejected',
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason
                })
                .eq('application_id', appId);

            if (error) throw error;

            alert('✅ Application rejected.');
            setSelectedApplication(null);
            fetchApplications(); // Refresh list
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert('❌ Error rejecting application');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'submitted': <span className="badge badge-warning">Pending Review</span>,
            'under_review': <span className="badge badge-warning">Under Review</span>,
            'approved': <span className="badge badge-success">Approved</span>,
            'rejected': <span className="badge badge-danger">Rejected</span>,
            'disbursed': <span className="badge badge-info">Disbursed</span>
        };
        return badges[status] || <span className="badge">{status}</span>;
    };

    return (
        <>
            <Sidebar userType="bank" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'dashboard' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Bank Dashboard</h1>
                            <p className="card-subtitle">Review and approve loan applications</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Applications</div>
                                <div className="stat-value">{applications.length}</div>
                                <div className="stat-change">All time</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Pending Review</div>
                                <div className="stat-value">
                                    {applications.filter(a => a.status === 'submitted').length}
                                </div>
                                <div className="stat-change">Need attention</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Approved</div>
                                <div className="stat-value">
                                    {applications.filter(a => a.status === 'approved').length}
                                </div>
                                <div className="stat-change">Success rate</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Loan Value</div>
                                <div className="stat-value">
                                    {(applications.reduce((sum, a) => sum + (parseFloat(a.loan_amount) || 0), 0) / 1000000).toFixed(1)}M
                                </div>
                                <div className="stat-change">TZS</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="card-title">Recent Applications</h3>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
                                    Loading applications...
                                </div>
                            ) : applications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                                    No applications yet. Applications will appear here when buyers apply for loans.
                                </div>
                            ) : (
                                <table className="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Car</th>
                                            <th>Loan Amount</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.application_id}>
                                                <td>
                                                    {app.buyer?.user?.first_name} {app.buyer?.user?.last_name}
                                                </td>
                                                <td>{app.car_make} {app.car_model} {app.car_year}</td>
                                                <td>TZS {parseFloat(app.loan_amount).toLocaleString()}</td>
                                                <td>{getStatusBadge(app.status)}</td>
                                                <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                                                <td>
                                                    {app.status === 'submitted' ? (
                                                        <button 
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => setSelectedApplication(app)}
                                                        >
                                                            Review
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => setSelectedApplication(app)}
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

               
			   
			   {view === 'products' && (
    <>
        <div className="card-header">
            <h1 className="card-title">Loan Products</h1>
        </div>

        <ProductsView />
    </>
)}


{view === 'applications' && (
    <>
        <div className="card-header">
            <h1 className="card-title">All Applications</h1>
            <p className="card-subtitle">Manage loan applications</p>
        </div>

        <ApplicationsView 
            applications={applications}
            loading={loading}
            onSelectApplication={setSelectedApplication}
            getStatusBadge={getStatusBadge}
        />
    </>
)}
			   
            </div>

            {/* Application Review Modal - SAME AS BEFORE BUT WITH REAL DATA */}
            {selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                Application Details - {selectedApplication.buyer?.user?.first_name} {selectedApplication.buyer?.user?.last_name}
                            </h2>
                            <button className="modal-close" onClick={() => setSelectedApplication(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <h3>Applicant Information</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Name:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {selectedApplication.buyer?.user?.first_name} {selectedApplication.buyer?.user?.last_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Email:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.buyer?.user?.email}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.buyer?.user?.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Seller Information Card */}
                            <div className="card">
                                <h3>Seller Information</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Business Name:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.seller?.business_name}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Location:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {selectedApplication.seller?.city}, {selectedApplication.seller?.region}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Full Address:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.seller?.address}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Verification:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {selectedApplication.seller?.verification_status === 'verified' ? (
                                                    <span className="badge badge-success">✓ Verified Dealer</span>
                                                ) : (
                                                    <span className="badge badge-warning">⚠ Pending Verification</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="card">
                                <h3>Loan Details</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Vehicle:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {selectedApplication.car_make} {selectedApplication.car_model} {selectedApplication.car_year}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Car Price:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                TZS {parseFloat(selectedApplication.car_price).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Down Payment:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                TZS {parseFloat(selectedApplication.down_payment).toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Loan Amount:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <strong>TZS {parseFloat(selectedApplication.loan_amount).toLocaleString()}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Loan Term:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.loan_term_months} months</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Interest Rate:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.interest_rate}%</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Monthly Payment:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <strong>TZS {parseFloat(selectedApplication.monthly_payment).toLocaleString()}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Status:</td>
                                            <td style={{ padding: '0.5rem' }}>{getStatusBadge(selectedApplication.status)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {selectedApplication.status === 'approved' && selectedApplication.approved_at && (
                                <div className="card" style={{ background: '#d1f4e0', borderColor: '#0f6938' }}>
                                    <strong>✓ Approved on {new Date(selectedApplication.approved_at).toLocaleDateString()}</strong>
                                </div>
                            )}

                            {selectedApplication.status === 'rejected' && selectedApplication.rejection_reason && (
                                <div className="card" style={{ background: '#ffe0e0', borderColor: '#750e13' }}>
                                    <strong>✗ Rejected</strong>
                                    <p style={{ marginTop: '0.5rem' }}>Reason: {selectedApplication.rejection_reason}</p>
                                </div>
                            )}

                            {/* Post-Approval Tracker */}
                            {selectedApplication.status === 'approved' && (
                                <PostApprovalTracker 
                                    application={selectedApplication}
                                    onUpdate={fetchApplications}
                                />
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setSelectedApplication(null)}>
                                Close
                            </button>
                            {selectedApplication.status === 'submitted' && (
                                <>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleApprove(selectedApplication.application_id)}
                                        style={{ background: 'var(--success)' }}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleReject(selectedApplication.application_id)}
                                        style={{ background: 'var(--danger)' }}
                                    >
                                        ✗ Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



// Add/Edit Car Modal Component with Image Upload
function AddCarModal({ car, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        make: car?.make || '',
        model: car?.model || '',
        year: car?.year || new Date().getFullYear(),
        price: car?.price || '',
        mileage: car?.mileage || '',
        transmission: car?.transmission || 'automatic',
        fuel_type: car?.fuel_type || 'petrol',
        body_type: car?.body_type || 'sedan',
        color: car?.color || '',
        condition: car?.condition || 'used',
        location_city: car?.location_city || '',
        location_region: car?.location_region || '',
        description: car?.description || '',
        images: car?.images || [],
        features: car?.features || []
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState(car?.images || []);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Limit to 10 images total
        const currentImageCount = imagePreviewUrls.length;
        const availableSlots = 10 - currentImageCount;
        
        if (availableSlots <= 0) {
            alert('Maximum 10 images allowed');
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);
        
        // Add files to state
        setImageFiles([...imageFiles, ...filesToAdd]);

        // Create preview URLs
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrls(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return formData.images;

        setUploading(true);
        const uploadedUrls = [...formData.images]; // Keep existing images

        try {
            for (const file of imageFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('car-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('car-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            return uploadedUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images: ' + error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload images first
            const imageUrls = await uploadImages();
            if (imageUrls === null) {
                setLoading(false);
                return;
            }

            // Get current seller
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: sellerData } = await supabase
                .from('sellers')
                .select('seller_id')
                .eq('user_id', user.id)
                .single();

            if (!sellerData) {
                alert('Seller profile not found');
                return;
            }

            const carData = {
                seller_id: sellerData.seller_id,
                make: formData.make,
                model: formData.model,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage),
                transmission: formData.transmission,
                fuel_type: formData.fuel_type,
                body_type: formData.body_type,
                color: formData.color,
                condition: formData.condition,
                location_city: formData.location_city,
                location_region: formData.location_region,
                description: formData.description,
                images: imageUrls,
                features: formData.features.length > 0 ? formData.features : [],
                status: 'available'
            };

            if (car) {
                // Update existing car
                const { error } = await supabase
                    .from('cars')
                    .update(carData)
                    .eq('car_id', car.car_id);

                if (error) throw error;
                alert('✅ Car updated successfully!');
            } else {
                // Create new car
                const { error } = await supabase
                    .from('cars')
                    .insert([carData]);

                if (error) throw error;
                alert('✅ Car added successfully!');
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving car:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureToggle = (feature) => {
        const features = [...formData.features];
        if (features.includes(feature)) {
            setFormData({
                ...formData,
                features: features.filter(f => f !== feature)
            });
        } else {
            setFormData({
                ...formData,
                features: [...features, feature]
            });
        }
    };

    const commonFeatures = [
        'Air Conditioning', 'Power Steering', 'Power Windows', 'ABS',
        'Airbags', 'Alloy Wheels', 'Fog Lights', 'Rear Camera',
        'Parking Sensors', 'Leather Seats', 'Sunroof', 'Navigation System',
        'Bluetooth', 'USB Port', 'Cruise Control', 'Keyless Entry'
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{car ? 'Edit Car' : 'Add New Car'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* IMAGE UPLOAD SECTION */}
                        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: '600' }}>Images</h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label 
                                htmlFor="image-upload"
                                style={{
                                    display: 'inline-block',
                                    padding: '10px 20px',
                                    background: '#667eea',
                                    color: 'white',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                📷 Choose Images (Max 10)
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                style={{ display: 'none' }}
                            />
                            <span style={{ marginLeft: '1rem', fontSize: '13px', color: '#6c757d' }}>
                                {imagePreviewUrls.length}/10 images
                            </span>
                        </div>

                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                {imagePreviewUrls.map((url, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <img 
                                            src={url} 
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '120px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '2px solid #e9ecef'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                        {index === 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: '4px',
                                                left: '4px',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px'
                                            }}>
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Basic Information */}
                        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: '600' }}>Basic Information</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>Make *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.make}
                                    onChange={(e) => setFormData({...formData, make: e.target.value})}
                                    required
                                    placeholder="e.g., Toyota"
                                />
                            </div>

                            <div className="form-group">
                                <label>Model *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.model}
                                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                                    required
                                    placeholder="e.g., Land Cruiser"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>Year *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.year}
                                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                                    required
                                    min="1990"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>

                            <div className="form-group">
                                <label>Price (TZS) *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    placeholder="e.g., 45000000"
                                />
                            </div>

                            <div className="form-group">
                                <label>Mileage (km) *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                                    required
                                    placeholder="e.g., 45000"
                                />
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: '600' }}>Vehicle Details</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>Transmission *</label>
                                <select
                                    className="form-select"
                                    value={formData.transmission}
                                    onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                                    required
                                >
                                    <option value="automatic">Automatic</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Fuel Type *</label>
                                <select
                                    className="form-select"
                                    value={formData.fuel_type}
                                    onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                                    required
                                >
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="electric">Electric</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>Body Type *</label>
                                <select
                                    className="form-select"
                                    value={formData.body_type}
                                    onChange={(e) => setFormData({...formData, body_type: e.target.value})}
                                    required
                                >
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="coupe">Coupe</option>
                                    <option value="hatchback">Hatchback</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Color *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.color}
                                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                                    required
                                    placeholder="e.g., White"
                                />
                            </div>

                            <div className="form-group">
                                <label>Condition *</label>
                                <select
                                    className="form-select"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                                    required
                                >
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="certified_pre_owned">Certified Pre-Owned</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: '600' }}>Location</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.location_city}
                                    onChange={(e) => setFormData({...formData, location_city: e.target.value})}
                                    required
                                    placeholder="e.g., Dar es Salaam"
                                />
                            </div>

                            <div className="form-group">
                                <label>Region *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.location_region}
                                    onChange={(e) => setFormData({...formData, location_region: e.target.value})}
                                    required
                                    placeholder="e.g., Dar es Salaam"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Description</label>
                            <textarea
                                className="form-input"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows="4"
                                placeholder="Describe the car's condition, history, special features..."
                            ></textarea>
                        </div>

                        {/* Features */}
                        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: '600' }}>Features</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            {commonFeatures.map(feature => (
                                <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '14px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.features.includes(feature)}
                                        onChange={() => handleFeatureToggle(feature)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    {feature}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading || uploading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                            {uploading ? 'Uploading images...' : loading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// PaymentSettings Component for Seller Dashboard
function PaymentSettings() {
    const [paymentInfo, setPaymentInfo] = useState({
        payment_method: 'bank_transfer',
        bank_name: '',
        bank_account_number: '',
        bank_account_name: '',
        bank_branch: '',
        mobile_money_provider: '',
        mobile_money_number: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        fetchPaymentSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPaymentSettings = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: sellerData, error } = await supabase
                .from('sellers')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (sellerData) {
                setSellerId(sellerData.seller_id);
                setPaymentInfo({
                    payment_method: sellerData.payment_method || 'bank_transfer',
                    bank_name: sellerData.bank_name || '',
                    bank_account_number: sellerData.bank_account_number || '',
                    bank_account_name: sellerData.bank_account_name || '',
                    bank_branch: sellerData.bank_branch || '',
                    mobile_money_provider: sellerData.mobile_money_provider || '',
                    mobile_money_number: sellerData.mobile_money_number || ''
                });
            }
        } catch (error) {
            console.error('Error fetching payment settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePaymentInfo = async () => {
        if (paymentInfo.payment_method === 'bank_transfer') {
            if (!paymentInfo.bank_name || !paymentInfo.bank_account_number || !paymentInfo.bank_account_name) {
                alert('❌ Please fill in all required bank details');
                return;
            }
        } else if (paymentInfo.payment_method === 'mobile_money') {
            if (!paymentInfo.mobile_money_provider || !paymentInfo.mobile_money_number) {
                alert('❌ Please fill in all required mobile money details');
                return;
            }
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('sellers')
                .update(paymentInfo)
                .eq('seller_id', sellerId);

            if (error) throw error;
            alert('✅ Payment details saved successfully!');
        } catch (error) {
            console.error('Error saving payment info:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading payment settings...</p>
            </div>
        );
    }

    return (
        <>
            <div className="card-header">
                <h1 className="card-title">Payment Settings</h1>
                <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                    Configure where you'll receive payments from completed car sales
                </p>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '2rem'
                }}>
                    <h4 style={{ color: '#92400e', marginBottom: '0.5rem', fontSize: '14px' }}>
                        ⚠️ Important
                    </h4>
                    <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
                        Payment details will be used by banks to transfer funds when cars are sold. 
                        Account name must match your business registration.
                    </p>
                </div>

                <div className="form-group">
                    <label style={{ fontWeight: '600', fontSize: '15px' }}>Payment Method *</label>
                    <select 
                        className="form-select"
                        value={paymentInfo.payment_method}
                        onChange={(e) => setPaymentInfo({...paymentInfo, payment_method: e.target.value})}
                    >
                        <option value="bank_transfer">🏦 Bank Transfer</option>
                        <option value="mobile_money">📱 Mobile Money</option>
                    </select>
                </div>

                {paymentInfo.payment_method === 'bank_transfer' && (
                    <>
                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Bank Name *</label>
                            <select 
                                className="form-select"
                                value={paymentInfo.bank_name}
                                onChange={(e) => setPaymentInfo({...paymentInfo, bank_name: e.target.value})}
                            >
                                <option value="">Select Bank</option>
                                <option value="CRDB Bank">CRDB Bank</option>
                                <option value="NMB Bank">NMB Bank</option>
                                <option value="Stanbic Bank">Stanbic Bank</option>
                                <option value="NCBA Bank">NCBA Bank</option>
                                <option value="Equity Bank">Equity Bank</option>
                                <option value="Exim Bank">Exim Bank</option>
                                <option value="Absa Bank">Absa Bank</option>
                                <option value="Standard Chartered">Standard Chartered</option>
                                <option value="Access Bank">Access Bank</option>
                                <option value="BOA Tanzania">BOA Tanzania</option>
                                <option value="KCB Bank">KCB Bank</option>
                                <option value="DTB Bank">DTB Bank</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Account Number *</label>
                            <input 
                                type="text"
                                className="form-input"
                                value={paymentInfo.bank_account_number}
                                onChange={(e) => setPaymentInfo({...paymentInfo, bank_account_number: e.target.value})}
                                placeholder="e.g., 0150123456789"
                            />
                            <small style={{ color: '#6c757d', fontSize: '12px' }}>
                                Enter account number without spaces
                            </small>
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Account Name *</label>
                            <input 
                                type="text"
                                className="form-input"
                                value={paymentInfo.bank_account_name}
                                onChange={(e) => setPaymentInfo({...paymentInfo, bank_account_name: e.target.value})}
                                placeholder="Business name as registered with bank"
                            />
                            <small style={{ color: '#6c757d', fontSize: '12px' }}>
                                Must match business registration exactly
                            </small>
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Branch (Optional)</label>
                            <input 
                                type="text"
                                className="form-input"
                                value={paymentInfo.bank_branch}
                                onChange={(e) => setPaymentInfo({...paymentInfo, bank_branch: e.target.value})}
                                placeholder="e.g., Kariakoo Branch"
                            />
                        </div>
                    </>
                )}

                {paymentInfo.payment_method === 'mobile_money' && (
                    <>
                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Provider *</label>
                            <select 
                                className="form-select"
                                value={paymentInfo.mobile_money_provider}
                                onChange={(e) => setPaymentInfo({...paymentInfo, mobile_money_provider: e.target.value})}
                            >
                                <option value="">Select Provider</option>
                                <option value="M-Pesa">M-Pesa (Vodacom)</option>
                                <option value="Tigo Pesa">Tigo Pesa</option>
                                <option value="Airtel Money">Airtel Money</option>
                                <option value="Halo Pesa">Halo Pesa (CRDB)</option>
                                <option value="T-Pesa">T-Pesa (TTCL)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '600' }}>Phone Number *</label>
                            <input 
                                type="tel"
                                className="form-input"
                                value={paymentInfo.mobile_money_number}
                                onChange={(e) => setPaymentInfo({...paymentInfo, mobile_money_number: e.target.value})}
                                placeholder="+255 712 345 678"
                            />
                            <small style={{ color: '#6c757d', fontSize: '12px' }}>
                                Registered mobile money number
                            </small>
                        </div>
                    </>
                )}

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
                    <button 
                        className="btn btn-primary"
                        onClick={handleSavePaymentInfo}
                        disabled={saving}
                        style={{ minWidth: '200px' }}
                    >
                        {saving ? '💾 Saving...' : '💾 Save Payment Details'}
                    </button>
                </div>
            </div>
        </>
    );
}

// Seller Dashboard
function SellerDashboard() {
    const [view, setView] = useState('dashboard');
    const [cars, setCars] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        totalCars: 0,
        activeCars: 0,
        soldCars: 0,
        totalRevenue: 0,
        pendingApplications: 0
    });
    const [loading, setLoading] = useState(true);
    const [showAddCarModal, setShowAddCarModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    useEffect(() => {
        fetchSellerData();
    }, []);

    const fetchSellerData = async () => {
        setLoading(true);
        try {
            // Get current seller
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get seller_id
            const { data: sellerData } = await supabase
                .from('sellers')
                .select('seller_id')
                .eq('user_id', user.id)
                .single();

            if (!sellerData) {
                console.error('Seller profile not found');
                return;
            }

            // Fetch seller's cars
            const { data: carsData, error: carsError } = await supabase
                .from('cars')
                .select('*')
                .eq('seller_id', sellerData.seller_id)
                .order('created_at', { ascending: false });

            if (carsError) throw carsError;

            setCars(carsData || []);

            // Fetch applications for seller's cars
            const { data: appsData, error: appsError } = await supabase
                .from('loan_applications')
                .select(`
                    *,
                    car:cars!car_id(make, model, year, price),
                    buyer:buyers!buyer_id(
                        buyer_id,
                        user:users!buyers_user_id_fkey(first_name, last_name, email, phone)
                    ),
                    bank:banks!bank_id(bank_name)
                `)
                .eq('seller_id', sellerData.seller_id)
                .order('submitted_at', { ascending: false });

            if (appsError) throw appsError;

            setApplications(appsData || []);

            // Calculate stats
            const totalCars = carsData?.length || 0;
            const activeCars = carsData?.filter(c => c.status === 'available').length || 0;
            const soldCars = carsData?.filter(c => c.status === 'sold').length || 0;
            const totalRevenue = carsData?.filter(c => c.status === 'sold')
                .reduce((sum, c) => sum + parseFloat(c.price || 0), 0) || 0;
            const pendingApplications = appsData?.filter(a => a.status === 'submitted').length || 0;

            setStats({
                totalCars,
                activeCars,
                soldCars,
                totalRevenue,
                pendingApplications
            });

        } catch (error) {
            console.error('Error fetching seller data:', error);
            alert('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCar = () => {
        setEditingCar(null);
        setShowAddCarModal(true);
    };

    const handleEditCar = (car) => {
        setEditingCar(car);
        setShowAddCarModal(true);
    };

   const handleDeleteCar = async (carId) => {
    const confirmed = window.confirm('Are you sure you want to delete this car?');
    if (!confirmed) return;
        try {
            const { error } = await supabase
                .from('cars')
                .update({ status: 'inactive' })
                .eq('car_id', carId);

            if (error) throw error;

            alert('✅ Car deleted successfully');
            fetchSellerData();
        } catch (error) {
            console.error('Error deleting car:', error);
            alert('❌ Error deleting car');
        }
    };

    return (
        <>
            <Sidebar userType="seller" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'dashboard' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Seller Dashboard</h1>
                            <button className="btn btn-primary" onClick={handleAddCar}>
                                + Add New Car
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#667eea' }}>
                                Loading...
                            </div>
                        ) : (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-label">Total Listings</div>
                                        <div className="stat-value">{stats.totalCars}</div>
                                        <div className="stat-change">{stats.activeCars} active</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Cars Sold</div>
                                        <div className="stat-value">{stats.soldCars}</div>
                                        <div className="stat-change">All time</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Pending Applications</div>
                                        <div className="stat-value">{stats.pendingApplications}</div>
                                        <div className="stat-change">Awaiting approval</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-label">Total Revenue</div>
                                        <div className="stat-value">
                                            {(stats.totalRevenue / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="stat-change">TZS</div>
                                    </div>
                                </div>

                                <div className="card">
                                    <h3 className="card-title">Your Listings</h3>
                                    {cars.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                                            <p>No cars listed yet.</p>
                                            <button 
                                                className="btn btn-primary" 
                                                onClick={handleAddCar}
                                                style={{ marginTop: '1rem' }}
                                            >
                                                + Add Your First Car
                                            </button>
                                        </div>
                                    ) : (
									
                                      
									  <div className="cars-grid">
    {cars.map(car => (
      <div key={car.car_id} className="car-card">
            <div 
                className="car-image"
                style={{
                    backgroundImage: car.images && car.images.length > 0 
                        ? `url(${car.images[0]})` 
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}
            >
                {(!car.images || car.images.length === 0) && '🚗'}
                <span className="car-badge">{car.status}</span>
            </div>
            <div className="car-details">
                <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
                <div className="car-price">TZS {car.price?.toLocaleString()}</div>
                <div className="car-specs">
                    <span className="spec-item">📍 {car.location_city}</span>
                    <span className="spec-item">👁️ {car.views_count || 0} views</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEditCar(car)}
                    >
                        Edit
                    </button>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleDeleteCar(car.car_id)}
                        style={{ color: '#dc3545' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    ))}
</div>
									  
									  
									  
									  
									  
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}

                {view === 'applications' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Applications for Your Cars</h1>
                        </div>

                        <div className="card">
                            {applications.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                                    No applications yet.
                                </div>
                            ) : (
                                <table className="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Car</th>
                                            <th>Buyer</th>
                                            <th>Bank</th>
                                            <th>Loan Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.application_id}>
                                                <td>
                                                    {app.car_make} {app.car_model} {app.car_year}
                                                </td>
                                                <td>
                                                    {app.buyer?.user?.first_name} {app.buyer?.user?.last_name}
                                                </td>
                                                <td>{app.bank?.bank_name}</td>
                                                <td>TZS {parseFloat(app.loan_amount).toLocaleString()}</td>
                                                <td>
                                                    <span className={`badge badge-${
                                                        app.status === 'approved' ? 'success' :
                                                        app.status === 'rejected' ? 'danger' : 'warning'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {view === 'payment-settings' && <PaymentSettings />}
            </div>

            {/* Add/Edit Car Modal - We'll build this next */}
            {showAddCarModal && (
                <AddCarModal
                    car={editingCar}
                    onClose={() => {
                        setShowAddCarModal(false);
                        setEditingCar(null);
                    }}
                    onSuccess={() => {
                        setShowAddCarModal(false);
                        setEditingCar(null);
                        fetchSellerData();
                    }}
                />
            )}
        </>
    );
}


// Insurance Dashboard
function InsuranceDashboard() {
    const [view, setView] = useState('dashboard');

    return (
        <>
            <Sidebar userType="insurance" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'dashboard' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Insurance Dashboard</h1>
                            <p className="card-subtitle">AAR Insurance</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Active Policies</div>
                                <div className="stat-value">456</div>
                                <div className="stat-change">↑ 8% this month</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">New Requests</div>
                                <div className="stat-value">23</div>
                                <div className="stat-change">Pending review</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Premium Revenue</div>
                                <div className="stat-value">125M</div>
                                <div className="stat-change">↑ 15% growth</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Claims Ratio</div>
                                <div className="stat-value">12%</div>
                                <div className="stat-change">Healthy</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3>Insurance Products</h3>
                            <table className="comparison-table" style={{ marginTop: '1rem' }}>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Type</th>
                                        <th>Premium Rate</th>
                                        <th>Active Policies</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_INSURANCE.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.type}</td>
                                            <td>{product.basePremiumPercent}%</td>
                                            <td>152</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

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
            height: '100vh',
            fontSize: '1.5rem',
            color: '#667eea'
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


// Main App Component
function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log('🔄 App component mounted, checking session...');
        
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('📋 Session check result:', session);
            console.log('👤 User from session:', session?.user);
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('🔔 Auth state changed:', _event);
            console.log('👤 New user state:', session?.user);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        console.log('🚪 Logging out...');
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = '/login';
    };

    console.log('🎨 Rendering App, current user:', user);

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
				
				<Route
    path="/admin"
    element={
        <ProtectedRoute>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>
                
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


export default App;
