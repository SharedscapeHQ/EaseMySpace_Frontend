
export default function PropertyDescription({ property }) {

  return (
    <div className="mt-5 space-y-5">
      {/* Property Description */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
        <h2
          style={{ fontFamily: "para_font" }}
          className="text-[16px] lg:text-xl text-left text-black mb-3"
        >
          Property Description
        </h2>
        <p className="text-gray-700 text-sm lg:text-md leading-relaxed whitespace-pre-line">
          {property.description || "No description available."}
        </p>
      </div>
    </div>
  );
}