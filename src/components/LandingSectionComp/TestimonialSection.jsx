import React from "react";
import { FaStar } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import arvind_vishwakarma from "/testimonial/arvind_vishwakarma.png";
import aditya_borse from "/testimonial/aditya_borse.png";
import navin_patil from "/testimonial/navin_patil.png";

const testimonials = [
  {
    img: aditya_borse,
    name: "Aditya Borse",
    review:
      "I had an excellent experience with Mumbai Paying Guest. The rooms were clean and well-maintained, providing a great stay for me.",
  },
  {
    img: navin_patil,
    name: "Naveen Patil",
    review:
      "Really user friendly website. Great service by the team. Thank you for your support when needed the most.",
  },
  {
    img: null,
    name: "Jayant Bhatter",
    review:
      "Great service! Loved the team members who helped me find my match.",
  },
  {
    img: arvind_vishwakarma,
    name: "Arvind Vishwakarma",
    review:
      "As a Full Stack Developer at EaseMySpace™, I enjoy being part of a team building seamless housing solutions.",
  },
  {
    img: null,
    name: "Rajshree Bihani",
    review: "Great flat options available, really like it!",
  },
  {
    img: null,
    name: "Vikas Lahoti",
    review: "Amazing assistance!",
  },
];

function Avatar({ img, name }) {
  if (img)
    return (
      <img
        src={img}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    );

  return (
    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
      {name.charAt(0)}
    </div>
  );
}

export default function TestimonialSection() {
  const duplicated = [...testimonials, ...testimonials];

  function Card(t, i) {
    return (
      <div
        key={i}
        className="w-[350px] flex-shrink-0 bg-slate-50 border border-blue-200 rounded-2xl p-7"
      >
        <div className="flex gap-1 text-orange-400 mb-4">
          {Array.from({ length: 5 }).map(function (_, i) {
            return <FaStar key={i} />;
          })}
        </div>

        <FaQuoteLeft className="text-blue-400 mb-3" />

        <p className="text-gray-600 italic text-sm leading-relaxed mb-6">
          {t.review}
        </p>

      <div className="flex flex-col text-sm gap-1">
  <Avatar img={t.img} name={t.name} />
  <div>
    <div className="font-semibold text-gray-900">{t.name}</div>
    <div className="text-gray-500">{t.location}</div>
  </div>
</div>
      </div>
    );
  }

  return (
    <section
      style={{ fontFamily: "universal_font" }}
      className="w-full py-10 bg-white dark:bg-zinc-900 dark:text-white overflow-hidden"
    >
      {/* Heading */}
      <div className="max-w-7xl lg:px-10 px-3 mx-auto">
         <h2
          style={{ fontFamily: "para_font" }}
          className="text-lg sm:text-3xl mb-10 text-left"
        >
          Google Reviews of our customers
        </h2>
        {/* CLOUD MASK WRAPPER */}
       <div
  className="overflow-hidden group"
  style={{
    WebkitMaskImage:
      "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
    maskImage:
      "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
  }}
>
  <div className="flex flex-col gap-6">
    {/* Row 1 */}
    <div className="flex gap-6 w-max animate-scroll group-hover:pause">
      {duplicated.map((t, i) => Card(t, i))}
    </div>

    {/* Row 2 */}
    <div className="flex gap-6 w-max animate-scroll-reverse mt-6 group-hover:pause">
      {duplicated.map((t, i) => Card(t, i))}
    </div>
  </div>
</div>
      </div>
    </section>
  );
}