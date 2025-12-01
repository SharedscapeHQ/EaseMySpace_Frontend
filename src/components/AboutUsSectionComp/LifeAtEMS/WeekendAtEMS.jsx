import React from 'react';
import { FaCocktail, FaCoffee, FaMusic } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';

export default function WeekendAtEMS({
  videos = [
    { src: 'https://www.w3schools.com/html/mov_bbb.mp4', poster: '' },
    { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: '' }
  ],
  description,
  className = ''
}) {
  const defaultDescription = `At EaseMySpace (EMS) we value quality work and the humans who do it. That's
  why we give flexibility and time to refresh — so each teammate can come back
  energized and perform at their best. We work hard, but we also chill: rooftop
  playlists, coffee catch-ups, and relaxing weekend hangouts keep our creativity
  flowing.`;

  return (
    <section style={{fontFamily:"para_font"}} className={` p-6 bg-gradient-to-r from-slate-100 via-white to-slate-100 rounded-2xl shadow-lg ${className}`}>
      <header className="flex flex-col items-center text-center gap-3 mb-6 animate-fadeIn">
        <h3  style={{ fontFamily: "heading_font" }}
        className="text-lg lg:text-3xl text-black leading-tight">Weekends at EMS</h3>
        <p className="text-sm text-slate-500">Chill. Recharge. Create.</p>

        <div className="flex items-center gap-4 text-slate-600 mt-3 text-2xl animate-bounce">
          <FaCocktail title="Relax" />
          <GiPalmTree title="Getaway" />
          <FaCoffee title="Catch-up" />
          <FaMusic title="Vibes" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {videos.slice(0, 2).map((v, i) => (
          <figure key={i} className="rounded-lg overflow-hidden shadow-md bg-black">
            <video
              src={typeof v === 'string' ? v : v.src}
              poster={typeof v === 'object' ? v.poster : ''}
              loop
              muted
              autoPlay
              playsInline
              className="w-full h-48 md:h-56 lg:h-60 object-cover"
            />
          </figure>
        ))}
      </div>

      <div className="prose prose-slate max-w-none animate-fadeIn">
        <p className="text-slate-700">{description || defaultDescription}</p>

        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100 shadow-inner">
          <h4 className="text-lg font-semibold">Why we do it</h4>
          <ul className="mt-2 ml-4 list-disc text-slate-700">
            <li>Flexibility to choose how and when you recharge.</li>
            <li>Short, regular breaks so people return energized.</li>
            <li>A culture that values creativity, rest, and real human connection.</li>
          </ul>
        </div>

        <footer className="mt-4 text-sm text-slate-500">We work seriously — and chill seriously too. 😎</footer>
      </div>
    </section>
  );
}