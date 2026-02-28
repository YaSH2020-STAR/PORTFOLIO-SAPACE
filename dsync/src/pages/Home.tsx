import { useEffect, useRef, useState } from 'react';

const LINE1 = "Ride together.";
const LINE2 = "Stay in sync.";

/** Continuous line drawing of hikers — hidden on first page, small + same opacity on other pages. */
function HikersLineArtBg({ scrollY }: { scrollY: number }) {
  const heroThreshold = 680; /* ~85vh: show only after first page */
  const show = scrollY >= heroThreshold;
  return (
    <div
      className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none transition-opacity duration-300"
      style={{ opacity: show ? 1 : 0 }}
      aria-hidden
    >
      <img
        src="/hikers-vecteezy.png"
        alt=""
        className="hikers-lineart-bg hikers-lineart-small w-full max-w-[100vw] h-auto max-h-[28vh] object-contain object-bottom"
      />
    </div>
  );
}


/** Hand-drawn hikers sketch: full image visible, blends into page, moves up as you scroll. */
function HikersSketch({ offsetY }: { offsetY: number }) {
  return (
    <div
      className="hikers-sketch-wrap absolute inset-0 flex items-end justify-center"
      style={{ transform: `translateY(-${offsetY}px)` }}
    >
      <img
        src="/hikers-sketch.png"
        alt=""
        className="hikers-sketch-img max-w-full max-h-full w-auto h-auto object-contain object-bottom"
      />
    </div>
  );
}

function StaggeredLine({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(/\s+/);
  return (
    <div className={`flex flex-wrap justify-center gap-x-[0.35em] gap-y-2 ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-[staggerReveal_0.6s_ease-out_forwards]"
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function LetterStagger({ text, className = '' }: { text: string; className?: string }) {
  const letters = text.split('');
  return (
    <span className={className}>
      {letters.map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-[letterReveal_0.5s_ease-out_forwards]"
          style={{ animationDelay: `${0.3 + i * 0.06}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const climbingOffsetY = Math.min(scrollY * 0.35, 180);
  /* Crop Dsync logo from bottom as user scrolls down (0 = full, 100 = fully cropped) */
  const logoCropPercent = Math.min(100, (scrollY / 420) * 100);
  /* Image vanishes as you scroll: 1 at top → 0 after ~500px, with gradient feel */
  const sketchOpacity = Math.max(0, 1 - scrollY / 480);

  const dsyncRepoUrl = 'https://github.com/YaSH2020-STAR/dsync';

  return (
    <div className="min-h-screen bg-dsync-bg text-dsync-light relative">
      {/* Line-art hikers: hidden on first page, small + same opacity on other pages */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <HikersLineArtBg scrollY={scrollY} />
      </div>
      {/* Background: hikers sketch — vanishes as you scroll with gradient disappearing */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[1] h-[45vh] min-h-[300px] overflow-hidden pointer-events-none hikers-sketch-vanish"
        style={{ opacity: sketchOpacity }}
        aria-hidden
      >
        <div className="absolute inset-0 hikers-sketch-blend" />
        <HikersSketch offsetY={climbingOffsetY} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <a href="/" className="font-display font-bold text-xl tracking-tight text-dsync-light">
          Dsync
        </a>
        <div className="flex items-center gap-5 md:gap-8 text-sm text-dsync-silver gray-neon">
          <a href="#features" className="hover:text-dsync-orange transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Features</a>
          <a href="#download" className="hover:text-dsync-orange transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Download</a>
          <a href="#imp-codes" className="hover:text-dsync-orange transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('imp-codes')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Imp codes</a>
          <a href="#about" className="hover:text-dsync-orange transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>About me</a>
          <a href="#contact" className="hover:text-dsync-orange transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Contact</a>
        </div>
      </nav>

      {/* Main content: ends at footer — no black box below */}
      <div className="relative z-10 pb-8">
      {/* Hero — Bettina-style staggered animation */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32"
      >
        <div className="text-center max-w-4xl mx-auto">
          {mounted && (
            <>
              {/* Dsync logo: cropped from bottom as you scroll down */}
              <div
                className="overflow-hidden transition-[clip-path] duration-150"
                style={{ clipPath: `inset(0 0 ${logoCropPercent}% 0)` }}
              >
                <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6">
                  <LetterStagger text="Dsync" className="text-dsync-light" />
                </h1>
              </div>
              <p className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-white/95 mb-4 slogan-text">
                <StaggeredLine text={LINE1} />
              </p>
              <p className="font-display font-medium text-2xl sm:text-3xl md:text-4xl text-white/90 slogan-text">
                <StaggeredLine text={LINE2} />
              </p>
            </>
          )}
        </div>
        <p className="mt-24 text-slate-400 text-sm uppercase tracking-widest scroll-hint">
          Scroll
        </p>
      </section>

      {/* Short tagline */}
      <section className="px-6 py-20 md:py-28 border-t border-white/5">
        <p className="text-center text-lg md:text-xl text-dsync-silver gray-neon max-w-2xl mx-auto">
          Set your destination. Track your ride. Invite friends. Dsync keeps everyone on the same
          route—walking, cycling, or exploring.
        </p>
      </section>

      {/* App gallery — photos / screenshots */}
      <section id="gallery" className="px-6 py-20 md:py-28 border-t border-white/5 overflow-hidden">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-4 text-dsync-light">
          The app
        </h2>
        <p className="text-center text-dsync-silver gray-neon max-w-xl mx-auto mb-16">
          Map, track, and ride together—all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {[
            { src: '/app/destination.png', alt: 'Set destination', label: 'Set destination' },
            { src: '/app/map-view.png', alt: 'Map view', label: 'Map' },
            { src: '/app/map-ready.png', alt: 'Map ready to track', label: 'Ready & start tracking' },
            { src: '/app/replay.png', alt: 'Replay route', label: 'Replay' },
            { src: '/app/travels.png', alt: 'Your travels', label: 'Your travels' },
            { src: '/app/alerts.png', alt: 'Off-route alerts', label: 'Alerts' },
            { src: '/app/settings.png', alt: 'Settings', label: 'Settings' },
          ].map(({ src, alt, label }) => (
            <div
              key={src}
              className="flex flex-col items-center group"
            >
              <div className="relative rounded-[2rem] border border-white/10 bg-dsync-card p-2 shadow-xl transition-all duration-300 group-hover:border-dsync-orange/40 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <div className="w-[140px] md:w-[160px] overflow-hidden rounded-[1.5rem] bg-dsync-bg">
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-auto object-cover object-top"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-dsync-silver font-medium gray-neon">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features — expanded */}
      <section id="features" className="px-6 py-20 md:py-28">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-4 text-dsync-light">
          Why Dsync
        </h2>
        <p className="text-center text-dsync-silver gray-neon max-w-xl mx-auto mb-16">
          Everything you need to ride together and stay on the same route.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: 'Set destination', desc: 'Search for a place or tap on the map to set your destination. Reverse geocoding shows the address.' },
            { title: 'Tap on map', desc: '"Select on map" lets you pick any point—destination is set with one tap and shown on the Ready bar.' },
            { title: 'Real-time tracking', desc: 'Start recording without waiting for GPS. Your path updates live; camera follows when recording.' },
            { title: 'Recording HUD', desc: 'See "Recording · X km" while you ride. AllTrails-style: start instantly, track distance and route.' },
            { title: 'Add friends by email', desc: 'Invite teammates by email. Everyone stays on the same route; no separate "select route" tab.' },
            { title: 'Off-route alerts', desc: 'Get notified only when a trip is active and you go off the chosen route.' },
            { title: 'Walking & bike', desc: 'Routes optimized for walking or cycling. Clean map UI with thin, curvy route line.' },
            { title: 'Background recording', desc: 'Keep tracking on iOS when the app is in the background so your ride is never lost.' },
            { title: 'Distance & level', desc: 'Compact stat cards for distance and level. Accurate current location and centering.' },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-dsync-card border border-white/10 rounded-xl p-5 hover:border-dsync-orange/40 transition-colors"
            >
              <h3 className="font-display font-semibold text-dsync-orange mb-2">{f.title}</h3>
              <p className="text-dsync-silver text-sm leading-relaxed gray-neon">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Download */}
      <section id="download" className="px-6 py-20 md:py-28 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Get the app</h2>
          <p className="text-dsync-silver gray-neon mb-8">
            Dsync is available on iOS and Android. Share the APK or install from the store.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full bg-dsync-orange text-dsync-bg font-semibold hover:bg-dsync-orange/90 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* Important codes — button goes directly to GitHub repo */}
      <section id="imp-codes" className="px-6 py-20 md:py-28 border-t border-white/5">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-4 text-dsync-light">
          Important codes
        </h2>
        <p className="text-center text-dsync-silver gray-neon max-w-xl mx-auto mb-10">
          Links and references you might need.
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => window.open(dsyncRepoUrl, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dsync-orange text-dsync-bg font-semibold hover:bg-dsync-orange/90 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
            aria-label="Open Dsync repository on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            See Inside DSync
          </button>
        </div>
      </section>

      {/* About me — small tab before ending */}
      <section id="about" className="px-6 py-12 md:py-16 border-t border-white/5">
        <h2 className="font-display font-bold text-xl md:text-2xl text-center mb-6 text-dsync-light">
          About me
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-2xl mx-auto text-sm">
          <a
            href="mailto:ydorshet@asu.edu"
            className="text-dsync-silver gray-neon hover:text-dsync-orange transition-colors"
          >
            ydorshet@asu.edu
          </a>
          <a
            href="https://www.linkedin.com/in/yash-dorshetwar-55a983191/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dsync-silver gray-neon hover:text-dsync-orange transition-colors"
            title="Yash Dorshetwar on LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://yashdorshetwar.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dsync-silver gray-neon hover:text-dsync-orange transition-colors"
          >
            Portfolio
          </a>
        </div>
      </section>

      {/* Footer — page ends here: 2026 Dsync + slogan, no line below */}
      <footer id="contact" className="px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto text-sm">
          <p className="text-dsync-light font-display font-semibold">© 2026 Dsync</p>
          <p className="text-dsync-silver gray-neon">Ride together. Stay in sync.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
