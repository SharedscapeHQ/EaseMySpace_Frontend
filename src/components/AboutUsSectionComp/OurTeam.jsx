import React, { useEffect, useState } from "react";
import TeamCard from "./TeamCard";
import RakeshImg from "/TeamImg/Rakesh.png";
import YogitaImg from "/TeamImg/Yogita.png";
import TaniyaImg from "/TeamImg/Taniya.png";
import ArvindImg from "/TeamImg/Arvind.png";
import NikhilImg from "/TeamImg/Nikhil.png";
import { motion } from "framer-motion"; 

const teamMembers = [
  {
    name: "Rakesh Goswami",
    role: "Founder & CEO",
    description:
      "Chartered Accountant and entrepreneur, Rakesh founded EaseMySpace™ in 2025 to make finding flats and flatmates in Mumbai simple, safe, and stress-free. He's passionate about creating smarter solutions for urban living.",
    imageSrc: RakeshImg,
    linkedin: "https://www.linkedin.com/in/rakeshgoswami09/",
    email: "rakeshgoswami@easemyspace.in",
  },
  {
    name: "Yogita Rathi",
    role: "Social Media",
    description:
      "Manages partnerships and drives social media engagement to build strong community connections and brand presence. Passionate about creating meaningful conversations and expanding our reach.",
    imageSrc: YogitaImg,
    linkedin: "https://www.linkedin.com/in/yogita-rathi-78190a1ba/",
    email: "yogita.rathi@easemyspace.in",
  },
  {
    name: "Taniya Sarkar",
    role: "Business Data Analytics",
    description:
      "Prepares and analyzes business data to deliver actionable insights. Helps steer strategic decisions with data-driven clarity and precision. Passionate about turning numbers into growth opportunities.",
    imageSrc: TaniyaImg,
    linkedin: "https://www.linkedin.com/in/taniya-sarkar-8ab4b532a/",
    email: "taniya.sarkar@easemyspace.in",
  },
  {
    name: "Arvind Vishwakarma",
    role: "UI/UX & Full Stack Developer",
    description:
      "A skilled full stack developer and UI/UX designer, managing all technical aspects to create seamless and engaging user experiences at EaseMySpace™.",
    imageSrc: ArvindImg,
    linkedin: "https://www.linkedin.com/in/arvind-vishwakarma-067209212?",
    email: "arvind.vishwakrma@easemyspace.in",
  },
  {
  name: "Nikhil Hiranandani",
  role: "Business Consultant",
  description:
    "A strategic business consultant, providing expert advice and actionable insights to drive growth, optimize operations, and enhance overall business performance at EaseMySpace™.",
  imageSrc: NikhilImg,
  linkedin: "https://www.linkedin.com/in/nikhil-hiranandani/",
  email: "nikhil.hiranandani@easemyspace.in",
},

];

export default function OurTeam() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
   <section
  style={{ fontFamily: "para_font" }}
  className="py-5 lg:px-10 pb-24 px-3 max-w-7xl mx-auto"
  itemScope
  itemType="https://schema.org/Organization"
>
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="w-full mb-6"
  >
    <h2
      style={{ fontFamily: "heading_font" }}
      className="text-lg lg:text-3xl mb-0 dark:text-white text-black leading-tight"
      itemProp="employee"
    >
      Meet our Team
    </h2>
    <p
      className="font-bold mb-4 heading-font text-gray-500 dark:text-zinc-400 tracking-wider text-shadow"
      itemProp="description"
    >
      Passionate. Proactive. Expert. 
    </p>
  </motion.div>

  <div className="flex flex-wrap justify-center lg:justify-center items-center gap-4">
    {teamMembers.map((member, index) => (
      <article
        key={index}
        itemScope
        itemType="https://schema.org/Person"
        className="team-card"
      >
        <TeamCard
          name={member.name}
          role={member.role}
          description={member.description}
          imageSrc={member.imageSrc}
          linkedin={member.linkedin}
          email={member.email}
        />
        <meta itemProp="name" content={member.name} />
        <meta itemProp="jobTitle" content={member.role} />
        <meta itemProp="description" content={member.description} />
        <meta itemProp="image" content={member.imageSrc} />
        {member.linkedin && <meta itemProp="sameAs" content={member.linkedin} />}
        {member.email && <meta itemProp="email" content={member.email} />}
      </article>
    ))}
  </div>
</section>

  );
}
