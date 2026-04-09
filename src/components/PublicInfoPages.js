import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicNav from './PublicNav';

export function HowItWorksPage() {
    const navigate = useNavigate();
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <PublicNav />
            <section style={{ background: 'linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1rem' }}>How AutoFinance Works</h1>
                    <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>From browsing to driving — we make car financing simple, transparent, and fast.</p>
                </div>
            </section>

            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>

                {/* FOR BUYERS */}
                <div id="buyers" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f62fe', marginBottom: '1.5rem', paddingTop: '1rem' }}>For Buyers</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: '🔍', title: 'Browse Cars', desc: 'Search thousands of verified cars. Filter by make, price, location — no account required.' },
                            { icon: '🧮', title: 'Use the Loan Calculator', desc: 'See monthly payment estimates from all partner banks instantly side by side.' },
                            { icon: '📝', title: 'Create a Free Account', desc: 'Register as a buyer in under 2 minutes — no paperwork yet.' },
                            { icon: '🏦', title: 'Apply for Financing', desc: 'Apply to one or multiple banks with a single form and upload documents digitally.' },
                            { icon: '✅', title: 'Get Approved', desc: 'Banks respond within 24–48 hours. Track your application status in real time.' },
                            { icon: '🚗', title: 'Drive Away', desc: 'Once approved, funds go directly to the seller and you collect your car.' },
                        ].map((step, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', background: '#e8f0ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f62fe', letterSpacing: '1.5px', marginBottom: '0.25rem' }}>STEP {i + 1}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{step.title}</h3>
                                    <p style={{ color: '#525252', lineHeight: 1.65, fontSize: '0.9rem' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOR SELLERS */}
                <div id="sellers" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#24a148', marginBottom: '1.5rem', paddingTop: '1rem' }}>For Sellers</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: '🖊️', title: 'Register as a Seller', desc: 'Create your dealer account and get verified by our admin team — usually within 24 hours.' },
                            { icon: '📸', title: 'List Your Cars', desc: 'Add your inventory with photos, specs, and price. Your cars appear instantly in search results.' },
                            { icon: '📥', title: 'Receive Applications', desc: 'When a buyer applies for financing on your car, you get notified immediately.' },
                            { icon: '💰', title: 'Get Paid', desc: 'Once financing is approved, funds are disbursed directly to your account.' },
                        ].map((step, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', background: '#defbe6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#24a148', letterSpacing: '1.5px', marginBottom: '0.25rem' }}>STEP {i + 1}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{step.title}</h3>
                                    <p style={{ color: '#525252', lineHeight: 1.65, fontSize: '0.9rem' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOR BANKS */}
                <div id="banks" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0a500', marginBottom: '1.5rem', paddingTop: '1rem' }}>For Banks</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: '🤝', title: 'Partner with AutoFinance', desc: 'Join our network of financial institutions and reach thousands of qualified loan applicants.' },
                            { icon: '📊', title: 'Receive Pre-Qualified Applications', desc: 'Get structured, complete applications with buyer details and car info — ready to review.' },
                            { icon: '⚡', title: 'Approve Fast', desc: 'Use your bank portal to approve, reject, or request more info. Applicants are notified instantly.' },
                            { icon: '🏆', title: 'Grow Your Portfolio', desc: 'Increase auto loan volume with minimal acquisition cost through our marketplace.' },
                        ].map((step, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', background: '#fef3cd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f0a500', letterSpacing: '1.5px', marginBottom: '0.25rem' }}>STEP {i + 1}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{step.title}</h3>
                                    <p style={{ color: '#525252', lineHeight: 1.65, fontSize: '0.9rem' }}>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button onClick={() => navigate('/cars')} style={{ background: '#0f62fe', color: 'white', border: 'none', padding: '0.875rem 2.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginRight: '1rem' }}>
                        Browse Cars Now
                    </button>
                    <button onClick={() => navigate('/register')} style={{ background: 'white', color: '#0f62fe', border: '2px solid #0f62fe', padding: '0.875rem 2.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        Register Free
                    </button>
                </div>
            </section>

            <footer style={{ background: '#161616', color: '#8d8d8d', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} AutoFinance Tanzania
            </footer>
        </div>
    );
}

export function AboutPage() {
    const navigate = useNavigate();
    return (
        <div style={{ background: '#f4f4f4', minHeight: '100vh' }}>
            <PublicNav />
            <section style={{ background: 'linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)', padding: '4rem 2rem', color: 'white', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '1rem' }}>About AutoFinance</h1>
                <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>Connecting Tanzanian car buyers with the financing they deserve.</p>
            </section>

            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
                {[
                    { title: 'Our Mission', text: 'AutoFinance exists to make car ownership accessible to every Tanzanian. We bridge the gap between car buyers, trusted dealers, and financial institutions — creating a transparent, efficient, and trustworthy marketplace.' },
                    { title: 'The Problem We Solve', text: 'Buying a car in Tanzania has historically meant visiting multiple banks, dealing with opaque loan terms, and navigating a fragmented market. AutoFinance brings everything together in one platform: browse, compare financing, and apply — all online.' },
                    { title: 'Our Partners', text: 'We work with over 8 of Tanzania\'s leading banks and financial institutions, including CRDB, NMB, Stanbic, Equity Bank, DTB, KCB, Absa, and NBC Bank. Our dealer network includes verified sellers from Dar es Salaam, Arusha, Mwanza, and beyond.' }
                ].map(section => (
                    <div key={section.title} style={{ background: 'white', borderRadius: '8px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '1rem', color: '#161616' }}>{section.title}</h2>
                        <p style={{ color: '#525252', lineHeight: 1.7, fontSize: '0.9375rem' }}>{section.text}</p>
                    </div>
                ))}

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button onClick={() => navigate('/cars')} style={{ background: '#0f62fe', color: 'white', border: 'none', padding: '0.875rem 2.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                        Start Browsing
                    </button>
                </div>
            </section>

            <footer style={{ background: '#161616', color: '#8d8d8d', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} AutoFinance Tanzania
            </footer>
        </div>
    );
}
