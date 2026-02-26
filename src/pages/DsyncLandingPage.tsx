import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Activity, Users, Radio } from 'lucide-react';

const DsyncLandingPage: React.FC = () => {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) setVisible((v) => new Set([...v, i]));
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen dsync-bg text-white overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
        {/* Animated orbs */}
        <div
          className="dsync-orb absolute w-[600px] h-[600px] rounded-full bg-dsync-orange/20 -top-40 -left-40"
          aria-hidden
        />
        <div
          className="dsync-orb absolute w-[400px] h-[400px] rounded-full bg-dsync-teal/15 top-1/2 -right-32"
          style={{ animationDelay: '1s' }}
          aria-hidden
        />
        <div
          className="dsync-float absolute w-[200px] h-[200px] rounded-full bg-dsync-orange/10 bottom-32 left-1/4"
          aria-hidden
        />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dsync-orange/40 bg-dsync-orange/5 mb-8 dsync-reveal">
            <Radio className="w-4 h-4 text-dsync-orange animate-pulse" />
            <span className="text-sm font-medium text-dsync-orange">Live tracking for riders & hikers</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter dsync-title-glow text-dsync-orange mb-6 dsync-reveal" style={{ animationDelay: '0.1s' }}>
            Dsync
          </h1>
          <p className="text-xl sm:text-2xl text-silver-light/90 max-w-2xl mx-auto mb-12 dsync-reveal" style={{ animationDelay: '0.25s' }}>
            Set destination. Track your ride. Get the overview. Ride together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center dsync-reveal" style={{ animationDelay: '0.4s' }}>
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-dsync-orange text-white font-semibold text-lg shadow-lg shadow-dsync-orange/30 hover:shadow-dsync-orange/50 hover:scale-105 transition-all duration-300"
            >
              App Store
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl border-2 border-dsync-teal/60 text-dsync-teal font-semibold text-lg hover:bg-dsync-teal/10 hover:scale-105 transition-all duration-300"
            >
              Google Play
            </a>
          </div>
        </div>

        {/* Grid fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section className="relative py-32 px-6">
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 text-white">
          Simple as <span className="text-dsync-orange">AllTrails</span>. Built for <span className="text-dsync-teal">together</span>.
        </h2>
        <p className="text-center text-silver/80 text-lg max-w-xl mx-auto mb-20">
          Pick a destination, hit start, and ride. See your session at a glance. Add friends and stay in sync.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              index: 0,
              icon: MapPin,
              title: 'Set destination',
              desc: 'Search or tap on the map. Get a route. No API keys needed.',
              iconClass: 'bg-dsync-orange/20 text-dsync-orange',
            },
            {
              index: 1,
              icon: Activity,
              title: 'Track & overview',
              desc: 'Start recording. See distance, duration, and your path live. End session for a full summary.',
              iconClass: 'bg-dsync-teal/20 text-dsync-teal',
            },
            {
              index: 2,
              icon: Users,
              title: 'Ride together',
              desc: 'Add friends by email. See who\'s on track. Get off-route alerts when someone drifts.',
              iconClass: 'bg-dsync-orange/20 text-dsync-orange',
            },
          ].map(({ index, icon: Icon, title, desc, iconClass }) => (
            <article
              key={index}
              ref={(el) => { sectionRefs.current[index] = el; }}
              data-index={index}
              className={`relative p-8 rounded-3xl border bg-gloss/40 backdrop-blur-sm transition-all duration-700 ${
                visible.has(index)
                  ? 'opacity-100 translate-y-0 border-dsync-orange/30 shadow-lg shadow-dsync-orange/5'
                  : 'opacity-0 translate-y-12 border-white/5'
              }`}
            >
              <div className={`inline-flex p-3 rounded-2xl mb-6 ${iconClass}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-silver/80">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="dsync-orb absolute w-[500px] h-[500px] rounded-full bg-dsync-orange/10 bottom-0 left-1/2 -translate-x-1/2" aria-hidden />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Find your outside. <span className="text-dsync-orange">Together.</span>
          </h2>
          <p className="text-silver/80 text-lg mb-10">
            Download Dsync and start your next ride or hike with your crew in sync.
          </p>
          <a
            href="#"
            className="inline-block px-10 py-4 rounded-2xl bg-dsync-orange text-white font-semibold text-lg shadow-xl shadow-dsync-orange/25 hover:shadow-dsync-orange/40 hover:scale-105 transition-all duration-300"
          >
            Get the app
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-dsync-orange font-bold text-lg">Dsync</span>
          <span className="text-silver/60 text-sm">Live group location for bikers & hikers.</span>
        </div>
      </footer>
    </div>
  );
};

export default DsyncLandingPage;
