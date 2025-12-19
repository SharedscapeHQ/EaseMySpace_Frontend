import React from "react";
import { Helmet } from "react-helmet";
import FAQSection from "../components/LandingSectionComp/FAQSection";
import Footer from "../components/Footer";
import HeroMobile from "../components/LandingSectionComp/HeroMobile";
import HeroDesktop from "../components/LandingSectionComp/HeroDesktop";
import NewlyListedProperties from "../components/LandingSectionComp/NewlyListedProperties";
import RecentAddedProperties from "../components/LandingSectionComp/RecentAddedProperties";
import Banner from "../components/LandingSectionComp/Banner";
import BottomNav from "../components/LandingSectionComp/BottomNav";
import TestimonialSection from "../components/LandingSectionComp/TestimonialSection";
import LandingPopup from "../components/LandingSectionComp/LandingPopup";
import AndheriProperties from "../components/LandingSectionComp/AndheriProperties";
import RecentlyViewedProperties from "../components/LandingSectionComp/RecentlyViewedProperties";

function Landing() {
  return (
    <>
      <Helmet>
  {/* Favicon */}
  <link
    rel="icon"
    type="image/png"
    sizes="64x64"
    href="https://easemyspace.in/navbar-assets/brand_favicon_new.png?v=2"
  />

  {/* Main Page Title */}
  <title>PGs, Flatmates & Vacant Flats in Mumbai | EaseMySpace™</title>

  {/* Meta Description */}
  <meta
    name="description"
    content="Find PGs, shared flats, and vacant flats in Mumbai easily. Explore properties in Andheri, Bandra, Juhu, Andheri West, and other areas. Connect with verified flatmates and list properties hassle-free with EaseMySpace™."
  />

  {/* Meta Keywords */}
  <meta
    name="keywords"
    content="PG in Mumbai, flatmate in Mumbai, flat for rent Mumbai, paying guest Mumbai, shared flats Mumbai, vacant flats Mumbai, rooms for rent Andheri, flats in Bandra, list property Mumbai"
  />

  {/* Open Graph / Social Sharing */}
  <meta property="og:title" content="Find Your Next Home in Mumbai | EaseMySpace" />
  <meta
    property="og:description"
    content="Search PGs, flatmates, and vacant flats in Mumbai easily. Explore properties in Andheri, Bandra, Juhu and more with EaseMySpace™."
  />
  <meta property="og:image" content="https://easemyspace.in/heroImg/hero.png" />
  <meta property="og:url" content="https://easemyspace.in" />
  <meta property="og:type" content="website" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Find PGs, Flatmates & Vacant Flats in Mumbai | EaseMySpace™"
  />
  <meta
    name="twitter:description"
    content="Search PGs, flatmates, and vacant flats in Mumbai easily. Explore properties in Andheri, Bandra, Juhu and more with EaseMySpace™."
  />
  <meta name="twitter:image" content="https://easemyspace.in/heroImg/hero.png" />
</Helmet>

 <LandingPopup />
      <div className="w-full -pt-10 lg:pb-0 pb-9 dark:bg-zinc-900">
        <HeroMobile />
        <HeroDesktop />
        <RecentlyViewedProperties/>
        <NewlyListedProperties />
        <RecentAddedProperties />
        <AndheriProperties/>
        <Banner />
        <FAQSection />
        <TestimonialSection/>
        <BottomNav />
        <Footer />
      </div>
    </>
  );
}

export default Landing;
