import CallToAction from '../components/LandingSectionComp/CallToAction'
import FAQSection from '../components/LandingSectionComp/FAQSection'
import FeatureSection from '../components/LandingSectionComp/Features'
import Footer from '../components/Footer'
import HeroSection from '../components/LandingSectionComp/Hero'
import HowItWorksPage from '../components/LandingSectionComp/HowItWorksPage'
import TestimonialSection from '../components/LandingSectionComp/TestimonialSection'
import NewlyListedProperties from '../components/LandingSectionComp/NewlyListedProperties'


function Landing() {
  return (
    <>
    <div className='w-full h-screen'>
      <HeroSection/>
      <NewlyListedProperties/>
      <FeatureSection/>
      <HowItWorksPage/>
      {/* <TestimonialSection/> */}
      <CallToAction/>
      <FAQSection/>
      <Footer/>
    </div>
    </>
  )
}``

export default Landing
