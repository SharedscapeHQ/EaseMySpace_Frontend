import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import arvind_vishwakarma from "/testimonial/arvind_vishwakarma.png";
import aditya_borse from "/testimonial/aditya_borse.png";
import navin_patil from "/testimonial/navin_patil.png";

const getRandomBg = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const initialTestimonials = [
  {
    img: aditya_borse,
    name: "Aditya Borse",
    review:
      "I had an excellent experience with Mumbai Paying Guest. The rooms were clean and well-maintained, providing a great stay for me. Additionally, the accommodations were budget-friendly, making it a great choice for those looking for affordable lodging. Overall, I was very satisfied with my stay at Mumbai Paying Guest.",
    rating: 5,
  },
  {
    img: navin_patil,
    name: "Naveen Patil",
    review:
      "Really User friendly Website, Great Service by the Team, Hoping to keep the rappo same In future. Thank you for Your Kind Support When Needed the Most 😊",
    rating: 5,
  },
  {
    img: null,
    name: "Jayant Bhatter",
    review:
      "Great service!! Loved the team members who helped me to find my match!",
    rating: 5,
  },
  {
    img: arvind_vishwakarma,
    name: "Arvind Vishwakarma",
    review:
      "As a Full Stack Developer at EaseMySpace, I really enjoy being part of a team that's passionate about creating seamless solutions and helping people find their perfect space. Highly recommend checking us out!",
    rating: 5,
  },
  {
    img: null,
    name: "Rajshree Bihani",
    review: "Great flat options available, really like it!",
    rating: 5,
  },
  {
    img: null,
    name: "Vikas Lahoti",
    review: "Amazing assistance!",
    rating: 5,
  },
  {
    img: null,
    name: "Hitesh Kukreja",
    review:
      "Great and genuine website to help in finding shared flats for living. Much helpful",
    rating: 5,
  },
];

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TestimonialSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [paused, setPaused] = useState(false); 
  const carouselRef = useRef(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();
    const speed = 40; 

    const smoothScroll = (time) => {
      if (!paused && carouselRef.current) { 
        const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        const distance = speed * deltaTime;
        carouselRef.current.scrollLeft += distance;

        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          setTestimonials((prev) => shuffleArray(prev));
          carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
        }
      }
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full py-10 bg-white"
      aria-label="Customer testimonials"
    >
      <div className="max-w-7xl mx-auto px-3 lg:px-10 relative">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-xl sm:text-3xl mb-8 font-bold text-left"
        >
          Goolge Reviews of our customers
        </h2>

       
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide"
          onMouseEnter={() => setPaused(true)}   
          onMouseLeave={() => setPaused(false)}  
        >
          {testimonials.map((testimonial, index) => {
            const isExpanded = expandedIndex === index;
            const shouldTruncate = testimonial.review.length > 150;
            const reviewText =
              isExpanded || !shouldTruncate
                ? testimonial.review
                : testimonial.review.slice(0, 150) + "...";

            return (
              <article
                key={index}
                className="flex-shrink-0 w-80 border-zinc-200 border my-2 bg-blue-100 dark:bg-neutral-900 p-6 rounded-md shadow-md cursor-pointer transition-all duration-500"
              >
                {testimonial.img ? (
                  <img
                    src={testimonial.img}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mb-3 mx-auto"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3 mx-auto ${getRandomBg()}`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                <h3 className="font-bold text-lg text-zinc-900 mb-2 text-center">
                  {testimonial.name}
                </h3>

                <div className="flex justify-center mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-yellow-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-center text-zinc-800 leading-relaxed">
                  {reviewText}{" "}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-blue-600 hover:underline ml-1"
                      aria-label="Read more"
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
