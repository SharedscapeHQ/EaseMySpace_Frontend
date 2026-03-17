import React, { useEffect, useRef } from "react";
import "./EaseMySpaceShowcase.css";


import kycPage from "/app_assets/kyc_page.webp";
import listingImg from "/app_assets/listing.webp";
import rentPayment from "/app_assets/rentPayment.webp";
import RecentlyViewedProperties from "./RecentlyViewedProperties";
import NewlyListedProperties from "./NewlyListedProperties";
import RecentAddedProperties from "./RecentAddedProperties";
import AndheriProperties from "./AndheriProperties";
import Banner from "./Banner";
import Hero_v2 from "./Hero_v2";


const EaseMySpaceShowcase = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const firstStep = containerRef.current?.querySelector(".hiw-step");
    if (firstStep) {
      firstStep.classList.add("active");
    }
  }, []);

  

  return (
    <div ref={containerRef} className="ease-my-space-showcase">

     
      <Hero_v2/>

        <RecentlyViewedProperties/>
        <NewlyListedProperties />
        <RecentAddedProperties />
        <AndheriProperties/>
        <Banner />

      <section className="offers-section" id="services">
        <div className="offers-header">
          <div className="eyebrow-row">
            <div className="eyebrow-tag">✦ Our Services</div>
          </div>
          <h2 className="sec-title">Find your perfect space.</h2>
          <p className="sec-sub">
            From shared rooms to full flats — EaseMySpace has every kind of
            urban living covered across Mumbai.
          </p>
        </div>

        <div className="offer-track-wrap">
          <div className="offer-track">
            <div className="offer-chip">
              <span className="offer-chip-icon">👫</span>Flatmate Search
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🏠</span>PG Accommodation
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🏢</span>Full Flat Rentals
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">✅</span>Verified Listings
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">💸</span>In-App Rent Payment
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📄</span>Digital Agreements
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🔐</span>KYC Verification
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🏡</span>Property Management
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🧾</span>Rent Receipts
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">👫</span>Flatmate Search
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🏠</span>PG Accommodation
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">🏢</span>Full Flat Rentals
            </div>
          </div>
        </div>

        <div className="offer-track-wrap">
          <div className="offer-track r2">
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Bandra
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Andheri West
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Santacruz
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Malad
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Borivali
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Powai
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Thane
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Goregaon
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Mulund
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Kurla
            </div>
            <div className="offer-chip">
              <span className="offer-chip-icon">📍</span>Bandra
            </div>
          </div>
        </div>
      </section> 

      {/* HOW IT WORKS */}
      <section className="hiw-section" id="how-it-works">
        <div className="hiw-inner">

          <div className="max-w-[720px] mb-[64px]">

  <div className="inline-flex items-center gap-[6px] bg-[#eef3ff] border border-[#c7d9ff] rounded-full px-[14px] py-[5px] text-[11.5px] font-bold text-[#2664eb] mb-[14px]">
    ✦ How it works
  </div>

  <h2 className="text-[clamp(28px,3.4vw,44px)] font-black tracking-[-1.2px] text-[#0f172a] leading-[1.12] mb-[10px]">
    Find and move in — in minutes
  </h2>

  <p className="text-[15.5px] text-slate-600 leading-[1.68]">
    EaseMySpace makes renting simple. Create a verified profile,
    explore listings and book your space directly with zero brokerage.
  </p>

</div>

          <div className="hiw-grid">

            <div className="hiw-steps-list">

              <div className="hiw-step active flex gap-[20px] py-[28px]">

                <div className="hs-num text-[18px] font-black text-[#2664eb]">
                  1
                </div>

                <div className="hs-content">

                  <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#2664eb] mb-[4px]">
                    Step 01
                  </div>

                  <div className="text-[17px] font-extrabold text-slate-900 mb-[6px]">
                    Create your verified profile
                  </div>

                  <div className="text-[13.5px] text-slate-600 leading-[1.62]">
                    Sign up and complete KYC using DigiLocker in under 60 seconds.
                  </div>

                </div>

              </div>

              <div className="hiw-step flex gap-[20px] py-[28px]">

                <div className="hs-num text-[18px] font-black text-[#2664eb]">
                  2
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#2664eb] mb-[4px]">
                    Step 02
                  </div>

                  <div className="text-[17px] font-extrabold text-slate-900 mb-[6px]">
                    Search & discover listings
                  </div>

                  <div className="text-[13.5px] text-slate-600 leading-[1.62]">
                    Browse verified flatmate, PG and flat listings across Mumbai.
                  </div>
                </div>

              </div>

              <div className="hiw-step flex gap-[20px] py-[28px]">

                <div className="hs-num text-[18px] font-black text-[#2664eb]">
                  3
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#2664eb] mb-[4px]">
                    Step 03
                  </div>

                  <div className="text-[17px] font-extrabold text-slate-900 mb-[6px]">
                    Book directly — zero broker
                  </div>

                  <div className="text-[13.5px] text-slate-600 leading-[1.62]">
                    Connect with verified owners directly.
                  </div>
                </div>

              </div>

              <div className="hiw-step flex gap-[20px] py-[28px]">

                <div className="hs-num text-[18px] font-black text-[#2664eb]">
                  4
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#2664eb] mb-[4px]">
                    Step 04
                  </div>

                  <div className="text-[17px] font-extrabold text-slate-900 mb-[6px]">
                    Pay rent & manage digitally
                  </div>

                  <div className="text-[13.5px] text-slate-600 leading-[1.62]">
                    Sign agreements, pay rent and download receipts in-app.
                  </div>
                </div>

              </div>

            </div>

            <div className="hiw-phone-col">
              <div className="hiw-phone">
                <img
                  src={kycPage}
                  alt="KYC Verification Screen"
                  className="phone-screen-image"
                />
              </div>
            </div>

          </div>

        </div>
      </section>
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

  <div className="hero-phone">
            <img
              src={listingImg}
              alt="EaseMySpace App listing Screen"
              className="phone-screen-image"
            />
          </div>

  <div>
    <div className="inline-flex items-center gap-[6px] bg-[#eef3ff] border border-[#c7d9ff] rounded-full px-[14px] py-[5px] text-[11.5px] font-bold text-[#2664eb] mb-[14px]">
      ✦ For Renters
    </div>

    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
      Browse verified <br /> listings near you
    </h3>

    <p className="text-slate-600 mb-6">
      Every property on EaseMySpace is photo-verified.
    </p>

    <div className="flex flex-wrap gap-3">

      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        ✓ Photo Verified
      </span>

      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        ✓ No Brokerage
      </span>

      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        ✓ Direct Owner
      </span>

      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        ✓ KYC Verified Owners
      </span>

    </div>
  </div>

</div>

<div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

  <div>
    <div className="inline-flex items-center gap-[6px] bg-[#eef3ff] border border-[#c7d9ff] rounded-full px-[14px] py-[5px] text-[11.5px] font-bold text-[#2664eb] mb-[14px]">
      ✦ For Owners & Tenants
    </div>

    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
      Pay rent, sign agreements fully digital
    </h3>

    <p className="text-slate-600 mb-8">
      EaseMySpace replaces paper-based rental processes with a digital workflow.
    </p>

    <div className="space-y-6">

      <div className="flex items-start gap-4">
        <span className="text-2xl">💸</span>
        <div>
          <div className="font-semibold text-slate-900">
            Pay Rent In-App
          </div>
          <div className="text-slate-600 text-sm">
            Instant transfers
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="text-2xl">🧾</span>
        <div>
          <div className="font-semibold text-slate-900">
            Download Receipts
          </div>
          <div className="text-slate-600 text-sm">
            Digital receipts every month
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <span className="text-2xl">📄</span>
        <div>
          <div className="font-semibold text-slate-900">
            Create & Sign Agreements
          </div>
          <div className="text-slate-600 text-sm">
            Legally sound
          </div>
        </div>
      </div>

    </div>
  </div>

  <div className="flex justify-center">
     <div className="hero-phone">
            <img
              src={rentPayment}
              alt="EaseMySpace App rent & payment Screen"
              className="phone-screen-image"
            />
          </div>
  </div>

</div>

    </div>
  );
};

export default EaseMySpaceShowcase; 