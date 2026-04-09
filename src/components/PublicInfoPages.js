import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PublicNav from './PublicNav';

const SECTIONS = [
    { key: 'buyers', label: 'For Buyers', color: '#0f62fe', bg: '#e8f0ff' },
    { key: 'sellers', label: 'For Sellers', color: '#24a148', bg: '#defbe6' },
    { key: 'banks', label: 'For Banks', color: '#f0a500', bg: '#fef3cd' },
];

export function HowItWorksPage() {
    const navigate = useNavigate();
    const { hash } = useLocation();
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from('how_it_works_steps')
            .select('*')
            .eq('is_active', true)
            .order('step_number')
            .then(({ data }) => { setSteps(data || []); setLoading(false); });
    }, []);

    useEffect(() => {
        if (!loading && hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash, loading]);

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

                {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#6f6f6f' }}>Loading...</div>}

                {!loading && SECTIONS.map(section => {
                    const sectionSteps = steps.filter(s => s.section === section.key);
                    return (
                <div key={section.key} id={section.key} style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: section.color, marginBottom: '1.5rem', paddingTop: '1rem' }}>{section.label}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sectionSteps.map((step, i) => (
                            <div key={step.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', background: section.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: section.color, letterSpacing: '1.5px', marginBottom: '0.25rem' }}>STEP {i + 1}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>{step.title}</h3>
                                    <p style={{ color: '#525252', lineHeight: 1.65, fontSize: '0.9rem' }}>{step.description}</p>
                                </div>
                            </div>
                        ))}
                        {sectionSteps.length === 0 && (
                            <div style={{ color: '#8d8d8d', fontSize: '0.9rem', fontStyle: 'italic' }}>No steps added yet.</div>
                        )}
                    </div>
                </div>
                    );
                })}

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
