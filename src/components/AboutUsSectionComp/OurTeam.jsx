import React from "react";
import TeamCard from "./TeamCard";
import RakeshImg from "/TeamImg/Rakesh.jpeg"
import YogitaImg from "/TeamImg/Yogita.jpeg"
import TaniyaImg from "/TeamImg/Taniya.jpeg"

const teamMembers = [
  {
    name: "Rakesh Goswami",
    role: "Founder & CEO",
    description:
      "Chartered Accountant and entrepreneur, Rakesh founded EaseMySpace in 2025 to make finding flats and flatmates in Mumbai simple, safe, and stress-free.He's passionate about creating smarter solutions for urban living.",
    imageSrc: RakeshImg,  
    linkedin: "https://www.linkedin.com/in/rakeshgoswami09/"
  },
  {
    name: "Yogita Rathi",
    role: "Social Media",
    description: "Manages partnerships and drives social media engagement to build strong community connections and brand presence. Passionate about creating meaningful conversations and expanding our reach.",
    imageSrc: YogitaImg,  
    linkedin: "https://www.linkedin.com/in/yogita-rathi-78190a1ba/"
  },
  {
    name: "Taniya Sarkar",
    role: "Business Data Analytics",
    description: "Prepares and analyzes business data to deliver actionable insights. Helps steer strategic decisions with data-driven clarity and precision. Passionate about turning numbers into growth opportunities.",
    imageSrc: TaniyaImg,  
    linkedin: "https://www.linkedin.com/in/taniya-sarkar-8ab4b532a/"
  },
  {
    name: "Arvind Vishwakarma",
    role: "UI/UX & Full Stack Developer",
    description:"A skilled full stack developer and UI/UX designer, managing all technical aspects to create seamless and engaging user experiences at EaseMySpace.",
    imageSrc: "https://your-image-source.com/isha.jpg", 
    linkedin: "https://www.linkedin.com/in/arvind-vishwakarma-067209212?"
  },
];

export default function OurTeam() {
  return (
    <section className="py-5  px-2">
      <h2 className="md:text-5xl text-3xl font-bold text-center text-blue-700 mb-12">Meet Our Team</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, index) => (
          <TeamCard
            key={index}
            name={member.name}
            role={member.role}
            description={member.description}
            imageSrc={member.imageSrc}   // Pass imageSrc here
            linkedin={member.linkedin}
          />
        ))}
      </div>
    </section>
  );
}
