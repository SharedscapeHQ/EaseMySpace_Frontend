import React from 'react'
import AboutUsHero from '../components/AboutUsSectionComp/AboutUsHero'
import AboutHighlights from '../components/AboutUsSectionComp/AboutHighlights'
import Footer from '../components/Footer'
import OurTeam from '../components/AboutUsSectionComp/OurTeam'
import AboutStory from '../components/AboutUsSectionComp/AboutStory'

function AboutUs() {
  return (
    <>
    <AboutUsHero/>
    <AboutStory/>
    <AboutHighlights/>
    <OurTeam/>
    <Footer/>
    </>
  )
}

export default AboutUs