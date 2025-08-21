import FAQSection from '../components/LandingSectionComp/FAQSection'
import FeatureSection from '../components/LandingSectionComp/Features'
import Footer from '../components/Footer'
import HeroSection from '../components/LandingSectionComp/Hero'
// import TestimonialSection from '../components/LandingSectionComp/TestimonialSection'
import NewlyListedProperties from '../components/LandingSectionComp/NewlyListedProperties'
import RecentAddedProperties from '../components/LandingSectionComp/RecentAddedProperties'
import TopLocation from '../components/LandingSectionComp/TopLocation'
import OurQuality from '../components/LandingSectionComp/OurQuality'
import HeroMobile from '../components/LandingSectionComp/HeroMobile'
import HeroDesktop from '../components/LandingSectionComp/HeroDesktop'
import NearbyProperties from '../components/LandingSectionComp/NearbyProperties'


function Landing() {
  return (
    <>
    <div className='w-full -pt-10'>
      {/* <HeroSection/> */}
      <HeroMobile />
      <HeroDesktop />
      <NewlyListedProperties/>
      {/* <NearbyProperties/> */}
      <RecentAddedProperties/>
      {/* <TopLocation/> */}

    {/* <div className=" hidden bg-zinc-50 pb-5  gap-y-4 px-3 lg:px-20">
  {[
    { icon: "✅", text: "Verified Listings" },
    { icon: "💸", text: "Rent Smart" },
    { icon: "📍", text: "Top Mumbai Locations" },
    { icon: "🔒", text: "100% Secure Matches" },
  ].map((b) => (
    <div
      key={b.text}
      className="w-[48%] lg:w-auto bg-white border text-gray-700 font-semibold shadow-md px-4 py-3 
                 rounded-full flex items-center gap-2 text-sm 
                 hover:scale-105 transition justify-center"
    >
      <span className="text-xl">{b.icon}</span>
      {b.text}
    </div>
  ))}
</div> */}



<OurQuality/>
      <FeatureSection/>
      <FAQSection/>
      <Footer/>
    </div>
    </>
  )
}``

export default Landing
