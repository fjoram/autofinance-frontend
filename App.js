import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Mock Data (will be replaced with real Supabase data)
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
    { id: 1, name: "AAR Insurance", type: "Comprehensive", premium: 850000 },
    { id: 2, name: "Jubilee Insurance", type: "Comprehensive", premium: 780000 },
    { id: 3, name: "Heritage Insurance", type: "Third Party", premium: 520000 }
];

// Calculate Monthly Payment
function calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
}

// Navigation Component
function TopNav({ user, onLogout }) {
    return (
        <nav className="top-nav">
            <div className="nav-container">
                <div className="logo">
                    🚗 AutoFinance Hub
                </div>
                <ul className="nav-links">
                    <li><a href="#cars">Browse Cars</a></li>
                    <li><a href="#financing">Financing</a></li>
                    <li><a href="#about">About</a></li>
                </ul>
                <div className="user-menu">
                    {user && (
                        <>
                            <div className="user-avatar">
                                {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
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
            { id: 'browse', label: 'Browse Cars', icon: '🚗' },
            { id: 'applications', label: 'My Applications', icon: '📋' },
            { id: 'saved', label: 'Saved Cars', icon: '❤️' }
        ],
        seller: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'listings', label: 'My Listings', icon: '🚗' },
            { id: 'applications', label: 'Applications', icon: '📋' },
            { id: 'add-car', label: 'Add New Car', icon: '➕' }
        ],
        bank: [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'applications', label: 'Applications', icon: '📋' },
            { id: 'products', label: 'Loan Products', icon: '💰' },
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

// Car Card Component
function CarCard({ car, onSelect }) {
    return (
        <div className="car-card" onClick={() => onSelect(car)}>
            <div className="car-image">
                {car.condition === "Certified Pre-Owned" && (
                    <span className="car-badge">✓ Verified</span>
                )}
                🚗
            </div>
            <div className="car-details">
                <h3 className="car-title">{car.make} {car.model}</h3>
                <div className="car-price">
                    TZS {(car.price / 1000000).toFixed(1)}M
                </div>
                <div className="car-specs">
                    <span className="spec-item">📅 {car.year}</span>
                    <span className="spec-item">⚙️ {car.transmission}</span>
                    <span className="spec-item">⛽ {car.fuelType}</span>
                </div>
                <div className="spec-item">📍 {car.location}</div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Get Financing
                </button>
            </div>
        </div>
    );
}

// Loan Comparison Component
function LoanComparison({ car, onClose, onApply }) {
    const [downPayment, setDownPayment] = useState(car.price * 0.2);
    const [selectedTerm, setSelectedTerm] = useState(48);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedInsurance, setSelectedInsurance] = useState(null);

    const loanAmount = car.price - downPayment;
    const downPaymentPercent = (downPayment / car.price * 100).toFixed(0);

    const comparisons = MOCK_BANKS.flatMap(bank => 
        bank.products.map(product => {
            const processingFee = loanAmount * (product.processingFee / 100);
            const monthlyPayment = calculateMonthlyPayment(loanAmount, product.interestRate, selectedTerm);
            const totalPayable = monthlyPayment * selectedTerm;
            const totalInterest = totalPayable - loanAmount;

            return {
                bankId: bank.id,
                bankName: bank.name,
                productId: product.id,
                productName: product.name,
                interestRate: product.interestRate,
                monthlyPayment,
                totalInterest,
                totalPayable,
                processingFee
            };
        })
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Financing Options - {car.make} {car.model}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="card">
                        <h3>Car Price: TZS {car.price.toLocaleString()}</h3>
                        
                        <div className="form-group">
                            <label className="form-label">
                                Down Payment: {downPaymentPercent}% 
                                (TZS {downPayment.toLocaleString()})
                            </label>
                            <input 
                                type="range"
                                min={car.price * 0.1}
                                max={car.price * 0.5}
                                step={100000}
                                value={downPayment}
                                onChange={e => setDownPayment(Number(e.target.value))}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Loan Term</label>
                            <select 
                                className="form-select"
                                value={selectedTerm}
                                onChange={e => setSelectedTerm(Number(e.target.value))}
                            >
                                <option value={12}>12 months</option>
                                <option value={24}>24 months</option>
                                <option value={36}>36 months</option>
                                <option value={48}>48 months</option>
                                <option value={60}>60 months</option>
                            </select>
                        </div>

                        <p style={{ marginTop: '1rem' }}>
                            <strong>Loan Amount: TZS {loanAmount.toLocaleString()}</strong>
                        </p>
                    </div>

                    <h3 style={{ margin: '2rem 0 1rem' }}>Compare Banks</h3>
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Bank</th>
                                <th>Interest Rate</th>
                                <th>Monthly Payment</th>
                                <th>Total Interest</th>
                                <th>Processing Fee</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisons.map((comp, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="bank-name">
                                            <div className="bank-logo">
                                                {comp.bankName.charAt(0)}
                                            </div>
                                            <div>
                                                <div>{comp.bankName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {comp.productName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{comp.interestRate}%</td>
                                    <td><strong>TZS {comp.monthlyPayment.toLocaleString()}</strong></td>
                                    <td>TZS {comp.totalInterest.toLocaleString()}</td>
                                    <td>TZS {comp.processingFee.toLocaleString()}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setSelectedBank(comp)}
                                        >
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedBank && (
                        <>
                            <h3 style={{ margin: '2rem 0 1rem' }}>Choose Insurance</h3>
                            <div className="cards-grid">
                                {MOCK_INSURANCE.map(ins => (
                                    <div 
                                        key={ins.id}
                                        className="card"
                                        style={{ 
                                            cursor: 'pointer',
                                            border: selectedInsurance?.id === ins.id ? '2px solid var(--primary)' : '1px solid var(--border)'
                                        }}
                                        onClick={() => setSelectedInsurance(ins)}
                                    >
                                        <h4>{ins.name}</h4>
                                        <p>{ins.type}</p>
                                        <p><strong>TZS {ins.premium.toLocaleString()}/year</strong></p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    {selectedBank && selectedInsurance && (
                        <button 
                            className="btn btn-primary"
                            onClick={() => onApply({ 
                                car, 
                                bank: selectedBank, 
                                insurance: selectedInsurance,
                                downPayment,
                                loanAmount,
                                term: selectedTerm
                            })}
                        >
                            Submit Application
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Buyer Dashboard
function BuyerDashboard() {
    const [view, setView] = useState('browse');
    const [selectedCar, setSelectedCar] = useState(null);
    const [applications, setApplications] = useState([]);
    const [cars, setCars] = useState(MOCK_CARS);

    // Fetch cars from Supabase
    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            const { data, error } = await supabase
                .from('cars')
                .select(`
                    *,
                    sellers (
                        business_name,
                        rating
                    )
                `)
                .eq('status', 'available');
            
            if (error) {
                console.error('Error fetching cars:', error);
                // Use mock data if no real data
            } else if (data && data.length > 0) {
                // Transform data to match expected format
                const transformedCars = data.map(car => ({
                    id: car.car_id,
                    make: car.make,
                    model: car.model,
                    year: car.year,
                    price: car.price,
                    mileage: car.mileage,
                    transmission: car.transmission,
                    fuelType: car.fuel_type,
                    bodyType: car.body_type,
                    color: car.color,
                    location: car.location_city,
                    condition: car.condition,
                    sellerName: car.sellers?.business_name || 'Unknown Seller',
                    status: car.status
                }));
                setCars(transformedCars);
            }
        } catch (err) {
            console.error('Exception fetching cars:', err);
        }
    }

    const handleApply = async (application) => {
        // TODO: Save to Supabase
        setApplications([...applications, { 
            ...application, 
            id: applications.length + 1,
            status: 'submitted',
            submittedAt: new Date().toISOString()
        }]);
        setSelectedCar(null);
        setView('applications');
    };

    return (
        <>
            <Sidebar userType="buyer" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'browse' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Browse Cars</h1>
                            <p className="card-subtitle">Find your perfect car with flexible financing</p>
                        </div>

                        <div className="cars-grid">
                            {cars.map(car => (
                                <CarCard key={car.id} car={car} onSelect={setSelectedCar} />
                            ))}
                        </div>
                    </>
                )}

                {view === 'applications' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">My Applications</h1>
                            <p className="card-subtitle">Track your loan applications</p>
                        </div>

                        {applications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3 className="empty-title">No Applications Yet</h3>
                                <p className="empty-text">Start browsing cars to submit your first application</p>
                            </div>
                        ) : (
                            <div className="card">
                                <table className="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Car</th>
                                            <th>Bank</th>
                                            <th>Loan Amount</th>
                                            <th>Monthly Payment</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td>{app.car.make} {app.car.model}</td>
                                                <td>{app.bank.bankName}</td>
                                                <td>TZS {app.loanAmount.toLocaleString()}</td>
                                                <td>TZS {app.bank.monthlyPayment.toLocaleString()}</td>
                                                <td>
                                                    <span className="badge badge-info">
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedCar && (
                <LoanComparison 
                    car={selectedCar} 
                    onClose={() => setSelectedCar(null)}
                    onApply={handleApply}
                />
            )}
        </>
    );
}

// Bank Dashboard (simplified)
function BankDashboard() {
    return (
        <div className="main-content">
            <h1>Bank Dashboard - Coming Soon</h1>
        </div>
    );
}

// Seller Dashboard (simplified)
function SellerDashboard() {
    return (
        <div className="main-content">
            <h1>Seller Dashboard - Coming Soon</h1>
        </div>
    );
}

// Main App
function App() {
    const [userType, setUserType] = useState(null);
    const [user, setUser] = useState(null);

    const handleLogin = (type) => {
        setUserType(type);
        setUser({
            name: type === 'buyer' ? 'John Doe' : type === 'seller' ? 'Premium Motors' : 'CRDB Bank',
            type: type
        });
    };

    if (!userType) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <h1 style={{ fontFamily: 'Sora', fontSize: '3rem', marginBottom: '1rem' }}>
                    🚗 AutoFinance Hub
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                    Select your dashboard type
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => handleLogin('buyer')}>
                        Buyer Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => handleLogin('bank')}>
                        Bank Dashboard
                    </button>
                    <button className="btn btn-primary" onClick={() => handleLogin('seller')}>
                        Seller Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <TopNav user={user} />
            <div className="app-layout">
                {userType === 'buyer' && <BuyerDashboard />}
                {userType === 'bank' && <BankDashboard />}
                {userType === 'seller' && <SellerDashboard />}
            </div>
        </>
    );
}

export default App;
