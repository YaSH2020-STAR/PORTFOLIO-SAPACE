import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { contact } from '../../data/portfolioData';

const ContactPage: React.FC = () => {
  return (
    <main className="pt-24 pb-20 min-h-[70vh] flex flex-col items-center justify-center">
      <section className="chapter-section text-center">
        <h1 className="section-title text-white mb-6">{contact.headline}</h1>
        <div className="flex flex-wrap justify-center gap-8 text-silver">
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
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
