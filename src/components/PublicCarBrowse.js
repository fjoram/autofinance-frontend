import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PublicNav from './PublicNav';

function calcMonthlyEstimate(price) {
    // Quick estimate: 20% down, 15% annual rate, 48 months
    const principal = price * 0.8;
    const r = 0.15 / 12;
    const n = 48;
    return Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

const BODY_TYPES = ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Hatchback'];
const CONDITIONS = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'certified_pre_owned', label: 'Certified Pre-Owned' }
];

function PublicCarBrowse() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        make: '',
        location: '',
        minYear: '',
        maxYear: '',
        bodyType: '',
        condition: '',
        transmission: ''
    });
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cars')
            .select(`
                car_id, make, model, year, price, mileage, location_city, location_region,
                images, condition, body_type, transmission, fuel_type, is_featured, created_at,
                seller:sellers(business_name, verification_status)
            `)
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (!error) setCars(data || []);
        setLoading(false);
    };

    const getFilteredSorted = () => {
        let result = [...cars];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(c =>
                c.make?.toLowerCase().includes(q) ||
                c.model?.toLowerCase().includes(q) ||
                c.location_city?.toLowerCase().includes(q) ||
                c.location_region?.toLowerCase().includes(q)
            );
        }

        // Filters
        if (filters.minPrice) result = result.filter(c => c.price >= parseFloat(filters.minPrice));
        if (filters.maxPrice) result = result.filter(c => c.price <= parseFloat(filters.maxPrice));
        if (filters.make) result = result.filter(c => c.make?.toLowerCase().includes(filters.make.toLowerCase()));
        if (filters.location) result = result.filter(c =>
            c.location_city?.toLowerCase().includes(filters.location.toLowerCase()) ||
            c.location_region?.toLowerCase().includes(filters.location.toLowerCase())
        );
        if (filters.minYear) result = result.filter(c => c.year >= parseInt(filters.minYear));
        if (filters.maxYear) result = result.filter(c => c.year <= parseInt(filters.maxYear));
        if (filters.bodyType) result = result.filter(c => c.body_type?.toLowerCase() === filters.bodyType.toLowerCase());
        if (filters.condition) result = result.filter(c => c.condition === filters.condition);
        if (filters.transmission) result = result.filter(c => c.transmission === filters.transmission);

        // Sort
        switch (sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'year-desc': result.sort((a, b) => b.year - a.year); break;
            case 'newest': result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
            default: break;
        }

        // Featured first
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

        return result;
    };

    const clearFilters = () => {
        setFilters({ minPrice: '', maxPrice: '', make: '', location: '', minYear: '', maxYear: '', bodyType: '', condition: '', transmission: '' });
        setSearch('');
    };

    const filtered = getFilteredSorted();
    const hasFilters = search || Object.values(filters).some(v => v);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <PublicNav />

            {/* Page Header */}
            <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', padding: '1.5rem 2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#161616', marginBottom: '0.25rem' }}>
                        Browse Cars
                    </h1>
                    <p style={{ color: '#6f6f6f', fontSize: '0.9375rem' }}>
                        {loading ? 'Loading...' : `${filtered.length} cars available`}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

                {/* FILTER PANEL */}
                <aside style={{ width: '260px', flexShrink: 0 }}>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: '80px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Filters</span>
                            {hasFilters && (
                                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#0f62fe', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                                    Clear all
                                </button>
                            )}
                        </div>

                        {[
                            { label: 'Make / Brand', key: 'make', type: 'text', placeholder: 'e.g., Toyota' },
                            { label: 'Location', key: 'location', type: 'text', placeholder: 'City or region' },
                            { label: 'Min Price (TZS)', key: 'minPrice', type: 'number', placeholder: '0' },
                            { label: 'Max Price (TZS)', key: 'maxPrice', type: 'number', placeholder: '500,000,000' },
                            { label: 'Min Year', key: 'minYear', type: 'number', placeholder: '2000' },
                            { label: 'Max Year', key: 'maxYear', type: 'number', placeholder: new Date().getFullYear().toString() },
                        ].map(field => (
                            <div key={field.key} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#525252', marginBottom: '0.375rem' }}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    value={filters[field.key]}
                                    onChange={e => setFilters({ ...filters, [field.key]: e.target.value })}
                                    placeholder={field.placeholder}
                                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.875rem' }}
                                />
                            </div>
                        ))}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#525252', marginBottom: '0.375rem' }}>Body Type</label>
                            <select
                                value={filters.bodyType}
                                onChange={e => setFilters({ ...filters, bodyType: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.875rem' }}
                            >
                                <option value="">All Types</option>
                                {BODY_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#525252', marginBottom: '0.375rem' }}>Condition</label>
                            <select
                                value={filters.condition}
                                onChange={e => setFilters({ ...filters, condition: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.875rem' }}
                            >
                                <option value="">All Conditions</option>
                                {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#525252', marginBottom: '0.375rem' }}>Transmission</label>
                            <select
                                value={filters.transmission}
                                onChange={e => setFilters({ ...filters, transmission: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '0.875rem' }}
                            >
                                <option value="">All</option>
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Search + Sort bar */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search make, model, location..."
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '0.75rem 1rem',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                fontSize: '0.9375rem',
                                background: 'white'
                            }}
                        />
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                fontSize: '0.875rem',
                                background: 'white',
                                fontWeight: 500
                            }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="year-desc">Year: Newest</option>
                        </select>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#0f62fe' }}>Loading cars...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '8px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No cars found</h3>
                            <p style={{ color: '#6f6f6f' }}>Try adjusting your search or filters</p>
                            <button onClick={clearFilters} style={{
                                marginTop: '1rem', background: '#0f62fe', color: 'white',
                                border: 'none', padding: '0.625rem 1.5rem', borderRadius: '4px',
                                cursor: 'pointer', fontWeight: 600
                            }}>Clear Filters</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {filtered.map(car => (
                                <div
                                    key={car.car_id}
                                    onClick={() => navigate(`/cars/${car.car_id}`)}
                                    style={{
                                        background: 'white', borderRadius: '8px', overflow: 'hidden',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
                                        transition: 'all 0.25s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
                                >
                                    {/* Image */}
                                    <div style={{
                                        width: '100%', height: '190px',
                                        background: car.images?.[0] ? `url(${car.images[0]}) center/cover no-repeat` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '3.5rem', position: 'relative'
                                    }}>
                                        {!car.images?.[0] && '🚗'}
                                        {car.is_featured && (
                                            <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                ⭐ Featured
                                            </span>
                                        )}
                                        <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.55)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {car.condition === 'certified_pre_owned' ? 'CPO' : car.condition}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div style={{ padding: '1.125rem' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem', color: '#161616' }}>
                                            {car.year} {car.make} {car.model}
                                        </h3>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f62fe', marginBottom: '0.625rem' }}>
                                            TZS {car.price?.toLocaleString()}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', color: '#6f6f6f', fontSize: '0.8125rem', marginBottom: '0.875rem' }}>
                                            <span>📍 {car.location_city}</span>
                                            <span>🏎️ {car.mileage?.toLocaleString()} km</span>
                                            <span>⚙️ {car.transmission}</span>
                                        </div>
                                        {/* Loan estimate */}
                                        <div style={{ background: '#f0f4ff', borderRadius: '4px', padding: '0.625rem 0.875rem', fontSize: '0.8125rem' }}>
                                            <span style={{ color: '#525252' }}>Est. monthly: </span>
                                            <span style={{ fontWeight: 700, color: '#0f62fe' }}>
                                                TZS {calcMonthlyEstimate(car.price).toLocaleString()}/mo
                                            </span>
                                            <span style={{ color: '#8d8d8d' }}> (20% down, 48mo)</span>
                                        </div>
                                        {car.seller?.verification_status === 'approved' && (
                                            <div style={{ marginTop: '0.625rem', fontSize: '0.75rem', color: '#24a148', fontWeight: 600 }}>
                                                ✓ Verified Seller
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: '#161616', color: '#8d8d8d', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.875rem', marginTop: '2rem' }}>
                © {new Date().getFullYear()} AutoFinance Tanzania · <a href="/about" style={{ color: '#8d8d8d' }}>About</a> · <a href="/how-it-works" style={{ color: '#8d8d8d' }}>How It Works</a>
            </footer>
        </div>
    );
}

export default PublicCarBrowse;
