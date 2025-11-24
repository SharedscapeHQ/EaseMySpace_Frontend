import { FaBuilding, FaUsers, FaBed, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function BlogPage() {
  const categories = [
    {
      title: "Flatmates & Shared Rooms in Mumbai",
      description:
        "Find verified flatmates and shared rooms in Andheri, Goregaon, Powai, Chandivali, Dadar, and South Mumbai. Affordable 1BHK–2.5BHK shared apartments with male, female, and co-living options for students and professionals.",
      icon: <FaUsers className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=flatmate",
    },
    {
      title: "PGs in Mumbai",
      description:
        "Verified and affordable PGs across Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Male, female, and co-living PGs for students and working professionals.",
      icon: <FaBuilding className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=pg",
    },
    {
      title: "Vacant Flats & Rentals",
      description:
        "Explore rental flats (1BHK–2.5BHK) in top neighborhoods including Andheri, Goregaon, Powai, Chandivali, Thane, and South Mumbai. Budget-friendly rentals for students and professionals.",
      icon: <FaBed className="w-12 h-12 text-blue-500" />,
      url: "/view-properties?looking_for=vacant",
    },
  ];

  const featureIcons = [
    { icon: <FaBed />, text: "1BHK – 2.5BHK Flats" },
    { icon: <FaUsers />, text: "Flatmates & Co-living" },
    { icon: <FaRupeeSign />, text: "Affordable & Budget-Friendly" },
    { icon: <FaMapMarkerAlt />, text: "Andheri, Goregaon, Powai, Thane & more" },
  ];

  return (
    <>
      <Helmet>
        <title>Flatmates in Mumbai | PGs & Rental Flats | EaseMySpace</title>
        <meta
          name="description"
          content="Find flatmates in Mumbai – Andheri, Goregaon, Powai, Chandivali, Thane, Dadar & South Mumbai. Explore verified PGs, shared rooms & budget-friendly rental flats for students & working professionals."
        />
        <meta
          name="keywords"
          content="Flatmates Mumbai, PG Mumbai, shared rooms Mumbai, rental flats Mumbai, 1BHK Mumbai, 2BHK Mumbai, co-living Mumbai, affordable rooms Mumbai"
        />
        <link rel="canonical" href="https://easemyspace.in/blog" />
      </Helmet>

      <section className="max-w-7xl mx-auto px-4 lg:py-16 py-10">
        <header className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-800 mb-4"
            style={{ fontFamily: "heading_font" }}
          >
            Flatmates, PGs & Rentals in Mumbai
          </h1>
          <p
            className="text-zinc-600 max-w-3xl mx-auto text-base sm:text-lg"
            style={{ fontFamily: "para_font" }}
          >
            Discover verified flatmates, shared rooms, PGs, and rental flats in prime Mumbai locations like
            Andheri, Goregaon, Powai, Chandivali, Thane, Dadar, and South Mumbai. Affordable options for
            students and professionals seeking hassle-free co-living.
          </p>
        </header>

        {/* Features Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {featureIcons.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
            >
              <div className="text-blue-600 text-2xl">{feature.icon}</div>
              <span className="text-zinc-700 text-sm sm:text-base font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <article
              key={cat.title}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 overflow-hidden"
            >
              <Link to={cat.url} className="block h-full p-6">
                <div className="flex justify-center mb-5">{cat.icon}</div>
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-zinc-800 text-center">
                  {cat.title}
                </h2>
                <p className="text-zinc-600 text-sm sm:text-base mb-6 text-center">{cat.description}</p>
                <div className="flex justify-center">
                  <button className="bg-blue-600 text-white text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition">
                    Explore Now
                  </button>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
