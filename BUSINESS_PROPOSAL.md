# AutoFinance Hub — Business Proposal

**Prepared by:** Frank Joram  
**Date:** May 13, 2026  
**Submitted to:** I&M Bank Tanzania

---

## 1. Executive Summary

AutoFinance Hub is a digital car financing platform built exclusively for a single banking partner. The bank is the sole financing institution on the platform — all loan applications generated go directly to the bank. The platform connects car buyers and verified dealers on one seamless digital experience where a buyer can browse cars, apply for the bank's car loan, select insurance, and complete the full application in under 10 minutes — without visiting a branch.

The platform is already built and deployed. This proposal presents the partnership case, market opportunity, and the mutual value this creates for the bank and for car buyers in Tanzania.

---

## 2. Problem Statement

Car financing in Tanzania today is slow and branch-dependent:

- Buyers must visit a branch to learn about loan terms and eligibility
- Dealers have no digital channel to refer customers directly to the bank's loan products
- Loan applications are paper-heavy and take days to initiate
- The bank misses out on creditworthy buyers who drop off due to friction in the process

**Result:** Many qualifying car purchases never turn into loan applications — not because buyers lack creditworthiness, but because the process is too cumbersome.

---

## 3. Solution — What AutoFinance Hub Does

AutoFinance Hub acts as the bank's dedicated digital car financing front-end:

| Role | What the Platform Does |
|---|---|
| **Buyer** | Browse verified cars, view the bank's loan terms and monthly payment estimates, and submit a loan application online |
| **Seller / Dealer** | List car inventory, track buyer inquiries, and refer customers directly into the bank's financing flow |
| **Bank** | Receive structured, pre-filled loan applications digitally from real buyers with a specific car already selected |
| **Admin** | Manage all users, monitor applications, track disbursements, and control platform settings from a central dashboard |

**Key platform features (already built):**
- Public car browsing with filters (make, model, price, location, body type, condition, transmission)
- Monthly payment estimator showing the bank's loan terms on every car listing
- Single-click loan application — buyer selects car, sees repayment schedule, and applies
- Dedicated dashboards: Buyer portal, Seller/Dealer portal, Bank portal, Admin panel
- Bank portal shows all applications, statuses, and disbursement records in real time
- Supabase (PostgreSQL) backend — secure, scalable, real-time
- Deployed on Vercel — fully live, accessible from any device

### The Buyer Journey — Step by Step

Insurance is not an afterthought — it is a built-in, mandatory step in the financing flow. Every buyer must select an insurance policy before their loan application is submitted. This is how the process works:

| Step | What the Buyer Does | What the Platform Does |
|---|---|---|
| **1. Browse** | Searches cars by make, price, location, body type | Displays verified listings with monthly payment estimates |
| **2. Select Car** | Clicks on a car they want | Shows full car details, seller info, and the bank's loan calculator |
| **3. Configure Loan** | Chooses deposit amount and repayment period | Calculates exact monthly repayment using the bank's rate in real time |
| **4. Select Insurance** | Chooses from available insurance options (AAR, Jubilee, Heritage) | Displays each insurer's premium, coverage type, and adds it to the total loan cost |
| **5. Review & Apply** | Reviews the full cost breakdown — car price, loan amount, insurance premium, monthly repayment | Submits a complete, structured application to the bank |
| **6. Bank Review** | Awaits approval | Bank receives the full application in its portal with all details pre-filled |

Insurance is selected **before** the application reaches the bank — meaning every application that arrives already has an insurance policy attached to it.

---

## 4. Value to the Bank

This is not a lead generation tool — it is a full application pipeline delivered to the bank:

| Benefit | Detail |
|---|---|
| **More applications** | Buyers who would never walk into a branch can apply from their phone at midnight |
| **Better-qualified leads** | Each application includes the specific car, price, seller, and buyer details — pre-structured for credit assessment |
| **Collateral always insured** | Every loan application arrives with an insurance policy already selected — the bank's financed asset is protected from day one |
| **Higher loan values** | Insurance premiums are included in the total financing amount, increasing the average loan size disbursed |
| **Dealer network as a sales force** | Every dealer on the platform is effectively referring customers to the bank's loan product |
| **Brand visibility** | The bank's logo, rates, and loan products are the only ones buyers see — no competitor banks |
| **Data** | Full visibility into buyer demand, application volumes, car segments, and regional interest |
| **Digital transformation** | Positions the bank as a modern, customer-centric institution in a segment that is moving online |

---

## 5. Market Opportunity

### Tanzania Automotive Market
- Tanzania registers approximately **50,000–70,000 vehicles per year** (used and new combined)
- Over **70% of car purchases** in sub-Saharan Africa involve some form of financing or installment
- Digital adoption is growing rapidly — Tanzania had ~60 million mobile subscribers in 2025
- Fewer than 5 dedicated digital car financing platforms exist in Tanzania today

### Loan Volume Potential for the Bank

| Scenario | Applications/Year | Avg Loan (TZS) | Total Loan Book Added |
|---|---|---|---|
| Conservative | 300 | 18,000,000 | 5.4 billion |
| Moderate | 900 | 22,000,000 | 19.8 billion |
| Optimistic | 3,000 | 25,000,000 | 75 billion |

These represent **net new loan book growth** — customers the bank would not have reached through branch walk-ins alone.

---

## 6. Revenue Model

The platform is self-sustaining through seller and listing fees, keeping the bank's cost of participation low:

### 6.1 Platform Transaction Fee (paid by AutoFinance / shared with bank)
- **0.5% fee** on each disbursed loan amount
- This can be structured as a referral commission the bank pays to the platform per successful disbursement
- Example: TZS 20,000,000 loan → TZS 100,000 per transaction

### 6.2 Seller Listing Fees (platform revenue)
- Free tier: limited listings
- Premium dealer subscription: TZS 50,000–200,000/month for unlimited listings and analytics

### 6.3 Featured/Promoted Listings (platform revenue)
- Dealers pay for top placement in search results
- TZS 15,000–30,000 per featured slot per week

### 6.4 Insurance Commission (platform revenue)
- Insurance selection is mandatory at Step 4 of every loan application — no buyer can submit without choosing a policy
- Current insurance partners on the platform: **AAR Insurance** (Comprehensive, 3.5% premium), **Jubilee Insurance** (Comprehensive, 3.0% premium), **Heritage Insurance** (Third Party, 2.5% premium)
- The platform earns a referral commission from each insurer per policy selected
- Typical commission: 5–10% of the premium value
- Example: TZS 20,000,000 car → AAR comprehensive premium ~TZS 700,000 → platform earns TZS 35,000–70,000 per policy

The bank's only cost is the per-disbursement referral fee — **paid only when a loan is successfully issued.**

---

## 7. Revenue Projections (3-Year Estimate)

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Cars listed | 500 | 2,500 | 8,000 |
| Loan applications | 300 | 1,500 | 5,000 |
| Loans disbursed | 150 | 900 | 3,500 |
| Avg loan value (TZS) | 18,000,000 | 22,000,000 | 25,000,000 |
| Transaction fee revenue | 13.5M | 99M | 437.5M |
| Listing/subscription revenue | 5M | 40M | 120M |
| Insurance commissions | 2M | 15M | 50M |
| **Total Platform Revenue (TZS)** | **~20M** | **~154M** | **~607M** |
| **Bank loan book added (TZS)** | **2.7B** | **19.8B** | **87.5B** |

*Projections are estimates based on conservative market penetration assumptions.*

---

## 8. Competitive Advantage

| Factor | AutoFinance Hub | Branch Walk-in | Other Platforms |
|---|---|---|---|
| Available 24/7 from any device | Yes | No | Some |
| Exclusive bank product placement | Yes | N/A | No |
| Insurance bundled in same flow | Yes | No | No |
| Real-time loan calculator | Yes | No | Some |
| Verified seller/dealer network | Yes | No | Some |
| Full application pipeline to bank | Yes | Yes | No |
| Already built & deployed | Yes | N/A | N/A |

The platform's biggest advantage is that it is **already operational** — there is no development risk for the bank, only partnership execution.

---

## 9. Target Users

### Buyers
- Employed professionals aged 25–45 in Dar es Salaam, Arusha, Mwanza
- First-time car buyers seeking a straightforward financing path
- Diaspora buyers purchasing vehicles for family members in Tanzania

### Sellers / Dealers
- Independent used car dealers (5–50 car inventory)
- Franchised dealerships (Toyota, Suzuki, Nissan Tanzania)
- Private sellers with 1–3 cars

---

## 10. Go-to-Market Strategy

### Phase 1 — Launch (Months 1–3)
- Onboard 5–10 verified dealers in Dar es Salaam
- Integrate the bank's loan product terms and application flow
- Run targeted Facebook/Instagram ads to car buyers in DSM
- Offer dealers free listings for 90 days to build inventory volume

### Phase 2 — Growth (Months 4–9)
- Expand dealer network to Arusha and Mwanza
- Introduce dealer subscriptions and featured listings
- Add insurance partner commissions
- Co-brand platform with the bank for increased trust and visibility

### Phase 3 — Scale (Months 10–24)
- Build mobile app (React Native, same backend)
- Explore regional expansion to Kenya (bank's Kenya branch or partner bank)
- Introduce credit pre-qualification flow to improve application conversion rates

---

## 11. Technology Stack & Running Costs

| Component | Technology | Monthly Cost |
|---|---|---|
| Frontend | React (Vercel) | $20 |
| Database | Supabase (PostgreSQL) | $25 |
| Authentication | Supabase Auth | Included |
| File Storage | Supabase Storage | Included |
| Domain | Custom (.co.tz) | ~$15/year |
| **Total running cost** | | **~$45/month** |

Infrastructure costs are minimal and scale linearly with usage — no large upfront technology investment required from the bank.

---

## 12. Engagement Options

Two engagement models are available. The bank may choose the one that best fits its strategy.

---

### Option A — Revenue-Share Partnership

AutoFinance Hub remains independently owned and operated. The bank participates as the exclusive financing partner.

| Item | Detail |
|---|---|
| **Bank's role** | Exclusive financing partner — sole lender on the platform |
| **Bank's cost** | 0.5% referral fee per successfully disbursed loan only |
| **Platform's role** | Build and maintain the buyer/seller experience, drive traffic, manage dealer onboarding |
| **Integration needed** | API or webhook to receive structured loan applications from the platform |
| **Co-branding** | Bank logo and approved messaging displayed to all users in the financing flow |

No upfront fee is required from the bank. The partnership is **performance-based** — the platform earns only when the bank disburses a loan.

---

### Option B — Full Platform Acquisition

The bank purchases the AutoFinance Hub platform outright and takes full ownership and operational control. The platform is rebranded and managed entirely by the bank.

| Item | Detail |
|---|---|
| **Ownership** | Full transfer of source code, database, domain, and all platform assets to the bank |
| **Operations** | The bank manages all platform functions — sellers, buyers, applications, and administration |
| **Seller & buyer fees** | The bank retains 100% of all listing fees, commissions, and transaction revenue |
| **Support contract** | Seller (Frank Joram) provides a dedicated technical support and maintenance contract post-acquisition |
| **Support scope** | Bug fixes, feature updates, technical guidance, and onboarding support for the bank's internal team |
| **Acquisition price** | To be agreed between both parties |
| **Support contract fee** | To be agreed between both parties |

This option gives the bank complete autonomy — no revenue sharing, no ongoing dependency on a third party for the core product. The only ongoing engagement is a support contract to ensure continuity and smooth operation.

**Why this makes sense for the bank:**
- Full control over branding, data, and product direction
- The platform becomes a proprietary bank asset
- No profit-sharing on loan disbursements or seller fees
- The support contract ensures institutional knowledge is retained during transition

---

## 13. Team

- **Founder / Product Lead:** Frank Joram — built the platform end-to-end, understands both product and the Tanzanian market
- *Open roles:* Partnerships Manager, Customer Support, Digital Marketing Specialist

---

## 14. Conclusion

AutoFinance Hub gives I&M Bank a ready-made digital channel to grow its car loan book — without building anything from scratch. The platform is live, the dealer network is being onboarded, and the product is fully operational today.

Two clear paths are on the table:

- **Option A** — Partner with the platform on a performance-based revenue share, with zero upfront cost and payment tied only to successful loan disbursements.
- **Option B** — Acquire the platform outright, take full ownership and control, and engage the builder on a support contract to ensure a smooth transition.

Either way, I&M Bank gains immediate access to a digital car financing channel that would take 12–18 months and significant investment to build internally.

We welcome a meeting to walk through the live platform, review the codebase, and agree on the preferred engagement model.

---

*For inquiries, contact: frank.joram@gmail.com*
