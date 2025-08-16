import React from 'react';
import qualityImg1 from '/quality-assets/qtest1.png';
import qualityImg2 from '/quality-assets/qtest2.png';
import qualityImg3 from '/quality-assets/qtest3.png';
import qualityImg4 from '/quality-assets/qtest4.png';

function OurQuality() {
  const features = [
    {
      title: 'Break the clutter, find your flatmate',
      description: 'Skip the fake profiles. EMS connects you instantly with verified flatmate options on WhatsApp so you can match faster, stress-free.',
      image: qualityImg1,
    },
    {
      title: 'More matches, less effort',
      description: 'Create your profile once and let EMS bring you the best flatmate or room options — all in one place, without the endless searching.',
      image: qualityImg2,
    },
    {
      title: 'Chat smart, move in faster',
      description: 'Talk directly to verified matches, filter out irrelevant chats, and save time. Only serious seekers and listers, no time-wasters.',
      image: qualityImg3,
    },
    {
      title: 'One platform, all your matches',
      description: 'Get flatmate and room leads from every source in one place. With EMS, you can find, chat, and close deals without juggling multiple platforms.',
      image: qualityImg4,
    },
  ];

  return (
    <section style={{ fontFamily: 'para_font' }} className="w-full py-12 ">
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
              <div className="w-full h-[260px] flex items-center justify-center">
                {feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="max-h-full "
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
