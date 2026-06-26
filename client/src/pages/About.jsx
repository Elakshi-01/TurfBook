import { useNavigate } from "react-router-dom";
import { FiSearch, FiCalendar, FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function About() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FiSearch />,
      title: "Search",
      desc: "Pick your sport and city. Browse verified turfs with real photos, pricing, and timings.",
    },
    {
      icon: <FiCalendar />,
      title: "Book",
      desc: "Choose your slot and confirm in seconds. No phone calls, no waiting on a reply.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Play",
      desc: "Show up and play. Your booking is confirmed and the venue is expecting you.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080f0a] text-white">

      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">
            About TurfBook
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Booking a turf shouldn't<br />take ten phone calls.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
            TurfBook connects players with verified sports venues across India,
            and gives vendors a simple way to list their turf and manage bookings.
            No middlemen, no guesswork.
          </p>
        </div>
      </section>

      {/* What it does */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">
              What it does
            </p>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              One place to find and book a turf.
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Vendors list their football, cricket, badminton, or tennis venues with
              real photos, pricing, and availability. Every listing is reviewed before
              it goes live, so what you see is what you get.
            </p>
          </div>
          <div>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">
              Who it's for
            </p>
            <h2 className="text-3xl font-black tracking-tight mb-4">
              Players and venue owners.
            </h2>
            <p className="text-slate-400 leading-relaxed">
              If you play, you get instant booking without the back-and-forth.
              If you run a turf, you get a dashboard to list your venue, manage
              slots, and track bookings — without building any of it yourself.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="text-center mb-14">
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Three steps. That's it.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300"
            >
              <span className="absolute top-6 right-6 text-5xl font-black text-white/5">
                {i + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl mb-6">
                {icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-6">
          Ready to find your turf?
        </h2>
        <button
          onClick={() => navigate("/turfs")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all duration-200"
        >
          Browse turfs <FiArrowRight />
        </button>
      </section>

    </div>
  );
}