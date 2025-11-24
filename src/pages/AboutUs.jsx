import React from "react";
import { Helmet } from "react-helmet";
import AboutUsHero from "../components/AboutUsSectionComp/AboutUsHero";
import AboutHighlights from "../components/AboutUsSectionComp/AboutHighlights";
import Footer from "../components/Footer";
import OurTeam from "../components/AboutUsSectionComp/OurTeam";
import AboutStory from "../components/AboutUsSectionComp/AboutStory";
import AboutNav from "../components/AboutUsSectionComp/AboutNav";
import MsgFromFounder from "../components/AboutUsSectionComp/MsgFromFounder";

function AboutUs() {
  const navItems = [
    { label: "Our Story", href: "#our-story", type: "anchor" },
    {
      label: "Founder’s Message",
      href: "#message-from-founder",
      type: "anchor",
    },
    { label: "Our Team", href: "#our-team", type: "anchor" },
    { label: "Life at EMS", href: "/life-at-ems", type: "link" },
    { label: "Careers", href: "/careers", type: "link" },
  ];

  return (
    <>
      <Helmet>
        {/* Page Title */}
        <title>About EaseMySpace | Our Story, Team & Careers</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Learn about EaseMySpace - India's leading platform to find verified flatmates, PGs, and vacant rooms. Meet our team, explore our story, and discover career opportunities."
        />

        {/* Meta Keywords */}
        <meta
          name="keywords"
          content="EaseMySpace, About Us, Our Story, Our Team, Careers, Verified Flatmates, PG in India, Vacant Rooms, Room Rentals, Shared Flats"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="About EaseMySpace | Meet Our Team & Explore Our Story"
        />
        <meta
          property="og:description"
          content="Discover the story behind EaseMySpace, meet our dedicated team, and explore career opportunities at India's top platform for verified flatmates and rental spaces."
        />
        <meta property="og:image" content="/about-us/hero.png" />
        <meta property="og:url" content="https://easemyspace.in/about-us" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About EaseMySpace | Our Story & Team"
        />
        <meta
          name="twitter:description"
          content="Get to know EaseMySpace: Our story, our team, and how we help you find verified flatmates, PGs, and vacant rooms across India."
        />
        <meta name="twitter:image" content="/about-us/hero.png" />
      </Helmet>

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        :target {
          scroll-margin-top: 7rem;
        }
      `}</style>

      <div className="bg-white dark:bg-zinc-900 min-h-screen text-gray-900 dark:text-gray-100">
        <AboutNav />

        {/* Mobile Scrollable Sub Navigation */}
        <div className="fixed top-[75px] left-0 w-full bg-white dark:bg-zinc-900 pt-2 shadow-md z-40 border-b md:hidden overflow-x-auto no-scrollbar">
          <div className="flex space-x-4 justify-start px-4 py-2">
            {navItems.map((item, idx) =>
              item.type === "anchor" ? (
                <a
                  key={idx}
                  href={item.href}
                  className="flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-blue-600 border"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-blue-600 border"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        <div className="pt-14 lg:pt-0">
          <AboutUsHero />

          <section id="our-story">
            <AboutStory />
          </section>

          <section id="message-from-founder">
            <MsgFromFounder />
          </section>

          <AboutHighlights />

          <section id="our-team">
            <OurTeam />
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default AboutUs;
