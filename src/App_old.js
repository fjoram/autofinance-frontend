import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

// Swahili/English Translations
const translations = {
    sw: {
        title: "AutoFinance Hub Tanzania",
        tagline: "Nunua Gari Lako na Mkopo Rahisi",
        subtitle: "Pata mkopo wa gari kutoka benki zinazokuaminika",
        select: "Chagua Dashibodi Yako",
        buyer: "Mnunuzi",
        buyerDesc: "Tafuta magari na upate mkopo",
        bank: "Benki", 
        bankDesc: "Kagua maombi ya mikopo",
        seller: "Muuzaji",
        sellerDesc: "Simamia mauzo yako",
        insurance: "Bima",
        insuranceDesc: "Simamia bima za magari"
    },
    en: {
        title: "AutoFinance Hub Tanzania",
        tagline: "Buy Your Dream Car with Easy Financing",
        subtitle: "Get car loans from trusted banks",
        select: "Select Your Dashboard",
        buyer: "Buyer",
        buyerDesc: "Browse cars and get financing",
        bank: "Bank",
        bankDesc: "Review loan applications", 
        seller: "Seller",
        sellerDesc: "Manage your listings",
        insurance: "Insurance",
        insuranceDesc: "Manage vehicle insurance"
    }
};



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
                    <li><a href="/">Browse Cars</a></li>
                    <li><a href="/">Financing</a></li>
                    <li><a href="/">About</a></li>
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
                            href="/"
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            ({ins.basePremiumPercent}% of car value)
                                        </p>
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

    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('status', 'available');
            
            if (error) {
                console.error('Error fetching cars:', error);
            } else if (data && data.length > 0) {
                setCars(data);
            }
        } catch (err) {
            console.error('Exception fetching cars:', err);
        }
    }

    const handleApply = async (application) => {
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
            documents: ["ID Copy", "Payslip", "Bank Statement"]
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
            documents: ["ID Copy", "Business License", "Tax Returns"]
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

                            <div className="card">
                                <h3>Loan Details</h3>
                                <table style={{ width: '100%', marginTop: '1rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Vehicle:</td>
                                            <td style={{ padding: '0.5rem' }}>{selectedApplication.car}</td>
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
                                <div className="stat-change">↑ 3 this month</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Revenue</div>
                                <div className="stat-value">445M</div>
                                <div className="stat-change">↑ 25% growth</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Avg Days to Sell</div>
                                <div className="stat-value">18</div>
                                <div className="stat-change">↓ 3 days faster</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="card-title">Pending Payments</h3>
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Car</th>
                                        <th>Buyer</th>
                                        <th>Sale Price</th>
                                        <th>Status</th>
                                        <th>Expected Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Toyota Land Cruiser</td>
                                        <td>John Doe</td>
                                        <td>TZS 45,000,000</td>
                                        <td><span className="badge badge-warning">Loan Approved</span></td>
                                        <td>Feb 25, 2024</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {view === 'listings' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">My Listings</h1>
                            <button className="btn btn-primary">+ Add New Car</button>
                        </div>

                        <div className="cars-grid">
                            {MOCK_CARS.filter(c => c.sellerId === 1).map(car => (
                                <div key={car.id} className="car-card">
                                    <div className="car-image">🚗</div>
                                    <div className="car-details">
                                        <h3 className="car-title">{car.make} {car.model}</h3>
                                        <div className="car-price">TZS {(car.price / 1000000).toFixed(1)}M</div>
                                        <div style={{ marginTop: '1rem' }}>
                                            <span className="badge badge-success">Available</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <button className="btn btn-sm btn-outline">Edit</button>
                                            <button className="btn btn-sm btn-outline">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

// Insurance Dashboard - NEW!
function InsuranceDashboard() {
    const [view, setView] = useState('dashboard');
    const [products, setProducts] = useState([
        {
            id: 1,
            productName: "Comprehensive Plus",
            coverageType: "Comprehensive",
            basePremiumPercent: 3.5,
            minPremium: 500000,
            maxPremium: 5000000,
            coverageLimit: 100000000,
            minCarValue: 5000000,
            maxCarValue: 200000000,
            minCarAge: 0,
            maxCarAge: 10,
            isActive: true
        },
        {
            id: 2,
            productName: "Basic Coverage",
            coverageType: "Third Party",
            basePremiumPercent: 2.0,
            minPremium: 300000,
            maxPremium: 2000000,
            coverageLimit: 50000000,
            minCarValue: 2000000,
            maxCarValue: 100000000,
            minCarAge: 0,
            maxCarAge: 15,
            isActive: true
        }
    ]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [policyRequests, setPolicyRequests] = useState([
        {
            id: 1,
            applicantName: "John Doe",
            car: "Toyota Land Cruiser Prado 2020",
            carValue: 45000000,
            productName: "Comprehensive Plus",
            annualPremium: 1575000,
            status: "pending",
            submittedAt: "2024-02-15"
        },
        {
            id: 2,
            applicantName: "Jane Smith",
            car: "Honda CR-V 2019",
            carValue: 32500000,
            productName: "Comprehensive Plus",
            annualPremium: 1137500,
            status: "issued",
            submittedAt: "2024-02-10",
            policyNumber: "AAR-2024-001234"
        }
    ]);

    const handleIssuePolicy = (requestId) => {
        const policyNumber = `AAR-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`;
        setPolicyRequests(policyRequests.map(req => 
            req.id === requestId 
                ? { ...req, status: 'issued', policyNumber, issuedAt: new Date().toISOString().split('T')[0] }
                : req
        ));
        alert(`Policy issued! Policy Number: ${policyNumber}`);
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': <span className="badge badge-warning">Pending Review</span>,
            'issued': <span className="badge badge-success">Policy Issued</span>,
            'rejected': <span className="badge badge-danger">Rejected</span>
        };
        return badges[status] || <span className="badge">{status}</span>;
    };

    return (
        <>
            <Sidebar userType="insurance" activeView={view} onNavigate={setView} />
            <div className="main-content">
                {view === 'dashboard' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Insurance Dashboard</h1>
                            <p className="card-subtitle">AAR Insurance Tanzania</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Policies</div>
                                <div className="stat-value">342</div>
                                <div className="stat-change">↑ 8% this month</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Active Policies</div>
                                <div className="stat-value">298</div>
                                <div className="stat-change">87% retention</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Premium Revenue</div>
                                <div className="stat-value">456M</div>
                                <div className="stat-change">↑ 22% growth</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Avg Premium</div>
                                <div className="stat-value">1.3M</div>
                                <div className="stat-change">Stable</div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="card-title">Recent Policy Requests</h3>
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Vehicle</th>
                                        <th>Product</th>
                                        <th>Annual Premium</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policyRequests.slice(0, 3).map(req => (
                                        <tr key={req.id}>
                                            <td>{req.applicantName}</td>
                                            <td>{req.car}</td>
                                            <td>{req.productName}</td>
                                            <td>TZS {req.annualPremium.toLocaleString()}</td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td>
                                                {req.status === 'pending' ? (
                                                    <button 
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleIssuePolicy(req.id)}
                                                    >
                                                        Issue Policy
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-sm btn-outline">
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

                {view === 'requests' && (
                    <>
                        <div className="card-header">
                            <h1 className="card-title">Policy Requests</h1>
                        </div>

                        <div className="card">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Applicant</th>
                                        <th>Vehicle</th>
                                        <th>Product</th>
                                        <th>Premium</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {policyRequests.map(req => (
                                        <tr key={req.id}>
                                            <td>#{req.id}</td>
                                            <td>{req.applicantName}</td>
                                            <td>{req.car}</td>
                                            <td>{req.productName}</td>
                                            <td>TZS {req.annualPremium.toLocaleString()}</td>
                                            <td>{req.submittedAt}</td>
                                            <td>{getStatusBadge(req.status)}</td>
                                            <td>
                                                {req.status === 'pending' ? (
                                                    <button 
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleIssuePolicy(req.id)}
                                                    >
                                                        Issue Policy
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-sm btn-outline">
                                                        View Details
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
                            <h1 className="card-title">Insurance Products</h1>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setEditingProduct({})}
                            >
                                + Add New Product
                            </button>
                        </div>

                        <div className="card">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Coverage Type</th>
                                        <th>Base Premium</th>
                                        <th>Coverage Limit</th>
                                        <th>Car Value Range</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.productName}</td>
                                            <td>{product.coverageType}</td>
                                            <td>{product.basePremiumPercent}%</td>
                                            <td>TZS {(product.coverageLimit / 1000000).toFixed(0)}M</td>
                                            <td>
                                                {(product.minCarValue / 1000000).toFixed(0)}M - {(product.maxCarValue / 1000000).toFixed(0)}M
                                            </td>
                                            <td>
                                                {product.isActive ? (
                                                    <span className="badge badge-success">Active</span>
                                                ) : (
                                                    <span className="badge badge-danger">Inactive</span>
                                                )}
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => setEditingProduct(product)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Product Edit Modal */}
            {editingProduct && (
                <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button className="modal-close" onClick={() => setEditingProduct(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="card">
                                <h3>Product Details</h3>
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input 
                                        type="text" 
                                        className="form-input"
                                        placeholder="e.g., Comprehensive Plus"
                                        defaultValue={editingProduct.productName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Coverage Type</label>
                                    <select className="form-select" defaultValue={editingProduct.coverageType}>
                                        <option value="comprehensive">Comprehensive</option>
                                        <option value="third_party">Third Party</option>
                                        <option value="third_party_fire_theft">Third Party Fire & Theft</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Base Premium (% of car value)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="3.5"
                                        step="0.1"
                                        defaultValue={editingProduct.basePremiumPercent}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Min Premium (TZS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="500000"
                                        defaultValue={editingProduct.minPremium}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Premium (TZS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="5000000"
                                        defaultValue={editingProduct.maxPremium}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Coverage Limit (TZS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="100000000"
                                        defaultValue={editingProduct.coverageLimit}
                                    />
                                </div>
                            </div>

                            <div className="card">
                                <h3>Eligibility Criteria</h3>
                                <div className="form-group">
                                    <label className="form-label">Min Car Value (TZS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="5000000"
                                        defaultValue={editingProduct.minCarValue}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Car Value (TZS)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="200000000"
                                        defaultValue={editingProduct.maxCarValue}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Car Age (years)</label>
                                    <input 
                                        type="number" 
                                        className="form-input"
                                        placeholder="10"
                                        defaultValue={editingProduct.maxCarAge}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setEditingProduct(null)}>
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => {
                                    alert('Product saved! (In production, this will save to database)');
                                    setEditingProduct(null);
                                }}
                            >
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}



function App() {
    const [userType, setUserType] = useState(null);
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState('sw'); // ADD THIS
    const t = translations[language]; // ADD THIS

    const handleLogin = (type) => {
        setUserType(type);
        const names = {
            buyer: 'John Doe',
            seller: 'Premium Motors',
            bank: 'CRDB Bank',
            insurance: 'AAR Insurance'
        };
        setUser({
            name: names[type],
            type: type
        });
    };

    if (!userType) {
        return (
            <div style={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Language Toggle */}
                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setLanguage('en')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: language === 'en' ? '2px solid white' : 'none',
                            background: language === 'en' ? 'white' : 'rgba(255,255,255,0.2)',
                            color: language === 'en' ? '#667eea' : 'white',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setLanguage('sw')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: language === 'sw' ? '2px solid white' : 'none',
                            background: language === 'sw' ? 'white' : 'rgba(255,255,255,0.2)',
                            color: language === 'sw' ? '#667eea' : 'white',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Kiswahili
                    </button>
                </div>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ fontSize: '80px', marginBottom: '1rem' }}>🚗</div>
                    <h1 style={{ 
                        fontFamily: 'Sora, sans-serif', 
                        fontSize: '3rem', 
                        marginBottom: '1rem',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        {t.title}
                    </h1>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {t.tagline}
                    </h2>
                    <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                        {t.subtitle}
                    </p>
                </div>

                {/* Dashboard Selection */}
                <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>{t.select}</h3>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1000px'
                }}>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleLogin('buyer')}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚗</div>
                        <div style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {t.buyer}
                        </div>
                        <div style={{ opacity: '0.9', fontSize: '0.95rem' }}>{t.buyerDesc}</div>
                    </button>

                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleLogin('bank')}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏦</div>
                        <div style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {t.bank}
                        </div>
                        <div style={{ opacity: '0.9', fontSize: '0.95rem' }}>{t.bankDesc}</div>
                    </button>

                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleLogin('seller')}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💼</div>
                        <div style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {t.seller}
                        </div>
                        <div style={{ opacity: '0.9', fontSize: '0.95rem' }}>{t.sellerDesc}</div>
                    </button>

                    <button 
                        className="btn btn-primary" 
                        onClick={() => handleLogin('insurance')}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
                        <div style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            {t.insurance}
                        </div>
                        <div style={{ opacity: '0.9', fontSize: '0.95rem' }}>{t.insuranceDesc}</div>
                    </button>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '4rem', textAlign: 'center', opacity: '0.8' }}>
                    <p>📍 Dar es Salaam, Tanzania | 📞 +255 XXX XXX XXX</p>
                    <p style={{ marginTop: '0.5rem' }}>© 2024 AutoFinance Hub Tanzania</p>
                </div>
            </div>
        );
    }

    // Rest of the code stays the same...
    return (
        <>
            <TopNav user={user} />
            <div className="app-layout">
                {userType === 'buyer' && <BuyerDashboard />}
                {userType === 'bank' && <BankDashboard />}
                {userType === 'seller' && <SellerDashboard />}
                {userType === 'insurance' && <InsuranceDashboard />}
            </div>
        </>
    );
}


export default App;
