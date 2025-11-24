

function PropertySkeleton() {
  return (
    <main className="w-full min-h-screen bg-[#f2f2f2] py-5 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col bg-white p-5 rounded-2xl gap-4 max-w-6xl mx-auto animate-pulse">
        {/* Title & Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-6 w-40 bg-gray-300 rounded" />
          <div className="h-5 w-20 bg-green-300 rounded" />
          <div className="h-5 w-16 bg-gray-300 rounded" />
        </div>

        {/* Images */}
        <div className="flex flex-col lg:flex-row justify-center items-start gap-5 w-full">
          <div className="w-full lg:w-[32rem] h-80 sm:h-[26rem] bg-gray-300 rounded-2xl" />
          <div className="flex flex-col gap-5 w-full lg:w-[16rem]">
            <div className="h-40 sm:h-48 bg-gray-300 rounded-2xl" />
            <div className="h-40 sm:h-48 bg-gray-300 rounded-2xl" />
          </div>
          <div className="flex flex-col gap-5 w-full lg:w-[24rem]">
            <div className="h-48 bg-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-3">
              <div className="h-5 w-32 bg-gray-300 rounded" />
              <div className="h-5 w-24 bg-gray-300 rounded" />
              <div className="h-10 bg-indigo-300 rounded" />
            </div>
            <div className="h-24 bg-gray-200 rounded-2xl p-4" />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="h-6 w-48 bg-gray-300 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Info Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm h-16"
            />
          ))}
        </div>

        {/* Amenities */}
        <div>
          <div className="h-6 w-40 bg-gray-300 rounded mt-8 mb-3" />
        </div>
      </div>
    </main>
  );
}

export default PropertySkeleton;
