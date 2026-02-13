import React from 'react';
import { about } from '../../data/portfolioData';

const AboutPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-4">About</h1>
        <div className="space-y-6 text-silver leading-relaxed max-w-2xl">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
