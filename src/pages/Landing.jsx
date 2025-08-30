import FAQSection from "../components/LandingSectionComp/FAQSection";
import FeatureSection from "../components/LandingSectionComp/Features";
import Footer from "../components/Footer";
import HeroSection from "../components/LandingSectionComp/Hero";
// import TestimonialSection from '../components/LandingSectionComp/TestimonialSection'
import NewlyListedProperties from "../components/LandingSectionComp/NewlyListedProperties";
import RecentAddedProperties from "../components/LandingSectionComp/RecentAddedProperties";
import TopLocation from "../components/LandingSectionComp/TopLocation";
import OurQuality from "../components/LandingSectionComp/OurQuality";
import HeroMobile from "../components/LandingSectionComp/HeroMobile";
import HeroDesktop from "../components/LandingSectionComp/HeroDesktop";
import Banner from "../components/LandingSectionComp/Banner";
import ExploreSection from "../components/LandingSectionComp/ExploreSection";
import BottomNav from "../components/LandingSectionComp/BottomNav";
// import NearbyProperties from '../components/LandingSectionComp/NearbyProperties'

function Landing() {
  return (
    <>
      <div className="w-full -pt-10 lg:pb-0 pb-9">
        {/* <HeroSection/> */}
        <HeroMobile />
        <HeroDesktop />
        <NewlyListedProperties />
        {/* <NearbyProperties/> */}
        <RecentAddedProperties />

        <Banner />

        <OurQuality />
        <TopLocation />
        {/* <Marquee/> */}
        <FeatureSection />
        <ExploreSection />
        {/* <MatchSection/> */}
        {/* <KnowTheVibe/> */}
        {/* <Card/> */}
        <FAQSection />
        <BottomNav />
        <Footer />
      </div>
    </>
  );
}

export default Landing;
