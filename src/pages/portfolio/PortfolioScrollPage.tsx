import React, { useRef, useEffect } from 'react';
import { Mail, Linkedin, Github, ChevronDown, FileDown } from 'lucide-react';
import { ScrollReveal } from '../../components/portfolio/ScrollReveal';
import {
  home,
  about,
  projectsCaseStudies,
  research,
  productApp,
  leadership,
  odyssey,
  contact,
  identity,
} from '../../data/portfolioData';
import type { CaseStudy } from '../../data/portfolioData';

function Chapter({
  id,
  children,
  className = '',
  minHeight = true,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: boolean;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={`relative ${minHeight ? 'min-h-screen' : ''} flex flex-col justify-center ${className}`}
    >
      {children}
    </section>
  );
}

const PortfolioScrollPage: React.FC = () => {
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      });
      return () => cancelAnimationFrame(t);
    }
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('about');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="portfolio-scroll-root" className="bg-space">
      {/* ——— Hero ——— */}
      <Chapter id="home" className="starfield pt-16">
        <div className="absolute inset-0 gradient-orb-strong pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-space/40 via-transparent to-space pointer-events-none" aria-hidden />
        <div className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight leading-tight mb-6">
              {home.headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="text-lg md:text-xl text-silver max-w-2xl mx-auto mb-8">
              {home.subheading}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-silver/90 text-base md:text-lg max-w-xl mx-auto mb-12">
              {home.intro}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <button
              type="button"
              onClick={scrollToNext}
              className="inline-flex flex-col items-center gap-2 text-silver/70 hover:text-silver transition-colors duration-300"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
              <ChevronDown className="w-5 h-5 animate-float" />
            </button>
          </ScrollReveal>
        </div>
      </Chapter>

      {/* ——— About ——— */}
      <Chapter id="about" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-6">About</p>
            <h2 className="section-title text-white mb-8">Who I am</h2>
          </ScrollReveal>
          {about.paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <p className="text-silver leading-relaxed mb-6">{p}</p>
            </ScrollReveal>
          ))}
        </div>
      </Chapter>

      {/* ——— Projects ——— */}
      <Chapter id="projects" minHeight={false} className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4">Work</p>
            <h2 className="section-title text-white mb-4">Projects</h2>
            <p className="text-silver mb-14 max-w-xl">Selected case studies: problem, approach, tech, impact.</p>
          </ScrollReveal>
          <div className="space-y-10">
            {projectsCaseStudies.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 40}>
                <CaseStudyCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Chapter>

      {/* ——— Research ——— */}
      <Chapter id="research" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4">Focus</p>
            <h2 className="section-title text-white mb-8">Research</h2>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <p className="text-silver/80 text-sm uppercase tracking-wider mb-4">Interests</p>
            <ul className="space-y-3 text-silver mb-10">
              {research.interests.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-glow-blue shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="text-silver/80 text-sm uppercase tracking-wider mb-3">Current work</p>
            <p className="text-silver leading-relaxed">{research.current}</p>
          </ScrollReveal>
        </div>
      </Chapter>

      {/* ——— Product ——— */}
      <Chapter id="product" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4">Product</p>
            <h2 className="section-title text-white mb-4">DsYnc</h2>
            <p className="text-silver-light font-medium mb-2">{productApp.title}</p>
            <p className="text-silver italic mb-8">{productApp.tagline}</p>
          </ScrollReveal>
          <ul className="space-y-4 text-silver">
            {productApp.points.map((point, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <li className="flex items-start gap-3">
                  <span className="text-glow-blue mt-1 shrink-0">▸</span>
                  <span>{point}</span>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </Chapter>

      {/* ——— Leadership ——— */}
      <Chapter id="leadership" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4">Impact</p>
            <h2 className="section-title text-white mb-8">Leadership</h2>
            <p className="text-silver leading-relaxed">{leadership.summary}</p>
          </ScrollReveal>
        </div>
      </Chapter>

      {/* ——— Odyssey ——— */}
      <Chapter id="odyssey" className="starfield py-24 md:py-32 relative">
        <div className="absolute inset-0 gradient-orb pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/50 mb-4">Beyond code</p>
            <h2 className="section-title text-white mb-6">Odyssey</h2>
            <p className="text-silver-light text-lg font-medium mb-6">{odyssey.title}</p>
            <p className="text-silver text-lg mb-6">{odyssey.intro}</p>
          </ScrollReveal>
          {odyssey.paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <p className="text-silver leading-relaxed mb-6">{p}</p>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={160}>
            <p className="text-silver-light font-medium mt-8">{odyssey.closing}</p>
          </ScrollReveal>
          {odyssey.galleryPlaceholder && (
            <ScrollReveal delay={200}>
              <div className="mt-16 py-16 border border-dashed border-gloss-mid/40 rounded-xl text-center text-silver/50 text-sm">
                Image gallery — to be added
              </div>
            </ScrollReveal>
          )}
        </div>
      </Chapter>

      {/* ——— Contact ——— */}
      <Chapter id="contact" className="py-24 md:py-32" minHeight={true}>
        <div ref={contactRef} className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-6">Connect</p>
            <h2 className="section-title text-white mb-6">{contact.headline}</h2>
            <div className="flex flex-wrap justify-center gap-10 text-silver">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-silver-light transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-silver-light transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-silver-light transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a
                href={contact.resumePdf}
                download
                className="flex items-center gap-2 hover:text-silver-light transition-colors"
              >
                <FileDown className="h-5 w-5" />
                <span>Resume</span>
              </a>
            </div>
            <p className="mt-12 text-silver/60 text-sm">
              {identity.name} · {identity.location}
            </p>
          </ScrollReveal>
        </div>
      </Chapter>
    </div>
  );
};

function CaseStudyCard({ project }: { project: CaseStudy }) {
  return (
    <article className="border border-gloss-mid/40 rounded-xl p-6 md:p-8 bg-gloss/20 hover:border-graphite/40 transition-colors duration-500">
      <h3 className="text-lg font-display font-semibold text-white mb-4">{project.title}</h3>
      <div className="space-y-4 text-silver text-sm md:text-base leading-relaxed">
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Problem</span>
          <p className="mt-1">{project.problem}</p>
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Approach</span>
          <p className="mt-1">{project.approach}</p>
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Tech</span>
          <p className="mt-1">{project.tech.join(' · ')}</p>
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Impact</span>
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
}

export default PortfolioScrollPage;
