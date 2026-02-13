import React from 'react';
import { odyssey } from '../../data/portfolioData';

const OdysseyPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20 starfield min-h-screen">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-6">Odyssey</h1>
        <p className="text-silver-light text-lg font-medium mb-8 max-w-2xl">
          {odyssey.title}
        </p>
        <p className="text-silver text-lg mb-6 max-w-2xl">
          {odyssey.intro}
        </p>
        <div className="space-y-6 text-silver leading-relaxed max-w-2xl mb-10">
          {odyssey.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-silver-light font-medium max-w-2xl">
          {odyssey.closing}
        </p>
        {odyssey.galleryPlaceholder && (
          <div className="mt-16 p-12 border border-dashed border-gloss-mid/50 rounded-xl text-center text-silver/60">
            Image gallery — to be added later
          </div>
        )}
      </section>
    </main>
  );
};

export default OdysseyPage;
