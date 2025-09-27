import React from "react";
import banner1Port from "/life_at_ems/heroImg/banner1-port.jpg";
import banner2Port from "/life_at_ems/heroImg/banner2-port.jpg";
import banner3 from "/life_at_ems/heroImg/banner3.jpg";
import banner4 from "/life_at_ems/heroImg/banner4.jpg";
import banner5 from "/life_at_ems/heroImg/banner5.jpg";
import banner6Port from "/life_at_ems/heroImg/banner6-port.jpg";

function LifeAtEMSHero() {
  // Array of all images with type
  const images = [
    { src: banner1Port, alt: "Team collaboration at EaseMySpace", type: "portrait" },
    { src: banner2Port, alt: "Work-life balance at EaseMySpace", type: "portrait" },
    { src: banner3, alt: "Innovative workspace at EaseMySpace", type: "landscape" },
    { src: banner4, alt: "Celebrations and culture at EaseMySpace", type: "landscape" },
    { src: banner5, alt: "Employee growth opportunities", type: "landscape" },
    { src: banner6Port, alt: "Team meetings at EaseMySpace", type: "portrait" },
  ];

  // Separate portrait and landscape
  const portraitImages = images.filter((img) => img.type === "portrait");
  const landscapeImages = images.filter((img) => img.type === "landscape");

  // Group landscape images into pairs (2 per row)
  const landscapePairs = [];
  for (let i = 0; i < landscapeImages.length; i += 2) {
    landscapePairs.push(landscapeImages.slice(i, i + 2));
  }

  return (
    <section className="w-full min-h-screen bg-blue-100 py-10">
      {/* SEO-friendly heading */}
      <h1
        style={{ fontFamily: "heading_font" }}
        className="w-full text-center text-4xl md:text-5xl font-bold pt-5 mb-10"
      >
        Working at EaseMySpace
      </h1>

      <div className="container mx-auto px-4 space-y-10">
        {/* Landscape images first */}
        {landscapePairs.map((pair, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-col md:flex-row gap-6"
          >
            {pair.map((img, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 flex items-center justify-center"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="rounded-xl shadow-lg object-cover w-full h-72 md:h-96"
                />
              </div>
            ))}
          </div>
        ))}

        {/* Portrait images at the end */}
        <div className="grid grid-cols-1 sm:grid-cols-3 ">
          {portraitImages.map((img, idx) => (
            <div key={idx} className="flex items-center justify-center">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="rounded-xl object-contain w-full h-[500px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LifeAtEMSHero;
