import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Mail,
  Linkedin,
  FileText,
  ExternalLink,
  Wrench,
  Cpu,
  Factory,
  LayoutGrid,
  GraduationCap,
  Briefcase,
  FolderKanban,
} from 'lucide-react';
import {
  mechanicalIdentity,
  mechanicalEducation,
  mechanicalSkills,
  mechanicalProjects,
  mechanicalExperience,
} from '../../data/mechanicalPortfolioData';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function SectionHeading({
  label,
  title,
  icon: Icon,
}: {
  label: string;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-mech-cyan/10 text-mech-cyan border border-mech-cyan/20">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-mech-cyan/80">
          {label}
        </p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>
    </div>
  );
}

const MechanicalGenZPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-mech-bg text-mech-silver relative overflow-x-hidden"
    >
      {/* Blueprint grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-mech-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-[400px] h-[400px] bg-mech-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.header
          style={{ opacity: heroOpacity, y: heroY }}
          className="pt-28 pb-20 sm:pt-36 sm:pb-28"
        >
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.35em] text-mech-cyan mb-4"
          >
            Mechanical Engineering · ASU
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-[1.05] mb-4"
          >
            {mechanicalIdentity.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-lg sm:text-xl text-mech-silver max-w-xl mb-8"
          >
            {mechanicalIdentity.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 text-sm"
          >
            <a
              href={`mailto:${mechanicalIdentity.email}`}
              className="inline-flex items-center gap-2 text-mech-silver hover:text-mech-cyan transition-colors"
            >
              <Mail className="w-4 h-4" />
              {mechanicalIdentity.email}
            </a>
            <span className="text-mech-graphite">·</span>
            <span className="font-mono text-mech-silver/80">{mechanicalIdentity.phone}</span>
            <span className="text-mech-graphite">·</span>
            <span className="text-mech-silver/70">{mechanicalIdentity.location}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <a
              href={mechanicalIdentity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mech-card border border-mech-border hover:border-mech-cyan/40 hover:text-mech-cyan transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={mechanicalIdentity.publication}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-mech-card border border-mech-border hover:border-mech-orange/40 hover:text-mech-orange transition-all"
            >
              <FileText className="w-4 h-4" />
              Publication
            </a>
          </motion.div>
        </motion.header>

        {/* Education */}
        <section className="py-16 sm:py-20">
          <SectionHeading label="01" title="Education" icon={GraduationCap} />
          <div className="space-y-6">
            {mechanicalEducation.map((edu, i) => (
              <motion.article
                key={i}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-mech-border bg-mech-card/50 p-6 sm:p-8 hover:border-mech-cyan/20 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-display font-semibold text-white">
                    {edu.degree}
                  </h3>
                  <span className="font-mono text-xs text-mech-cyan/90">{edu.period}</span>
                </div>
                <p className="text-mech-silver/90 font-medium mb-2">{edu.school}</p>
                <p className="text-sm text-mech-silver/70">{edu.coursework}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Skills – Bento grid */}
        <section className="py-16 sm:py-20">
          <SectionHeading label="02" title="Skills & Certifications" icon={LayoutGrid} />
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <SkillCard
              title="Design, CAD & Simulation"
              icon={Wrench}
              items={[...mechanicalSkills.design]}
              accent="cyan"
            />
            <SkillCard
              title="Manufacturing & Quality"
              icon={Factory}
              items={[...mechanicalSkills.manufacturing]}
              accent="orange"
            />
            <SkillCard
              title="Automation & Controls"
              icon={Cpu}
              items={[...mechanicalSkills.automation]}
              accent="cyan"
            />
            <SkillCard
              title="Project Management"
              icon={LayoutGrid}
              items={[...mechanicalSkills.projectMgmt]}
              accent="orange"
            />
          </motion.div>
        </section>

        {/* Experience */}
        <section className="py-16 sm:py-20">
          <SectionHeading label="03" title="Experience" icon={Briefcase} />
          <div className="space-y-8">
            {mechanicalExperience.map((exp, i) => (
              <motion.article
                key={i}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-mech-border bg-mech-card/50 p-6 sm:p-8 hover:border-mech-graphite/60 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <h3 className="text-lg font-display font-semibold text-white">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs text-mech-orange/90">{exp.period}</span>
                </div>
                <p className="text-mech-cyan/90 font-medium mb-4">{exp.company}</p>
                <ul className="space-y-2 text-sm text-mech-silver/90">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-mech-cyan/70 mt-1.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Projects – with links */}
        <section className="py-16 sm:py-20 pb-28">
          <SectionHeading label="04" title="Projects" icon={FolderKanban} />
          <div className="space-y-8">
            {mechanicalProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-mech-border bg-mech-card/50 p-6 sm:p-8 hover:border-mech-cyan/25 transition-colors group"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-mech-cyan/90 transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-mech-silver/60 shrink-0">
                    {project.period}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-mech-silver/90 mb-6">
                  {project.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-mech-cyan/60 mt-1.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-mech-cyan hover:text-mech-cyan/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {project.linkLabel}
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

function SkillCard({
  title,
  icon: Icon,
  items,
  accent,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
  accent: 'cyan' | 'orange';
}) {
  const isCyan = accent === 'cyan';
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-xl border p-5 sm:p-6 transition-colors ${
        isCyan
          ? 'border-mech-cyan/20 bg-mech-cyan/5 hover:border-mech-cyan/30'
          : 'border-mech-orange/20 bg-mech-orange/5 hover:border-mech-orange/30'
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-3 ${
          isCyan ? 'text-mech-cyan' : 'text-mech-orange'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-block px-2 py-0.5 rounded text-xs bg-mech-card/80 text-mech-silver/90 border border-mech-border"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default MechanicalGenZPage;
