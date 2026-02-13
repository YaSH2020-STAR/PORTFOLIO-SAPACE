import React from 'react';
import { productApp } from '../../data/portfolioData';

const ProductPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-4">Product & App Development</h1>
        <div className="max-w-2xl space-y-6">
          <h2 className="text-xl font-display font-semibold text-silver-light">
            {productApp.title}
          </h2>
          <p className="text-silver italic">{productApp.tagline}</p>
          <ul className="space-y-2 text-silver">
            {productApp.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-glow-blue mt-1.5">▸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
