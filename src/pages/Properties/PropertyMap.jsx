export default function PropertyMap({ address }) {
  return (
    <section className="w-full">
      <div className="border rounded-xl lg:p-6 p-2 shadow-md bg-white">
        <h2 style={{ fontFamily: "heading_font" }} className="text-[16px] lg:text-xl mb-3">
          Location
        </h2>
        <div className="w-full h-[250px] sm:h-[400px] md:h-[400px] rounded-lg overflow-hidden">
          <iframe
            title="Google Map"
            className="w-full h-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              address
            )}&output=embed`}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
