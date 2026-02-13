import React from 'react';
import { research } from '../../data/portfolioData';

const ResearchPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-4">Research</h1>
        <div className="space-y-10 max-w-2xl">
          <div>
            <h2 className="text-lg font-display font-medium text-silver-light mb-3">Interests</h2>
            <ul className="space-y-2 text-silver">
              {research.interests.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-glow-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-display font-medium text-silver-light mb-3">Current work</h2>
            <p className="text-silver leading-relaxed">{research.current}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResearchPage;
