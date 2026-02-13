import React from 'react';
import { projectsCaseStudies } from '../../data/portfolioData';
import type { CaseStudy } from '../../data/portfolioData';

const CaseStudyBlock: React.FC<{ project: CaseStudy; index: number }> = ({ project, index }) => (
  <article
    className="border border-gloss-mid/50 rounded-xl p-6 md:p-8 bg-gloss/30 hover:border-graphite/50 transition-colors duration-300"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <h2 className="text-xl font-display font-semibold text-white mb-4">{project.title}</h2>
    <div className="space-y-4 text-silver text-sm md:text-base leading-relaxed">
      <div>
        <span className="text-silver/70 uppercase tracking-wider text-xs">Problem</span>
        <p className="mt-1">{project.problem}</p>
      </div>
      <div>
        <span className="text-silver/70 uppercase tracking-wider text-xs">Approach</span>
        <p className="mt-1">{project.approach}</p>
      </div>
      <div>
        <span className="text-silver/70 uppercase tracking-wider text-xs">Tech</span>
        <p className="mt-1">{project.tech.join(' · ')}</p>
      </div>
      <div>
        <span className="text-silver/70 uppercase tracking-wider text-xs">Impact</span>
        <p className="mt-1">{project.impact}</p>
      </div>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-glow-blue hover:text-glow-violet transition-colors"
        >
          {project.linkLabel || 'Link'} →
        </a>
      )}
    </div>
  </article>
);

const ProjectsPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20">
      <section className="chapter-section">
        <h1 className="section-title text-white mb-4">Projects</h1>
        <p className="text-silver mb-12 max-w-2xl">
          Selected work as case studies: problem, approach, tech, and impact.
        </p>
        <div className="space-y-8">
          {projectsCaseStudies.map((project, i) => (
            <CaseStudyBlock key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProjectsPage;
