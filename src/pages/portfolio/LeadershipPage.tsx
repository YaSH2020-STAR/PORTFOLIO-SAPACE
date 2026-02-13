import React from 'react';
import { leadership } from '../../data/portfolioData';

const LeadershipPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-4">Leadership & Impact</h1>
        <p className="text-silver leading-relaxed max-w-2xl">
          {leadership.summary}
        </p>
      </section>
    </main>
  );
};

export default LeadershipPage;
