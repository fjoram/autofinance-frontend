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
                        <a 
                            href="#"
                            className={activeView === item.id ? 'active' : ''}
                            onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
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
    const [selectedBank, setSelectedBank] = useState(null);
    const [loanDetails, setLoanDetails] = useState({
        downPayment: 0,
        term: 36
    });

    const handleCarSelect = (car) => {
        setSelectedCar(car);
        setLoanDetails({
            ...loanDetails,
            downPayment: Math.round(car.price * 0.2)
        });
    };

    const getLoanComparison = () => {
        if (!selectedCar) return [];
        
        const loanAmount = selectedCar.price - loanDetails.downPayment;
        
        return MOCK_BANKS.map(bank => {
            const product = bank.products[0];
            const monthlyPayment = calculateMonthlyPayment(
                loanAmount,
                product.interestRate,
                loanDetails.term
            );
            const totalPayment = monthlyPayment * loanDetails.term;
            const totalInterest = totalPayment - loanAmount;
            
            return {
                bank: bank.name,
                product: product.name,
                interestRate: product.interestRate,
                monthlyPayment,
                totalPayment,
                totalInterest
            };
        }).sort((a, b) => a.monthlyPayment - b.monthlyPayment);
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

                        <div className="cars-grid">
                            {MOCK_CARS.map(car => (
                                <div key={car.id} className="car-card" onClick={() => handleCarSelect(car)}>
                                    <div className="car-image">
                                        🚗
                                        <span className="car-badge">{car.condition}</span>
                                    </div>
                                    <div className="car-details">
                                        <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
                                        <div className="car-price">TZS {car.price.toLocaleString()}</div>
                                        <div className="car-specs">
                                            <span className="spec-item">📍 {car.location}</span>
                                            <span className="spec-item">⚙️ {car.transmission}</span>
                                            <span className="spec-item">⛽ {car.fuelType}</span>
                                            <span className="spec-item">🎨 {car.color}</span>
                                        </div>
                                        <button className="btn btn-primary">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Car Details Modal */}
            {selectedCar && (
                <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedCar.year} {selectedCar.make} {selectedCar.model}</h2>
                            <button className="modal-close" onClick={() => setSelectedCar(null)}>×</button>
                        </div>
                        <div className="modal-body">
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
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.fuelType}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Location:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.location}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Seller:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedCar.sellerName}</td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                        <option value="12">12 months</option>
                                        <option value="24">24 months</option>
                                        <option value="36">36 months</option>
                                        <option value="48">48 months</option>
                                        <option value="60">60 months</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card">
                                <h3>Compare Bank Offers</h3>
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
                                                        onClick={() => alert('Application submitted!')}
                                                    >
                                                        Apply
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

// Bank Dashboard
function BankDashboard() {
    const [view, setView] = useState('dashboard');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState([
        {
            id: 1,
            applicantName: "John Doe",
            applicantEmail: "john.doe@email.com",
            applicantPhone: "+255 712 345 678",
            car: "Toyota Land Cruiser Prado 2020",
            carPrice: 45000000,
            loanAmount: 36000000,
            downPayment: 9000000,
            term: 48,
            monthlyIncome: 5000000,
            employmentStatus: "Employed",
            status: "pending_review",
            submittedAt: "2024-02-15",
            documents: ["ID Copy", "Payslip", "Bank Statement"],
            // Seller Information
            sellerBusinessName: "Premium Motors Ltd",
            sellerContactPerson: "James Mwangi",
            sellerPhone: "+255 713 456 789",
            sellerEmail: "sales@premiummotors.co.tz",
            sellerLocation: "Mikocheni, Dar es Salaam",
            sellerAddress: "Plot 123, Mikocheni B, Dar es Salaam",
            sellerVerified: true,
            carLocation: "Premium Motors Showroom, Mikocheni"
        },
        {
            id: 2,
            applicantName: "Jane Smith",
            applicantEmail: "jane.smith@email.com",
            applicantPhone: "+255 756 789 012",
            car: "Honda CR-V 2019",
            carPrice: 32500000,
            loanAmount: 26000000,
            downPayment: 6500000,
            term: 36,
            monthlyIncome: 4500000,
            employmentStatus: "Self-Employed",
            status: "approved",
            submittedAt: "2024-02-10",
            approvedAt: "2024-02-12",
            documents: ["ID Copy", "Business License", "Tax Returns"],
            // Seller Information
            sellerBusinessName: "Elite Auto Sales",
            sellerContactPerson: "Sarah Hassan",
            sellerPhone: "+255 714 567 890",
            sellerEmail: "contact@eliteauto.co.tz",
            sellerLocation: "Arusha, Tanzania",
            sellerAddress: "Plot 456, Njiro Road, Arusha",
            sellerVerified: true,
            carLocation: "Elite Auto Sales Yard, Njiro"
        }
    ]);

    const handleApprove = (appId) => {
        setApplications(applications.map(app => 
            app.id === appId 
                ? { ...app, status: 'approved', approvedAt: new Date().toISOString().split('T')[0] }
                : app
        ));
        setSelectedApplication(null);
        alert('Application approved successfully!');
    };

    const handleReject = (appId) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            setApplications(applications.map(app => 
                app.id === appId 
                    ? { ...app, status: 'rejected', rejectionReason: reason }
                    : app
            ));
            setSelectedApplication(null);
            alert('Application rejected.');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending_review': <span className="badge badge-warning">Pending Review</span>,
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
                            <p className="card-subtitle">CRDB Bank - Auto Loan Division</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Applications</div>
                                <div className="stat-value">156</div>
                                <div className="stat-change">↑ 12% this month</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Approval Rate</div>
                                <div className="stat-value">68%</div>
                                <div className="stat-change">↑ 5% improvement</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Portfolio Value</div>
                                <div className="stat-value">4.2B</div>
                                <div className="stat-change">↑ 18% growth</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Avg Loan Size</div>
                                <div className="stat-value">28M</div>
                                <div className="stat-change">Stable</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="card-title">Recent Applications</h3>
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Car</th>
                                        <th>Loan Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app.id}>
                                            <td>{app.applicantName}</td>
                                            <td>{app.car}</td>
                                            <td>TZS {app.loanAmount.toLocaleString()}</td>
                                            <td>{getStatusBadge(app.status)}</td>
                                            <td>
                                                {app.status === 'pending_review' ? (
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
                        </div>
                    </>
                )}

                {view === 'products' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Loan Products</h1>
                            <button className="btn btn-primary">+ Add New Product</button>
                        </div>

                        <div className="card">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Interest Rate</th>
                                        <th>Min Down Payment</th>
                                        <th>Processing Fee</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Auto Loan Premium</td>
                                        <td>15.0%</td>
                                        <td>20%</td>
                                        <td>1.5%</td>
                                        <td><span className="badge badge-success">Active</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Application Review Modal */}
            {selectedApplication && (
                <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                Application Details - {selectedApplication.applicantName}
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
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.applicantName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Email:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.applicantEmail}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.applicantPhone}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Employment:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.employmentStatus}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Monthly Income:</td>
                                            <td style={{ padding: '0.5rem' }}>TZS {selectedApplication.monthlyIncome.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Seller Information Card - NEW! */}
                            <div className="card">
                                <h3>Seller Information</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold', width: '40%' }}>Business Name:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.sellerBusinessName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Contact Person:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.sellerContactPerson}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Phone:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <a href={`tel:${selectedApplication.sellerPhone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                                    {selectedApplication.sellerPhone} 📞
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Email:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <a href={`mailto:${selectedApplication.sellerEmail}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                                                    {selectedApplication.sellerEmail} 📧
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Location:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.sellerLocation}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Full Address:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.sellerAddress}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Verification:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                {selectedApplication.sellerVerified ? (
                                                    <span className="badge badge-success">✓ Verified Dealer</span>
                                                ) : (
                                                    <span className="badge badge-warning">⚠ Pending Verification</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => window.location.href = `tel:${selectedApplication.sellerPhone}`}
                                    >
                                        📞 Call Seller
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => window.location.href = `mailto:${selectedApplication.sellerEmail}`}
                                    >
                                        📧 Email Seller
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => alert('Schedule inspection feature coming soon!')}
                                    >
                                        📅 Schedule Inspection
                                    </button>
                                </div>
                            </div>

                            <div className="card">
                                <h3>Loan Details</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Vehicle:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.car}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Car Location:</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <strong>{selectedApplication.carLocation}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Car Price:</td>
                                            <td style={{ padding: '0.5rem' }}>TZS {selectedApplication.carPrice.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Down Payment:</td>
                                            <td style={{ padding: '0.5rem' }}>TZS {selectedApplication.downPayment.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Loan Amount:</td>
                                            <td style={{ padding: '0.5rem' }}><strong>TZS {selectedApplication.loanAmount.toLocaleString()}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Loan Term:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.term} months</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Status:</td>
                                            <td style={{ padding: '0.5rem' }}>{getStatusBadge(selectedApplication.status)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="card">
                                <h3>Documents Submitted</h3>
                                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                    {selectedApplication.documents.map((doc, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                            ✓ {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {selectedApplication.status === 'approved' && selectedApplication.approvedAt && (
                                <div className="card" style={{ background: '#d1f4e0', borderColor: '#0f6938' }}>
                                    <strong>✓ Approved on {selectedApplication.approvedAt}</strong>
                                </div>
                            )}

                            {selectedApplication.status === 'rejected' && selectedApplication.rejectionReason && (
                                <div className="card" style={{ background: '#ffe0e0', borderColor: '#750e13' }}>
                                    <strong>✗ Rejected</strong>
                                    <p style={{ marginTop: '0.5rem' }}>Reason: {selectedApplication.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setSelectedApplication(null)}>
                                Close
                            </button>
                            {selectedApplication.status === 'pending_review' && (
                                <>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleApprove(selectedApplication.id)}
                                        style={{ background: 'var(--success)' }}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleReject(selectedApplication.id)}
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

// Seller Dashboard
function SellerDashboard() {
    const [view, setView] = useState('dashboard');

    return (
        <>
            <Sidebar userType="seller" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'dashboard' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Seller Dashboard</h1>
                            <p className="card-subtitle">Premium Motors</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Listings</div>
                                <div className="stat-value">24</div>
                                <div className="stat-change">3 active</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Sales</div>
                                <div className="stat-value">12</div>
                                <div className="stat-change">This month: 2</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Pending Applications</div>
                                <div className="stat-value">8</div>
                                <div className="stat-change">Awaiting approval</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Revenue</div>
                                <div className="stat-value">520M</div>
                                <div className="stat-change">↑ 25% growth</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3>Your Listings</h3>
                            <div className="cars-grid" style={{ marginTop: '1rem' }}>
                                {MOCK_CARS.filter(car => car.sellerId === 1).map(car => (
                                    <div key={car.id} className="car-card">
                                        <div className="car-image">
                                            🚗
                                            <span className="car-badge">{car.status}</span>
                                        </div>
                                        <div className="car-details">
                                            <h3 className="car-title">{car.year} {car.make} {car.model}</h3>
                                            <div className="car-price">TZS {car.price.toLocaleString()}</div>
                                            <div className="car-specs">
                                                <span className="spec-item">📍 {car.location}</span>
                                                <span className="spec-item">👁️ 245 views</span>
                                            </div>
                                            <button className="btn btn-outline btn-sm">Manage</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
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
