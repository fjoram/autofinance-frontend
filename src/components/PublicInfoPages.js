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
                            { icon: '🔍', title: 'Browse Cars', desc: 'Search verified cars from trusted dealers across Tanzania. Filter by make, model, price, location — no account required.' },
                            { icon: '🧮', title: 'Compare Bank Rates', desc: 'Use the built-in loan calculator to compare monthly repayments and interest rates from all partner banks side by side.' },
                            { icon: '📝', title: 'Create a Free Account', desc: 'Register as a buyer in under 2 minutes. No paperwork yet — just your basic details.' },
                            { icon: '📄', title: 'Submit Your Application', desc: 'Select your preferred car and apply for financing. Upload required documents digitally: National ID, payslips, bank statements, and employment letter.' },
                            { icon: '🏦', title: 'Bank Review & Offer Letter', desc: 'The bank reviews your application and credit profile. If approved, you receive an official offer letter stating the loan amount, interest rate, and repayment terms.' },
                            { icon: '✍️', title: 'Accept Offer & Sign Agreement', desc: 'Review and accept the loan offer. Sign the loan agreement and any security documents at the bank.' },
                            { icon: '🔎', title: 'Car Inspection', desc: 'The bank arranges an independent inspection and valuation of the vehicle to confirm its condition and market value.' },
                            { icon: '🛡️', title: 'Arrange Comprehensive Insurance', desc: 'Obtain comprehensive motor insurance for the car. The bank requires this before disbursing funds. The policy must name the bank as the principal beneficiary.' },
                            { icon: '📒', title: 'Log Book Handover', desc: 'Hand over the original vehicle log book (registration card) to the bank as collateral for the duration of the loan.' },
                            { icon: '💸', title: 'Funds Disbursed to Seller', desc: 'Once all conditions are met, the bank transfers the full loan amount directly to the seller\'s account.' },
                            { icon: '🚗', title: 'Collect Your Car', desc: 'The seller releases the car to you. You begin monthly repayments as per your loan agreement.' },
                            { icon: '📒', title: 'Log Book Returned on Full Repayment', desc: 'Once the loan is fully repaid, the bank releases the caveat and returns the original log book to you.' },
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
                            { icon: '🖊️', title: 'Register & Get Verified', desc: 'Create your dealer account and submit your business details. Our admin team verifies your account — usually within 24 hours.' },
                            { icon: '📸', title: 'List Your Cars', desc: 'Add your inventory with photos, full specifications, and price. Your listings appear immediately in buyer search results.' },
                            { icon: '📥', title: 'Receive Buyer Applications', desc: 'When a buyer applies for financing on your listed car, you are notified immediately via the platform.' },
                            { icon: '🔎', title: 'Facilitate Car Inspection', desc: 'Allow the bank\'s inspector or appointed valuer access to the vehicle for a physical inspection and valuation.' },
                            { icon: '📒', title: 'Prepare the Log Book', desc: 'Ensure the original vehicle log book (registration card) is available and ready to be handed to the bank upon deal completion.' },
                            { icon: '✍️', title: 'Sign Transfer Documents', desc: 'Complete the vehicle ownership transfer documents as required by SUMATRA/TRA once financing is confirmed.' },
                            { icon: '💰', title: 'Receive Payment', desc: 'Once the bank approves the loan and all documents are in order, funds are disbursed directly to your account. Release the car to the buyer.' },
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
                            { icon: '🤝', title: 'Partner with AutoFinance', desc: 'Join our network of financial institutions. Set up your loan products, interest rates, and eligibility criteria on the platform.' },
                            { icon: '📊', title: 'Receive Structured Applications', desc: 'Get complete, pre-filled loan applications with buyer KYC details, employment information, bank statements, and the specific car being financed.' },
                            { icon: '📋', title: 'Review Documents & Credit Assessment', desc: 'Assess the applicant\'s creditworthiness — verify income, check credit history, and confirm repayment capacity against the requested loan amount.' },
                            { icon: '📄', title: 'Issue Conditional Offer Letter', desc: 'If the application meets your criteria, issue a conditional offer letter to the buyer stating the approved loan amount, interest rate, loan term, and any conditions.' },
                            { icon: '🔎', title: 'Arrange Car Inspection & Valuation', desc: 'Commission an independent physical inspection and valuation of the vehicle. Confirm the car\'s condition, mileage, and that its market value supports the loan amount.' },
                            { icon: '📑', title: 'Receive Valuation Report', desc: 'Review the inspector\'s valuation report. Confirm the car qualifies as acceptable collateral before proceeding to final approval.' },
                            { icon: '✅', title: 'Grant Final Loan Approval', desc: 'Once inspection is satisfactory and all conditions are met, issue the final loan approval and instruct the buyer to proceed with signing.' },
                            { icon: '✍️', title: 'Sign Loan & Security Agreement', desc: 'The buyer signs the loan agreement, chattels mortgage, or other security documents at your branch as required by your institution.' },
                            { icon: '🛡️', title: 'Confirm Comprehensive Insurance', desc: 'Verify that the buyer has obtained comprehensive motor insurance naming the bank as the principal beneficiary for the duration of the loan.' },
                            { icon: '📒', title: 'Collect the Log Book', desc: 'Collect the original vehicle log book (registration card) from the seller as security. Register a caveat or lien against the vehicle at SUMATRA/TRA to protect the bank\'s interest.' },
                            { icon: '💸', title: 'Disburse Funds to Seller', desc: 'Transfer the approved loan amount directly to the seller\'s verified bank account. Notify both buyer and seller of the disbursement.' },
                            { icon: '📈', title: 'Monitor Loan Repayments', desc: 'Track monthly repayments through the buyer\'s account. Use the AutoFinance portal to update application status and manage your auto loan portfolio.' },
                            { icon: '📒', title: 'Release Log Book on Full Repayment', desc: 'Once the buyer completes all repayments, discharge the caveat at SUMATRA/TRA and return the original log book to the buyer.' },
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
