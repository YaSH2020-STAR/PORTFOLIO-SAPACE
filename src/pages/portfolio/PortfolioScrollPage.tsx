import React, { useRef, useEffect } from 'react';
import { Mail, Linkedin, Github, ChevronDown, FileDown } from 'lucide-react';
import { ScrollReveal } from '../../components/portfolio/ScrollReveal';
import { PointerSpotlightLayer } from '../../components/portfolio/PointerSpotlightLayer';
import { TypewriterEffect } from '../../components/portfolio/TypewriterEffect';
import {
  home,
  about,
  projectsCaseStudies,
  research,
  productApp,
  afterHoursApp,
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

/** Dim canyon image behind About section; fades when scrolling away from "Who I am". */
function AboutBackgroundImage() {
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    const aboutEl = document.getElementById('about');
    if (!aboutEl) return;

    const updateOpacity = () => {
      const rect = aboutEl.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const fadeRange = window.innerHeight * 0.6;
      const visible = Math.max(0, 1 - distance / fadeRange);
      setOpacity(visible * 0.14);
    };

    updateOpacity();
    window.addEventListener('scroll', updateOpacity, { passive: true });
    return () => window.removeEventListener('scroll', updateOpacity);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        opacity,
        zIndex: 0,
      }}
      aria-hidden
    />
  );
}

/** Dim B&W image behind Dsync/Product section; fades when scrolling away. Positioned right. */
function ProductSectionBackgroundImage() {
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    const el = document.getElementById('product');
    if (!el) return;

    const updateOpacity = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const fadeRange = window.innerHeight * 0.6;
      const visible = Math.max(0, 1 - distance / fadeRange);
      setOpacity(visible * 0.14);
    };

    updateOpacity();
    window.addEventListener('scroll', updateOpacity, { passive: true });
    return () => window.removeEventListener('scroll', updateOpacity);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-cover bg-no-repeat pointer-events-none transition-opacity duration-300"
      style={{
        backgroundImage: 'url(/dsync-section-bg.png)',
        backgroundPosition: 'right center',
        filter: 'grayscale(100%)',
        opacity,
        zIndex: 0,
      }}
      aria-hidden
    />
  );
}

/** Dim image behind AfterHours section; fades when scrolling away. */
function AfterHoursSectionBackgroundImage() {
  const [opacity, setOpacity] = React.useState(0);

  useEffect(() => {
    const el = document.getElementById('afterhours-product');
    if (!el) return;

    const updateOpacity = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      const fadeRange = window.innerHeight * 0.6;
      const visible = Math.max(0, 1 - distance / fadeRange);
      setOpacity(visible * 0.14);
    };

    updateOpacity();
    window.addEventListener('scroll', updateOpacity, { passive: true });
    return () => window.removeEventListener('scroll', updateOpacity);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-300"
      style={{
        backgroundImage: 'url(/afterhours-section-bg.png)',
        filter: 'grayscale(100%)',
        opacity,
        zIndex: 0,
      }}
      aria-hidden
    />
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
    <div id="portfolio-scroll-root" className="relative min-h-screen bg-space font-typewriter">
      {/* Layer stack: base → star pattern → pointer spotlight (was hidden when spotlight lived under App z-10) → content */}
      <div className="absolute inset-0 starfield pointer-events-none z-0" aria-hidden />
      <PointerSpotlightLayer />
      <div className="relative z-10 min-h-screen">
      {/* Hero */}
      <Chapter id="home" className="pt-16">
        <div className="absolute inset-0 gradient-orb-strong pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-space/40 via-transparent to-space pointer-events-none" aria-hidden />
        <div className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          <div className="pointer-parallax-hero">
            <ScrollReveal>
              <TypewriterEffect
                as="h1"
                text={home.headline}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight leading-tight mb-6 flex flex-wrap items-baseline justify-center gap-x-1 text-balance"
                innerClassName="inline-flex flex-wrap justify-center gap-x-1 gap-y-1 items-baseline"
                wordDelay={0.07}
                startDelayMs={120}
                showCursor
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <TypewriterEffect
                as="p"
                text={home.subheading}
                className="text-lg md:text-xl text-silver max-w-2xl mx-auto mb-8 flex flex-wrap items-baseline justify-center gap-x-1"
                innerClassName="inline-flex flex-wrap justify-center gap-x-1 gap-y-1 items-baseline"
                wordDelay={0.05}
                startDelayMs={280}
              />
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <TypewriterEffect
                as="p"
                text={home.intro}
                className="text-silver/90 text-base md:text-lg max-w-xl mx-auto mb-12 flex flex-wrap items-baseline justify-center gap-x-1"
                innerClassName="inline-flex flex-wrap justify-center gap-x-1 gap-y-1 items-baseline"
                wordDelay={0.035}
                startDelayMs={400}
                showCursor
              />
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
        </div>
      </Chapter>

      {/* About */}
      <Chapter id="about" className="py-24 md:py-32 relative">
        {/* Dim background image: fades when scrolling away from this section */}
        <AboutBackgroundImage />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="About"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-6 font-typewriter"
              wordDelay={0.14}
              startDelayMs={80}
            />
            <TypewriterEffect
              as="h2"
              text="Who I am"
              className="section-title text-white mb-8 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.12}
              startDelayMs={200}
            />
          </ScrollReveal>
          {about.paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <TypewriterEffect
                as="p"
                text={p}
                className="text-silver leading-relaxed mb-6 flex flex-wrap items-baseline gap-x-1"
                wordDelay={0.028}
                startDelayMs={120 + i * 80}
              />
            </ScrollReveal>
          ))}
        </div>
      </Chapter>

      {/* Projects */}
      <Chapter id="projects" minHeight={false} className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Work"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4 font-typewriter"
              wordDelay={0.14}
            />
            <TypewriterEffect
              as="h2"
              text="Projects"
              className="section-title text-white mb-4 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.14}
              startDelayMs={120}
            />
            <TypewriterEffect
              as="p"
              text="Selected case studies: problem, approach, tech, impact."
              className="text-silver mb-14 max-w-xl flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.05}
              startDelayMs={240}
            />
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

      {/* Research */}
      <Chapter id="research" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Focus"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4 font-typewriter"
              wordDelay={0.14}
            />
            <TypewriterEffect
              as="h2"
              text="Research"
              className="section-title text-white mb-8 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.12}
              startDelayMs={120}
            />
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <TypewriterEffect
              as="p"
              text="Interests"
              className="text-silver/80 text-sm uppercase tracking-wider mb-4 font-typewriter"
              wordDelay={0.12}
            />
            <ul className="space-y-3 text-silver mb-10">
              {research.interests.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-glow-blue shrink-0 mt-2" />
                  <TypewriterEffect
                    as="span"
                    text={item}
                    className="flex flex-wrap items-baseline gap-x-1 flex-1 min-w-0"
                    wordDelay={0.045}
                    startDelayMs={80 + i * 100}
                  />
                </li>
              ))}
            </ul>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <TypewriterEffect
              as="p"
              text="Current work"
              className="text-silver/80 text-sm uppercase tracking-wider mb-3 font-typewriter"
              wordDelay={0.1}
            />
            <TypewriterEffect
              as="p"
              text={research.current}
              className="text-silver leading-relaxed flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.03}
              startDelayMs={200}
            />
          </ScrollReveal>
        </div>
      </Chapter>

      {/* Product */}
      <Chapter id="product" className="py-24 md:py-32 relative">
        <ProductSectionBackgroundImage />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Product"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4 font-typewriter"
              wordDelay={0.14}
            />
            <h2 className="section-title text-white mb-4">
              <a
                href={productApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-neon transition-colors"
              >
                DsYnc
              </a>
            </h2>
            <TypewriterEffect
              as="p"
              text={productApp.title}
              className="text-silver-light font-medium mb-2 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.06}
              startDelayMs={100}
            />
            <TypewriterEffect
              as="p"
              text={productApp.tagline}
              className="text-silver italic mb-4 font-typewriter flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.07}
              startDelayMs={220}
            />
            <a
              href={productApp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-glow-blue hover:text-neon transition-colors text-sm font-medium mb-8"
            >
              Visit Dsync website →
            </a>

          </ScrollReveal>
          <ul className="space-y-4 text-silver">
            {productApp.points.map((point, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <li className="flex items-start gap-3">
                  <span className="text-glow-blue mt-1 shrink-0">▸</span>
                  <TypewriterEffect
                    as="span"
                    text={point}
                    className="flex flex-wrap items-baseline gap-x-1 flex-1 min-w-0"
                    wordDelay={0.04}
                    startDelayMs={120 + i * 140}
                  />
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </Chapter>

      {/* AfterHours */}
      <Chapter id="afterhours-product" className="py-24 md:py-32 relative">
        <AfterHoursSectionBackgroundImage />
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Product"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4 font-typewriter"
              wordDelay={0.14}
            />
            <h2 className="section-title text-white mb-4">
              <a
                href={afterHoursApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-neon transition-colors"
              >
                {afterHoursApp.title}
              </a>
            </h2>
            <TypewriterEffect
              as="p"
              text={afterHoursApp.description}
              className="text-silver leading-relaxed mb-6 font-typewriter flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.028}
              startDelayMs={280}
              showCursor
            />
            <a
              href={afterHoursApp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-glow-blue hover:text-neon transition-colors text-sm font-medium"
            >
              Join AfterHours →
            </a>
          </ScrollReveal>
        </div>
      </Chapter>

      {/* Leadership */}
      <Chapter id="leadership" className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Impact"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-4 font-typewriter"
              wordDelay={0.14}
            />
            <TypewriterEffect
              as="h2"
              text="Leadership"
              className="section-title text-white mb-8 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.12}
              startDelayMs={120}
            />
            <TypewriterEffect
              as="p"
              text={leadership.summary}
              className="text-silver leading-relaxed flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.03}
              startDelayMs={220}
            />
          </ScrollReveal>
        </div>
      </Chapter>

      {/* Odyssey */}
      <Chapter id="odyssey" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 gradient-orb pointer-events-none" aria-hidden />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="pointer-parallax-hero flex flex-col items-center justify-center py-20 overflow-visible mb-12 w-full">
              <TypewriterEffect
                as="span"
                text="Beyond Code"
                className="self-start text-[10px] tracking-[0.5em] text-gray-500 uppercase mb-2 font-typewriter block w-full text-left"
                wordDelay={0.12}
              />
              <TypewriterEffect
                as="h1"
                text="Odyssey"
                className="text-8xl md:text-9xl font-bold text-white tracking-tighter overflow-visible font-display flex flex-wrap items-baseline justify-center gap-x-2 w-full"
                innerClassName="inline-flex flex-wrap justify-center gap-x-2 items-baseline"
                wordDelay={0.2}
                startDelayMs={200}
              />
            </div>
            <TypewriterEffect
              as="p"
              text={odyssey.title}
              className="text-silver-light text-lg font-medium mb-6 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.06}
              startDelayMs={120}
            />
            <TypewriterEffect
              as="p"
              text={odyssey.intro}
              className="text-silver text-lg mb-6 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.05}
              startDelayMs={200}
            />
          </ScrollReveal>
          {odyssey.paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <TypewriterEffect
                as="p"
                text={p}
                className="text-silver leading-relaxed mb-6 flex flex-wrap items-baseline gap-x-1"
                wordDelay={0.028}
                startDelayMs={100 + i * 60}
              />
            </ScrollReveal>
          ))}
          <ScrollReveal delay={160}>
            <TypewriterEffect
              as="p"
              text={odyssey.closing}
              className="text-silver-light font-medium mt-8 flex flex-wrap items-baseline gap-x-1"
              wordDelay={0.045}
              startDelayMs={160}
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {odyssey.images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gloss-mid/50 bg-gloss/30 hover:border-silver/30 transition-colors duration-300"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Chapter>

      {/* Contact */}
      <Chapter id="contact" className="py-24 md:py-32" minHeight={true}>
        <div ref={contactRef} className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <TypewriterEffect
              as="p"
              text="Connect"
              className="text-xs uppercase tracking-[0.25em] text-silver/60 mb-6 font-typewriter flex flex-wrap items-baseline justify-center gap-x-1"
              innerClassName="inline-flex flex-wrap justify-center gap-x-1 items-baseline"
              wordDelay={0.14}
            />
            <TypewriterEffect
              as="h2"
              text={contact.headline}
              className="section-title text-white mb-6 flex flex-wrap items-baseline justify-center gap-x-1 text-balance"
              innerClassName="inline-flex flex-wrap justify-center gap-x-1 gap-y-1 items-baseline"
              wordDelay={0.055}
              startDelayMs={160}
              showCursor
            />
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
            <TypewriterEffect
              as="p"
              text={`${identity.name} · ${identity.location}`}
              className="mt-12 text-silver/60 text-sm flex flex-wrap items-baseline justify-center gap-x-1"
              innerClassName="inline-flex flex-wrap justify-center gap-x-1 items-baseline"
              wordDelay={0.1}
              startDelayMs={400}
            />
          </ScrollReveal>
        </div>
      </Chapter>
      </div>
    </div>
  );
};

function CaseStudyCard({ project }: { project: CaseStudy }) {
  return (
    <article className="pointer-parallax-card border border-gloss-mid/40 rounded-xl p-6 md:p-8 bg-gloss/20 hover:border-graphite/40 transition-colors duration-500">
      <TypewriterEffect
        as="h3"
        text={project.title}
        className="text-lg font-display font-semibold text-white mb-4 flex flex-wrap items-baseline gap-x-1"
        wordDelay={0.08}
      />
      <div className="space-y-4 text-silver text-sm md:text-base leading-relaxed">
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Problem</span>
          <TypewriterEffect
            as="p"
            text={project.problem}
            className="mt-1 flex flex-wrap items-baseline gap-x-1"
            wordDelay={0.028}
            startDelayMs={80}
          />
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Approach</span>
          <TypewriterEffect
            as="p"
            text={project.approach}
            className="mt-1 flex flex-wrap items-baseline gap-x-1"
            wordDelay={0.028}
            startDelayMs={120}
          />
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Tech</span>
          <TypewriterEffect
            as="p"
            text={project.tech.join(' · ')}
            className="mt-1 flex flex-wrap items-baseline gap-x-1"
            wordDelay={0.06}
            startDelayMs={100}
          />
        </div>
        <div>
          <span className="text-silver/60 uppercase tracking-wider text-xs">Impact</span>
          <TypewriterEffect
            as="p"
            text={project.impact}
            className="mt-1 flex flex-wrap items-baseline gap-x-1"
            wordDelay={0.035}
            startDelayMs={100}
          />
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
