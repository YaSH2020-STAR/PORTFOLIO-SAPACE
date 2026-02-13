import React from 'react';
import { Link } from 'react-router-dom';
import { identity } from '../../data/portfolioData';

const PortfolioFooter: React.FC = () => {
  return (
    <footer className="border-t border-gloss-mid/50 bg-space-lighter/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-silver">
          <span>
            {identity.name} · {identity.location}
          </span>
          <div className="flex gap-6">
            <a
              href={`mailto:${identity.email}`}
              className="hover:text-silver-light transition-colors"
            >
              Email
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-silver-light transition-colors"
            >
              LinkedIn
            </a>
            <a href="/resume.pdf" download className="hover:text-silver-light transition-colors">
              Resume
            </a>
            <Link to="/#contact" className="hover:text-silver-light transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
