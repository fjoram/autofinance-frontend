import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PublicNav from './PublicNav';

const TESTIMONIALS = [
    {
        name: 'Amina Hassan',
        role: 'Buyer · Dar es Salaam',
        text: 'I got my Toyota Prado within 3 weeks. The loan comparison tool saved me millions — I found a rate 3% lower than my bank offered.',
        initials: 'AH'
    },
    {
        name: 'John Mwangi',
        role: 'Buyer · Arusha',
        text: 'Never thought buying a car could be this easy. Applied for financing, got approved, and drove away. Amazing platform.',
        initials: 'JM'
    },
    {
        name: 'Grace Kimaro',
        role: 'Seller · Mwanza',
        text: 'My dealership has sold 12 cars through AutoFinance this quarter. The seller dashboard makes it effortless to manage listings.',
        initials: 'GK'
    }
];

const HOW_IT_WORKS = [
    {
        step: '01',
        icon: '🔍',
        title: 'Browse & Choose',
        desc: 'Search thousands of verified cars. Filter by make, price, location, and more — no account needed.'
    },
    {
        step: '02',
        icon: '🏦',
        title: 'Compare & Apply',
        desc: 'Use our loan calculator to compare rates from 8+ banks instantly. Apply for financing in under 5 minutes.'
    },
    {
        step: '03',
        icon: '🚗',
        title: 'Get Your Car',
        desc: 'Once approved, the seller reserves your car. Funds are disbursed directly and you drive away.'
    }
];

const MAKES = ['Toyota', 'Nissan', 'Honda', 'Mitsubishi', 'Mercedes-Benz', 'BMW', 'Mazda', 'Subaru', 'Volkswagen', 'Hyundai', 'Kia', 'Suzuki', 'Land Rover', 'Ford', 'Isuzu', 'Peugeot', 'Audi'];

function calcMonthly(price) {
    // 100% financing, 15% annual, 60 months (5 years)
    const r = 0.15 / 12;
    const n = 60;
    return Math.round(price * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

const SLIDES = [
    { img: '/slide1.png', accent: '#f0a500' },
    { img: '/slide2.png', accent: '#fcd116' },
    { img: '/slide3.png', accent: '#42be65' },
];

function HeroSlider({ height }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];

    return (
        <div style={{
            position: 'relative', width: '100%', height: height || '100%',
            backgroundImage: `url(${slide.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.5s ease',
        }}>
            {/* Subtle bottom gradient so dots are visible */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                pointerEvents: 'none',
            }} />

            {/* Dot indicators */}
            <div style={{
                position: 'absolute', bottom: '14px', left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: '0.5rem',
            }}>
                {SLIDES.map((_, i) => (
                    <div key={i} onClick={() => setCurrent(i)} style={{
                        width: i === current ? '24px' : '8px', height: '8px',
                        borderRadius: '4px',
                        background: i === current ? slide.accent : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', transition: 'all 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    }} />
                ))}
            </div>
        </div>
    );
}

function PublicHomePage() {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [stats, setStats] = useState({ cars: 0, banks: 0, applications: 0 });
    const [showMonthly, setShowMonthly] = useState(false);
    const [heroFilters, setHeroFilters] = useState({ make: '', model: '', minYear: '', maxYear: '', minVal: '', maxVal: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedCars();
        fetchStats();
    }, []);

    const fetchFeaturedCars = async () => {
        try {
            const { data } = await supabase
                .from('cars')
                .select('car_id, make, model, year, price, mileage, location_city, images, condition, is_featured, body_type')
                .eq('status', 'available')
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(6);
            setFeaturedCars(data || []);
        } catch (error) {
            console.error('Error fetching featured cars:', error);
            setFeaturedCars([]);
        }
    };

    const fetchStats = async () => {
        try {
            const [{ count: cars }, { count: banks }, { count: apps }] = await Promise.all([
                supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'available'),
                supabase.from('banks').select('*', { count: 'exact', head: true }).eq('is_active', true),
                supabase.from('loan_applications').select('*', { count: 'exact', head: true })
            ]);
            setStats({ cars: cars || 0, banks: banks || 0, applications: apps || 0 });
        } catch (error) {
            console.error('Error fetching stats:', error);
            setStats({ cars: 0, banks: 0, applications: 0 });
        }
    };

    const handleHeroSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (heroFilters.make) params.set('make', heroFilters.make);
        if (heroFilters.model) params.set('model', heroFilters.model);
        if (heroFilters.minYear) params.set('minYear', heroFilters.minYear);
        if (heroFilters.maxYear) params.set('maxYear', heroFilters.maxYear);
        if (heroFilters.minVal) params.set(showMonthly ? 'minMonthly' : 'minPrice', heroFilters.minVal);
        if (heroFilters.maxVal) params.set(showMonthly ? 'maxMonthly' : 'maxPrice', heroFilters.maxVal);
        navigate(`/cars${params.toString() ? '?' + params.toString() : ''}`);
    };

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <PublicNav />

            {/* HERO — two-column CarDuka style */}
            <section style={{
                background: 'linear-gradient(135deg, #0f1b35 0%, #0f62fe 100%)',
                height: '520px',
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden',
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '45% 55%', padding: '0 4rem' }}>

                    {/* LEFT — search & headline */}
                    <div style={{ padding: '1.5rem 2rem 1.5rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#f0a500', marginBottom: '0.5rem' }}>
                            Tanzania's #1 Auto Finance Platform
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.375rem' }}>
                            Buy & Sell Cars with<br />Fast &amp; Affordable Financing
                        </h1>
                        <p style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: '0.75rem', lineHeight: 1.6 }}>
                            Compare loans from Tanzania's top banks and drive away faster.
                        </p>

                        <form onSubmit={handleHeroSearch} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', maxWidth: '460px' }}>

                            {/* Brand & Model */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#525252', marginBottom: '0.25rem' }}>Brand &amp; Model</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                                    <select value={heroFilters.make} onChange={e => setHeroFilters({...heroFilters, make: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem', color: '#161616', background: 'white' }}>
                                        <option value="">Make</option>
                                        {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={heroFilters.model} onChange={e => setHeroFilters({...heroFilters, model: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem', color: '#161616', background: 'white' }}>
                                        <option value="">Model</option>
                                    </select>
                                </div>
                            </div>

                            {/* Year of Manufacture */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#525252', marginBottom: '0.25rem' }}>Year of Manufacture</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                                    <input type="number" placeholder="Min Year" value={heroFilters.minYear}
                                        onChange={e => setHeroFilters({...heroFilters, minYear: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem', color: '#161616' }} />
                                    <input type="number" placeholder="Max Year" value={heroFilters.maxYear}
                                        onChange={e => setHeroFilters({...heroFilters, maxYear: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem', color: '#161616' }} />
                                </div>
                            </div>

                            {/* Price in TZS */}
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#525252', marginBottom: '0.25rem' }}>Price in TZS</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f4f4f4', borderRadius: '6px', padding: '0.375rem 0.625rem', marginBottom: '0.375rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0a500' }}>Show Monthly Payment</div>
                                        <div style={{ fontSize: '0.6875rem', color: '#8d8d8d' }}>5 Year Plan with 100% Financing</div>
                                    </div>
                                    <div onClick={() => setShowMonthly(!showMonthly)} style={{
                                        width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
                                        background: showMonthly ? '#f0a500' : '#e0e0e0', position: 'relative', transition: 'background 0.2s', flexShrink: 0
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: '3px', left: showMonthly ? '21px' : '3px',
                                            width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                                            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                        }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                                    <input type="number" placeholder={showMonthly ? 'Monthly Min' : 'Min Price (TZS)'}
                                        value={heroFilters.minVal} onChange={e => setHeroFilters({...heroFilters, minVal: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem' }} />
                                    <input type="number" placeholder={showMonthly ? 'Monthly Max' : 'Max Price (TZS)'}
                                        value={heroFilters.maxVal} onChange={e => setHeroFilters({...heroFilters, maxVal: e.target.value})}
                                        style={{ padding: '0.375rem 0.5rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '0.8125rem' }} />
                                </div>
                            </div>

                            <button type="submit" style={{
                                background: '#f0a500', color: 'white', border: 'none',
                                padding: '0.625rem', borderRadius: '50px', fontWeight: 700,
                                fontSize: '0.9375rem', cursor: 'pointer', width: '100%', marginTop: '0.125rem'
                            }}>Search Filtered Cars</button>
                            <button type="button" onClick={() => navigate('/cars')} style={{
                                background: '#0f1b35', color: 'white', border: 'none',
                                padding: '0.625rem', borderRadius: '50px', fontWeight: 600,
                                fontSize: '0.875rem', cursor: 'pointer', width: '100%'
                            }}>View All Cars</button>
                        </form>
                    </div>

                    {/* RIGHT — full bleed slider, image IS the panel */}
                    <HeroSlider height="100%" />
                </div>
            </section>

            {/* WHAT ARE YOU LOOKING FOR — car categories */}
            <section style={{ background: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.75rem 4rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#161616', marginBottom: '1rem' }}>What are you looking for?</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                            { icon: '🚙', label: 'SUV' },
                            { icon: '🚗', label: 'Sedan' },
                            { icon: '🛻', label: 'Pickup' },
                            { icon: '🚐', label: 'Minivan' },
                            { icon: '🏎️', label: 'Sports' },
                            { icon: '🚌', label: 'Bus' },
                            { icon: '🚚', label: 'Truck' },
                            { icon: '⚡', label: 'Electric' },
                        ].map((cat) => (
                            <button key={cat.label} onClick={() => navigate(`/cars?type=${cat.label.toLowerCase()}`)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1.25rem', borderRadius: '20px',
                                border: '1px solid #e0e0e0', background: 'white',
                                fontSize: '0.875rem', fontWeight: 600, color: '#161616',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#0f62fe'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#0f62fe'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#161616'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                            >
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                        <button onClick={() => navigate('/cars')} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1.25rem', borderRadius: '20px',
                            border: '1px solid #f0a500', background: '#f0a500',
                            fontSize: '0.875rem', fontWeight: 600, color: 'white', cursor: 'pointer',
                        }}>
                            View All →
                        </button>
                    </div>
                </div>
            </section>

            {/* FEATURED CARS */}
            <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#161616' }}>Featured Cars</h2>
                        <p style={{ color: '#6f6f6f', marginTop: '0.25rem' }}>Handpicked listings from verified sellers</p>
                    </div>
                    <Link to="/cars" style={{ color: '#0f62fe', textDecoration: 'none', fontWeight: 600 }}>View all cars →</Link>
                </div>

                {featuredCars.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6f6f6f' }}>
                        Loading cars...
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {featuredCars.map(car => (
                            <div key={car.car_id} style={{
                                background: 'white', borderRadius: '8px', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
                            >
                                {/* Image */}
                                <div style={{
                                    width: '100%', height: '190px',
                                    background: car.images?.[0] ? `url(${car.images[0]}) center/cover no-repeat` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '4rem', position: 'relative', cursor: 'pointer'
                                }} onClick={() => navigate(`/cars/${car.car_id}`)}>
                                    {!car.images?.[0] && '🚗'}
                                    {car.is_featured && (
                                        <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#f0a500', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>⭐ Featured</span>
                                    )}
                                    <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.55)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {car.condition === 'certified_pre_owned' ? 'CPO' : car.condition}
                                    </span>
                                </div>
                                {/* Details */}
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: '#161616', cursor: 'pointer' }} onClick={() => navigate(`/cars/${car.car_id}`)}>
                                        {car.year} {car.make} {car.model}
                                    </h3>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0a500' }}>
                                        TZS {calcMonthly(car.price).toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#8d8d8d' }}>/ per month for 5 years</span>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: '#6f6f6f', marginBottom: '0.625rem' }}>
                                        TZS {car.price?.toLocaleString()} cash
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', color: '#6f6f6f', fontSize: '0.8rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                                        <span>🏎️ {car.mileage?.toLocaleString()} km</span>
                                        <span>⚙️ {car.transmission}</span>
                                        <span>⛽ {car.fuel_type}</span>
                                        <span>📍 {car.location_city}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <button onClick={() => navigate(`/cars/${car.car_id}`)} style={{
                                            background: '#f0a500', color: 'white', border: 'none',
                                            padding: '0.625rem', borderRadius: '4px', fontWeight: 700,
                                            fontSize: '0.8125rem', cursor: 'pointer'
                                        }}>Car Financing</button>
                                        <button onClick={() => navigate(`/cars/${car.car_id}`)} style={{
                                            background: 'white', color: '#161616', border: '1px solid #e0e0e0',
                                            padding: '0.625rem', borderRadius: '4px', fontWeight: 600,
                                            fontSize: '0.8125rem', cursor: 'pointer'
                                        }}>Cash Purchase</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <button onClick={() => navigate('/cars')} style={{
                        background: '#0f62fe', color: 'white', border: 'none',
                        padding: '0.875rem 2.5rem', borderRadius: '4px', fontWeight: 700,
                        fontSize: '1rem', cursor: 'pointer'
                    }}>
                        Browse All Cars
                    </button>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ background: 'white', padding: '5rem 4rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#161616' }}>How AutoFinance Works</h2>
                        <p style={{ color: '#6f6f6f', marginTop: '0.5rem', fontSize: '1.0625rem' }}>
                            From browsing to driving — in 3 simple steps
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {HOW_IT_WORKS.map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '0 1rem' }}>
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '50%',
                                    background: '#e8f0ff', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.25rem'
                                }}>
                                    {step.icon}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f62fe', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                                    STEP {step.step}
                                </div>
                                <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, marginBottom: '0.75rem', color: '#161616' }}>
                                    {step.title}
                                </h3>
                                <p style={{ color: '#6f6f6f', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST INDICATORS */}
            <section style={{ background: 'linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)', padding: '4rem 4rem', color: 'white' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                        Trusted by Thousands of Tanzanians
                    </h2>
                    <p style={{ opacity: 0.85, fontSize: '1.0625rem', marginBottom: '3rem' }}>
                        We partner with Tanzania's leading financial institutions to bring you the best rates
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {['CRDB Bank', 'NMB Bank', 'Stanbic', 'Equity Bank', 'DTB Bank', 'KCB Bank', 'Absa', 'NBC Bank'].map(bank => (
                            <div key={bank} style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '4px',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}>{bank}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#161616' }}>What Our Customers Say</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '8px', padding: '2rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f59e0b' }}>★★★★★</div>
                            <p style={{ color: '#525252', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                                "{t.text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: '#0f62fe', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: '0.875rem'
                                }}>{t.initials}</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t.name}</div>
                                    <div style={{ color: '#6f6f6f', fontSize: '0.8125rem' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA BANNER */}
            <section style={{ background: '#f4f4f4', padding: '4rem 4rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#161616', marginBottom: '1rem' }}>
                        Ready to Find Your Car?
                    </h2>
                    <p style={{ color: '#6f6f6f', marginBottom: '2rem', fontSize: '1.0625rem' }}>
                        Browse free, compare financing, register only when you're ready to apply.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/cars')} style={{
                            background: '#0f62fe', color: 'white', border: 'none',
                            padding: '0.875rem 2rem', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
                        }}>
                            Browse Cars
                        </button>
                        <button onClick={() => navigate('/register')} style={{
                            background: 'white', color: '#0f62fe', border: '2px solid #0f62fe',
                            padding: '0.875rem 2rem', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
                        }}>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#161616', color: '#c6c6c6', padding: '3rem 4rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                        <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>🚗 AutoFinance</div>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#8d8d8d' }}>
                                Tanzania's premier auto finance platform connecting buyers, sellers, and banks.
                            </p>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Platform</div>
                            {[['Browse Cars', '/cars'], ['How It Works', '/how-it-works'], ['About Us', '/about']].map(([label, path]) => (
                                <div key={path} style={{ marginBottom: '0.5rem' }}>
                                    <Link to={path} style={{ color: '#8d8d8d', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Account</div>
                            {[['Login', '/login'], ['Register as Buyer', '/register'], ['Sell Your Car', '/register']].map(([label, path]) => (
                                <div key={label} style={{ marginBottom: '0.5rem' }}>
                                    <Link to={path} style={{ color: '#8d8d8d', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Contact</div>
                            <div style={{ fontSize: '0.875rem', color: '#8d8d8d', lineHeight: 1.8 }}>
                                <div>📧 info@autofinance.co.tz</div>
                                <div>📞 +255 700 000 000</div>
                                <div>📍 Dar es Salaam, Tanzania</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #393939', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: '#6f6f6f' }}>
                        © {new Date().getFullYear()} AutoFinance Tanzania. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicHomePage;
