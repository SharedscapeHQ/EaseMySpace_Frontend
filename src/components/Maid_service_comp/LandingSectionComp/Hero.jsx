import hero_img from "/Maid_service/Landing_assets/hero_img.gif"


export default function Hero() {
  return (
    <section className="bg-white py-16 px-6 h-screen">
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 style={{ fontFamily: "para_font" }} className="text-4xl sm:text-5xl font-extrabold text-pink-700 leading-tight mb-4">
            Reliable Maid & Cook Services in Mumbai
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">
            Hire background-verified maids and skilled cooks for daily, part-time,
            or full-time needs. Affordable, safe, and hassle-free household help – 
            available across Mumbai.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
            <span className="bg-white border border-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm shadow-sm">
              ✅ 100% Verified Staff
            </span>
            <span className="bg-white border border-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm shadow-sm">
              🏠 Daily / Full-time / Part-time
            </span>
            <span className="bg-white border border-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm shadow-sm">
              📍 Available Across Mumbai
            </span>
          </div>

          {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
  {/* Maid Service */}
  <a
    href="/booking/maid"
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-600 bg-pink-600 px-8 py-3 text-white font-medium transition-colors duration-300"
  >
    <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-600">
      Maid Service
    </span>
    <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
  </a>

  {/* Cook Service */}
  <a
    href="/booking/cook"
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-600 bg-white px-8 py-3 text-pink-600 font-medium transition-colors duration-300"
  >
    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
      Cook Service
    </span>
    <span className="absolute left-0 top-0 h-full w-0 bg-pink-600 transition-all duration-300 ease-out group-hover:w-full" />
  </a>

  {/* Maid + Cook Combo */}
  <a
    href="/booking/maid-cook"
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-600 bg-pink-600 px-8 py-3 text-white font-medium transition-colors duration-300"
  >
    <span className="relative z-10 transition-colors duration-300 group-hover:text-pink-600">
      Maid + Cook
    </span>
    <span className="absolute left-0 top-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
  </a>
</div>


        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={hero_img}
            alt="Maid and Cook Service Mumbai"
            className="max-w-4xl w-full"
          />
        </div>
      </div>
    </section>
  );
}
