import React from 'react';
import { Link } from 'react-router-dom';
import { home } from '../../data/portfolioData';

const PortfolioHomePage: React.FC = () => {
  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center starfield overflow-hidden pt-16">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-space/50 via-transparent to-space" aria-hidden />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight leading-tight mb-6 animate-fade-in">
            {home.headline}
          </h1>
          <p className="text-lg md:text-xl text-silver max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {home.subheading}
          </p>
          <p className="text-silver/90 text-base md:text-lg max-w-xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            {home.intro}
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-lg border border-silver/40 text-silver-light font-display font-medium hover:border-silver hover:bg-gloss/50 hover:shadow-[0_0_24px_rgba(74,108,247,0.15)] transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.35s' }}
          >
            {home.cta}
          </Link>
        </div>
      </section>
    </>
  );
};

export default PortfolioHomePage;
