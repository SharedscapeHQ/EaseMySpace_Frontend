export function ReelCard({ reel, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 w-[240px] h-[420px] sm:w-[260px] sm:h-[460px] rounded-lg overflow-hidden bg-black shadow-md"
    >
      <video
        src={reel.src}
        className="w-full h-full object-cover bg-black"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-end">
        <p className="text-white text-sm font-medium line-clamp-2 text-left">
          {reel.title}
        </p>
      </div>
    </button>
  );
}
