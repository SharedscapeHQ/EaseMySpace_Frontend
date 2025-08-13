import React from 'react'
import AboutUsHero from '../components/AboutUsSectionComp/AboutUsHero'
import AboutHighlights from '../components/AboutUsSectionComp/AboutHighlights'
import Footer from '../components/Footer'
import OurTeam from '../components/AboutUsSectionComp/OurTeam'
import AboutStory from '../components/AboutUsSectionComp/AboutStory'
import AboutNav from '../components/AboutUsSectionComp/AboutNav'

function AboutUs() {
  const navItems = [
    { label: 'Our Story', href: '#our-story', type: 'anchor' },
    { label: 'Our Team', href: '#our-team', type: 'anchor' },
    { label: 'Careers', href: '/careers', type: 'link' },
  ]

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth; /* smooth scroll for anchors */
        }
        :target {
          scroll-margin-top: 7rem;
        }
      `}</style>

      <AboutNav />

      {/* Mobile Scrollable Sub Navigation */}
      <div className="fixed top-[75px] left-0 w-full bg-white pt-2 shadow-md z-40 border-b md:hidden overflow-x-auto no-scrollbar">
        <div className="flex space-x-4 justify-center px-4 py-2">
          {navItems.map((item, idx) => (
            item.type === 'anchor' ? (
              <a
                key={idx}
                href={item.href}
                className="flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 border"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={idx}
                href={item.href}
                className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 border"
              >
                {item.label}
              </a>
            )
          ))}
        </div>
      </div>

      <div className="pt-28 md:pt-16">
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
