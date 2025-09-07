import React, { useState, useRef } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import test1 from "/testimonial/test.png";

const testimonials = [
  {
    img: test1,
    name: "Arvind Vishwakarma",
    review:
      "As a Full Stack Developer at EaseMySpace, I really enjoy being part of a team that’s passionate about creating seamless solutions and helping people find their perfect space. Highly recommend checking us out!",
    rating: 5,
  },
  {
    img: test1,
    name: "Jayant Bhatter",
    review:
      "Great service!! Loved the team members who helped me to find my match!",
    rating: 5,
  },
  {
    img: test1,
    name: "Rajshree Bihani",
    review: "Great flat options available, really like it!",
    rating: 5,
  },
  {
    img: test1,
    name: "Vikas Lahoti",
    review: "Amazing assistance!",
    rating: 5,
  },
  {
    img: test1,
    name: "Naveen Patil",
    review:
      "Really User friendly Website, Great Service by the Team, Hoping to keep the rappo same In future. Thank you for Your Kind Support When Needed the Most 😊",
    rating: 5,
  },
  {
    img: test1,
    name: "Hitesh Kukreja",
    review:
      "Great and genuine website to help in finding shared flats for living. Much helpful",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const carouselRef = useRef(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320; // card width + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      style={{ fontFamily: "para_font" }}
      className="w-full py-10 bg-white"
      aria-label="Customer testimonials"
    >
      <div className="max-w-7xl mx-auto px-3 lg:px-10 relative">
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-2xl sm:text-3xl mb-8 font-bold text-left"
        >
          Hear From Our Happy Clients
        </h2>

        {/* Left & Right Arrows */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-2 rounded-full shadow-md z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 p-2 rounded-full shadow-md z-10"
        >
          <FaChevronRight />
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
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
                className="flex-shrink-0 w-80 bg-white dark:bg-neutral-900 p-6 rounded-md shadow-md cursor-pointer transition-all duration-500"
              >
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mb-3 mx-auto"
                />

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
