import { useFormattedLocation } from "../../../Helper/useFormattedLocation";

export default function PropertyMap({ location, pincode, title }) {
  const { displayLocation, loading } =
    location && pincode
      ? useFormattedLocation(location, pincode)
      : { displayLocation: location || "", loading: false };

  const mapAddress =
    loading
      ? location || pincode || ""
      : displayLocation || location || pincode || "";

  return (
    <section className="w-full">
      <div className="border rounded-xl lg:p-6 p-2 shadow-md bg-white">
        <h2 style={{ fontFamily: "para_font" }} className="flex items-center text-[16px] lg:text-xl mb-3">
          <span style={{ fontFamily: "universal_font" }}>Location</span>
          <span
            style={{ fontFamily: "universal_font" }}
            className="text-xs lg:text-sm text-gray-600 ml-2 truncate"
          >
            {loading ? "Loading..." : mapAddress}
          </span>
        </h2>

        <div className="w-full h-[250px] sm:h-[400px] md:h-[400px] rounded-lg overflow-hidden">
          <iframe
            title={`Map - ${title || "Property"}`}
            className="w-full h-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              mapAddress
            )}&output=embed`}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
