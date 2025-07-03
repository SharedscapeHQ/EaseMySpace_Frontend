import React from "react";
import { FaStar } from "react-icons/fa";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "John Doe",
      title: "Real Estate Agent",
      review:
        "EaseMySpace made it so easy for me to find the perfect rental space for my clients. The platform is intuitive, and the listings are always top-notch. Highly recommend!",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Sarah Smith",
      title: "Business Owner",
      review:
        "As a business owner, finding office space has always been a challenge. EaseMySpace simplified the entire process. The customer service was fantastic, and I found the perfect place.",
      rating: 4,
      img: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Mark Johnson",
      title: "Freelancer",
      review:
        "I was able to find a cozy space for my freelance work in just a few clicks. The platform is user-friendly and offers detailed information. The whole experience was stress-free.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Hear From Our Happy Clients
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Real feedback from real users who found their perfect spaces through EaseMySpace.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-center items-stretch">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
          >
            {/* User Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-indigo-100">
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Title */}
            <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{testimonial.title}</p>

            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Review */}
            <p className="text-sm text-gray-600 italic leading-relaxed">
              “{testimonial.review}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
