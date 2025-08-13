import React from 'react'
import AboutUsHero from '../components/AboutUsSectionComp/AboutUsHero'
import AboutHighlights from '../components/AboutUsSectionComp/AboutHighlights'
import Footer from '../components/Footer'
import OurTeam from '../components/AboutUsSectionComp/OurTeam'
import AboutStory from '../components/AboutUsSectionComp/AboutStory'
import AboutNav from '../components/AboutUsSectionComp/AboutNav'

function AboutUs() {
  return (
    <>
    
      <style>{`
        :target {
          scroll-margin-top: 7rem; 
        }
      `}</style>

      <AboutNav />
      <div className='pt-16'>
        <AboutUsHero />

        <section id="our-story">
          <AboutStory />
        </section>

        <AboutHighlights />

        <section id="our-team">
          <OurTeam />
        </section>

        <Footer />
      </div>
    </>
  )
}

export default AboutUs
