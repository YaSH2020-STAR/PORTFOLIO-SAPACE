import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { projects } from '../data/projectsData';
import ProjectDetailModal from '../components/ProjectDetailModal';
import type { Project } from '../data/projectsData';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="section-title">
            <span className="gradient-text">PROJECTS</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            A selection of projects spanning real-time systems, ML, and full-stack development.
          </p>
        </div>
      </section>

      {/* Project cards grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-dark p-6 rounded-lg flex flex-col hover:border border-gray-700 transition-all duration-300"
              >
                <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                  {project.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tools.slice(0, 6).map((tool) => (
                    <span
                      key={tool}
                      className="text-xs px-2 py-1 rounded bg-neon/20 text-neon border border-neon/40"
                    >
                      {tool}
                    </span>
                  ))}
                  {project.tools.length > 6 && (
                    <span className="text-xs text-gray-500">+{project.tools.length - 6}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="btn-primary text-center"
                  >
                    View Details
                  </button>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-neon hover:underline text-sm font-medium"
                    >
                      {project.linkLabel ?? 'Link'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectsPage;
