import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PublicNav from './PublicNav';
import './Public.css';

function calcMonthly(price, downPct, annualRate, months) {
    const principal = price * (1 - downPct / 100);
    const r = annualRate / 100 / 12;
    if (r === 0) return Math.round(principal / months);
    return Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
}

// Smart Registration Modal — shown when unauthenticated user clicks Apply
function SmartRegisterModal({ car, onClose }) {
    const navigate = useNavigate();

    const handleAction = (path) => {
        // Save pending car to localStorage so after auth, app can auto-resume
        localStorage.setItem('pendingCarId', car.car_id);
        localStorage.setItem('pendingCarName', `${car.year} ${car.make} ${car.model}`);
        navigate(path);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                background: 'white', borderRadius: '8px', padding: '2.5rem',
                maxWidth: '460px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚗</div>
                    <h2 style={{ fontWeight: 800, fontSize: '1.375rem', marginBottom: '0.5rem' }}>
                        Apply for This Car
                    </h2>
                    <p style={{ color: '#525252', fontSize: '0.9375rem' }}>
                        Create a free account to apply for financing on
                    </p>
                    <p style={{ fontWeight: 700, color: '#0f62fe', fontSize: '1rem', marginTop: '0.375rem' }}>
                        {car.year} {car.make} {car.model}
                    </p>
                    <p style={{ color: '#525252', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        TZS {car.price?.toLocaleString()}
                    </p>
                </div>

                <div style={{ background: '#f0f4ff', borderRadius: '6px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#525252' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#161616' }}>What happens next:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <span>✅ Create your free buyer account</span>
                        <span>✅ Your selected car will be saved</span>
                        <span>✅ Apply for financing in under 5 minutes</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button onClick={() => handleAction('/register')} style={{
                        background: '#0f62fe', color: 'white', border: 'none',
                        padding: '0.875rem', borderRadius: '4px', fontWeight: 700,
                        fontSize: '1rem', cursor: 'pointer', width: '100%'
                    }}>
                        Create Free Account
                    </button>
                    <button onClick={() => handleAction('/login')} style={{
                        background: 'white', color: '#0f62fe', border: '2px solid #0f62fe',
                        padding: '0.875rem', borderRadius: '4px', fontWeight: 700,
                        fontSize: '1rem', cursor: 'pointer', width: '100%'
                    }}>
                        Login to Apply
                    </button>
                </div>

                <button onClick={onClose} style={{
                    background: 'none', border: 'none', color: '#8d8d8d',
                    fontSize: '0.875rem', cursor: 'pointer', marginTop: '1rem',
                    display: 'block', width: '100%', textAlign: 'center'
                }}>
                    Cancel, keep browsing
                </button>
            </div>
        </div>
    );
}

function PublicCarDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loanProducts, setLoanProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [user, setUser] = useState(null);

    // Loan calculator state
    const [downPct, setDownPct] = useState(20);
    const [loanTerm, setLoanTerm] = useState(48);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
        fetchCar();
        fetchLoanProducts();
    }, [id]);

    const fetchCar = async () => {
        const { data, error } = await supabase
            .from('cars')
            .select(`
                *,
                seller:sellers(seller_id, business_name, business_type, city, region, verification_status, rating)
            `)
            .eq('car_id', id)
            .single();

        if (error || !data) {
            navigate('/cars');
            return;
        }
        setCar(data);
        setLoading(false);
    };

    const fetchLoanProducts = async () => {
        const { data } = await supabase
            .from('loan_products')
            .select(`*, bank:banks(bank_id, bank_name, bank_code)`)
            .eq('is_active', true);
        setLoanProducts(data || []);
    };

    const handleApplyNow = (productId = null, bankId = null) => {
        if (!user) {
            setShowRegisterModal(true);
            return;
        }
        // User is logged in — go to buyer dashboard with pre-selected car
        localStorage.setItem('pendingCarId', car.car_id);
        if (productId) localStorage.setItem('pendingProductId', productId);
        navigate('/buyer-dashboard');
    };

    if (loading) {
        return (
            <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
                <PublicNav />
                <div style={{ textAlign: 'center', padding: '5rem', color: '#0f62fe', fontSize: '1.25rem' }}>
                    Loading car details...
                </div>
            </div>
        );
    }

    if (!car) return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: '#6c757d', marginBottom: '1rem' }}>Car not found or no longer available.</p>
            <button className="btn btn-primary" onClick={() => navigate('/cars')}>Back to Browse</button>
        </div>
    );

    const images = car.images?.length ? car.images : [null];
    const loanComparison = loanProducts
        .filter(p => {
            if (p.max_loan_term_months) return loanTerm <= p.max_loan_term_months;
            if (p.loan_terms) return p.loan_terms.includes(loanTerm);
            return true;
        })
        .map(p => ({
            productId: p.product_id,
            bankId: p.bank?.bank_id,
            bank: p.bank?.bank_name,
            product: p.product_name,
            interestRate: p.interest_rate,
            monthly: calcMonthly(car.price, downPct, p.interest_rate, loanTerm),
            processingFee: p.processing_fee_percent
        }))
        .sort((a, b) => a.monthly - b.monthly)
        .slice(0, 6);

    const SPECS = [
        ['Make', car.make],
        ['Model', car.model],
        ['Year', car.year],
        ['Condition', car.condition === 'certified_pre_owned' ? 'Certified Pre-Owned' : car.condition],
        ['Mileage', car.mileage ? `${car.mileage.toLocaleString()} km` : '—'],
        ['Transmission', car.transmission],
        ['Fuel Type', car.fuel_type],
        ['Body Type', car.body_type],
        ['Color', car.color],
        ['Engine Size', car.engine_size || '—'],
        ['Location', [car.location_city, car.location_region].filter(Boolean).join(', ')]
    ];

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <PublicNav />

            {/* Breadcrumb */}
            <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', padding: '0.875rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '0.875rem', color: '#6f6f6f' }}>
                    <Link to="/" style={{ color: '#6f6f6f', textDecoration: 'none' }}>Home</Link>
                    {' / '}
                    <Link to="/cars" style={{ color: '#6f6f6f', textDecoration: 'none' }}>Cars</Link>
                    {' / '}
                    <span style={{ color: '#161616', fontWeight: 500 }}>{car.year} {car.make} {car.model}</span>
                </div>
            </div>

            <div>
                <div className="pub-details-layout">

                    {/* LEFT COLUMN */}
                    <div>
                        {/* Image Gallery */}
                        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{
                                width: '100%', height: '420px',
                                background: images[activeImage]
                                    ? `url(${images[activeImage]}) center/cover no-repeat`
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '6rem', position: 'relative'
                            }}>
                                {!images[activeImage] && '🚗'}
                                {car.is_featured && (
                                    <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 700 }}>
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', overflowX: 'auto' }}>
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            style={{
                                                width: '80px', height: '60px', flexShrink: 0,
                                                borderRadius: '4px', cursor: 'pointer',
                                                border: activeImage === i ? '2px solid #0f62fe' : '2px solid transparent',
                                                background: img ? `url(${img}) center/cover` : 'linear-gradient(135deg, #667eea, #764ba2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}
                                        >
                                            {!img && '🚗'}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title + Price */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#161616', marginBottom: '0.375rem' }}>
                                        {car.year} {car.make} {car.model}
                                    </h1>
                                    <div style={{ color: '#6f6f6f', fontSize: '0.9375rem' }}>
                                        📍 {car.location_city}{car.location_region ? `, ${car.location_region}` : ''}
                                        {car.seller?.verification_status === 'approved' && (
                                            <span style={{ marginLeft: '0.75rem', color: '#24a148', fontWeight: 600 }}>✓ Verified Seller</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f62fe' }}>
                                        TZS {car.price?.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>Negotiable</div>
                                </div>
                            </div>
                        </div>

                        {/* Specs */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.25rem' }}>Specifications</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                                {SPECS.map(([label, value], i) => (
                                    <div key={label} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '0.75rem 0.5rem',
                                        borderBottom: i < SPECS.length - 2 ? '1px solid #f4f4f4' : 'none',
                                        borderRight: i % 2 === 0 ? '1px solid #f4f4f4' : 'none'
                                    }}>
                                        <span style={{ color: '#6f6f6f', fontSize: '0.875rem' }}>{label}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#161616', textTransform: 'capitalize' }}>
                                            {value || '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        {car.features?.length > 0 && (
                            <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1.25rem' }}>Features & Equipment</h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                                    {car.features.map(f => (
                                        <span key={f} style={{
                                            background: '#f0f4ff', color: '#0043ce',
                                            padding: '0.375rem 0.875rem', borderRadius: '20px',
                                            fontSize: '0.875rem', fontWeight: 500
                                        }}>✓ {f}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {car.description && (
                            <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '1rem' }}>Description</h2>
                                <p style={{ color: '#525252', lineHeight: 1.7, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{car.description}</p>
                            </div>
                        )}

                        {/* Loan Calculator */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.375rem' }}>Loan Calculator</h2>
                            <p style={{ color: '#6f6f6f', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Compare financing options from Tanzania's top banks</p>

                            {/* Controls */}
                            <div className="pub-calc-controls">
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#525252' }}>
                                        Down Payment: {downPct}% (TZS {((car.price || 0) * downPct / 100).toLocaleString()})
                                    </label>
                                    <input
                                        type="range" min="10" max="60" step="5"
                                        value={downPct}
                                        onChange={e => setDownPct(Number(e.target.value))}
                                        style={{ width: '100%', accentColor: '#0f62fe' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8d8d8d', marginTop: '0.25rem' }}>
                                        <span>10%</span><span>60%</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#525252' }}>
                                        Loan Term: {loanTerm} months
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {[12, 24, 36, 48, 60].map(m => (
                                            <button key={m} onClick={() => setLoanTerm(m)} style={{
                                                padding: '0.375rem 0.75rem', borderRadius: '4px', cursor: 'pointer',
                                                border: '1px solid', fontWeight: 600, fontSize: '0.8125rem',
                                                background: loanTerm === m ? '#0f62fe' : 'white',
                                                color: loanTerm === m ? 'white' : '#0f62fe',
                                                borderColor: '#0f62fe'
                                            }}>{m}mo</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pub-calc-summary">
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#525252' }}>Car Price</div>
                                    <div style={{ fontWeight: 700 }}>TZS {car.price?.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#525252' }}>Down Payment ({downPct}%)</div>
                                    <div style={{ fontWeight: 700 }}>TZS {((car.price || 0) * downPct / 100).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#525252' }}>Loan Amount</div>
                                    <div style={{ fontWeight: 700, color: '#0f62fe' }}>TZS {((car.price || 0) * (1 - downPct / 100)).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Bank Comparison */}
                            {loanComparison.length > 0 ? (
                                <div className="table-scroll">
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f4f4f4' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#525252', fontSize: '0.8125rem' }}>Bank</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, color: '#525252', fontSize: '0.8125rem' }}>Product</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#525252', fontSize: '0.8125rem' }}>Rate</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#525252', fontSize: '0.8125rem' }}>Monthly</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, color: '#525252', fontSize: '0.8125rem' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loanComparison.map((offer, i) => (
                                                <tr key={offer.productId} style={{ borderBottom: '1px solid #f4f4f4', background: i === 0 ? '#f0fff4' : 'white' }}>
                                                    <td style={{ padding: '0.875rem 0.75rem', fontWeight: 600 }}>
                                                        {i === 0 && <span style={{ fontSize: '0.75rem', background: '#24a148', color: 'white', padding: '1px 6px', borderRadius: '3px', marginRight: '0.375rem' }}>Best</span>}
                                                        {offer.bank}
                                                    </td>
                                                    <td style={{ padding: '0.875rem 0.75rem', color: '#525252' }}>{offer.product}</td>
                                                    <td style={{ padding: '0.875rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>{offer.interestRate}%</td>
                                                    <td style={{ padding: '0.875rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#0f62fe' }}>
                                                        TZS {offer.monthly.toLocaleString()}
                                                    </td>
                                                    <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                                                        <button onClick={() => handleApplyNow(offer.productId, offer.bankId)} style={{
                                                            background: '#0f62fe', color: 'white', border: 'none',
                                                            padding: '0.375rem 0.875rem', borderRadius: '4px',
                                                            cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem'
                                                        }}>
                                                            Apply
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#6f6f6f', fontSize: '0.875rem' }}>
                                    No financing products available for this term. Try a different loan term.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN — Sticky Apply Card */}
                    <div className="pub-sticky-aside">
                        {/* Apply Card */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f62fe', marginBottom: '0.25rem' }}>
                                TZS {car.price?.toLocaleString()}
                            </div>
                            <div style={{ color: '#6f6f6f', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                                Est. TZS {calcMonthly(car.price, 20, 15, 48).toLocaleString()}/month (20% down, 48mo)
                            </div>

                            <button onClick={() => handleApplyNow()} style={{
                                width: '100%', background: '#0f62fe', color: 'white', border: 'none',
                                padding: '1rem', borderRadius: '4px', fontWeight: 700, fontSize: '1.0625rem',
                                cursor: 'pointer', marginBottom: '0.75rem'
                            }}>
                                Apply for Financing
                            </button>

                            <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6f6f6f', marginBottom: '1.25rem' }}>
                                Free to apply · No commitment
                            </div>

                            <div style={{ borderTop: '1px solid #f4f4f4', paddingTop: '1.25rem' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.875rem' }}>Seller Information</div>
                                <div style={{ fontSize: '0.875rem', color: '#525252', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#8d8d8d' }}>Dealer</span>
                                        <span style={{ fontWeight: 600 }}>{car.seller?.business_name || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#8d8d8d' }}>Location</span>
                                        <span style={{ fontWeight: 600 }}>{car.seller?.city || car.location_city || '—'}</span>
                                    </div>
                                    {car.seller?.verification_status === 'approved' && (
                                        <div style={{ marginTop: '0.25rem', color: '#24a148', fontWeight: 600, fontSize: '0.8125rem' }}>
                                            ✓ Verified Dealer
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: '#161616' }}>Why AutoFinance?</div>
                            {[
                                ['🏦', 'Compare 8+ banks at once'],
                                ['⚡', 'Approval in 24–48 hours'],
                                ['🔒', 'Secure & encrypted'],
                                ['✅', 'Verified sellers only'],
                                ['📱', 'Track application status live']
                            ].map(([icon, text]) => (
                                <div key={text} style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.625rem', fontSize: '0.875rem', color: '#525252' }}>
                                    <span>{icon}</span><span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: '#161616', color: '#8d8d8d', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.875rem', marginTop: '2rem' }}>
                © {new Date().getFullYear()} AutoFinance Tanzania
            </footer>

            {showRegisterModal && (
                <SmartRegisterModal car={car} onClose={() => setShowRegisterModal(false)} />
            )}
        </div>
    );
}

export default PublicCarDetails;
