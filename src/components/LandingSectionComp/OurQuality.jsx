import React from 'react';
import qualityImg1 from '/quality-assets/quality1.png';
import qualityImg2 from '/quality-assets/quality2.png';
import qualityImg3 from '/quality-assets/quality3.png';
import qualityImg4 from '/quality-assets/quality4.png';

function OurQuality() {
  const features = [
    {
      title: 'Break the clutter, find real matches',
      description: 'No more fake leads or spam. EMS connects you with real, verified users on WhatsApp fast and easy.',
      image: qualityImg1,
    },
    {
      title: 'Grow your chances, not your efforts',
      description: 'One profile, more matches. EMS helps you connect faster and manage everything from one place.',
      image: qualityImg2,
    },
    {
      title: 'Smart conversations, zero confusion',
      description: 'Chat directly, filter replies, and skip the back-and-forth. Only talk to serious matches.',
      image: qualityImg3,
    },
    {
      title: 'One platform, all sources',
      description: 'EMS brings Insta, WhatsApp, and more into one simple flow no switching apps.',
      image: qualityImg4,
    },
  ];

  return (
    <section style={{ fontFamily: 'para_font' }} className="w-full py-12  bg-zinc-50">
      <div className="max-w-7xl lg:px-10 px-3 mx-auto ">
        {/* Heading */}
        <h2
          style={{ fontFamily: "heading_font" }}
          className="text-lg sm:text-3xl text-left"
        >
         Choose the EMS advantage
        </h2>
        <p className='text-xs lg:text-base mb-5'>Use EMS to connect instantly on WhatsApp - Find flatmates faster, rent vacant rooms</p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-left space-y-4">
              {/* Image */}
              <div className="w-full h-[180px] flex items-center justify-center">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="max-h-full max-w-full rounded-xl object-contain  "
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="px-2 w-full">
                <h3 className="font-bold text-zinc-900 text-base sm:text-lg lg:min-h-[60px]">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-800 lg:leading-relaxed leading-none mt-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurQuality;
