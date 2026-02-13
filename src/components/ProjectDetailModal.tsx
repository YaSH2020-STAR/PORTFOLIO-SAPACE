import React from 'react';
import { X, Server, Laptop, Monitor, ExternalLink } from 'lucide-react';
import type { Project } from '../data/projectsData';

type ProjectDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
};

const DiagramMqtt = ({ label }: { label: NonNullable<Project['diagramLabel']> }) => (
  <div className="flex items-center justify-center gap-2 py-6">
    <div className="flex flex-col items-center">
      <Server className="w-10 h-10 text-gray-600" />
      <span className="text-sm font-medium mt-1">{label.left ?? '1. Client'}</span>
    </div>
    <div className="flex flex-col items-center px-2">
      <span className="text-xs text-gray-500 mb-1">{label.flowRight ?? 'Publish'}</span>
      <div className="w-12 h-0.5 bg-gray-300 border-t border-dashed" />
      <div className="w-2 h-2 border-r border-t border-gray-500 transform rotate-45 translate-x-1" />
    </div>
    <div className="flex flex-col items-center">
      <Laptop className="w-10 h-10 text-gray-600" />
      <span className="text-sm font-medium mt-1">{label.center ?? '2. MQTT Broker'}</span>
    </div>
    <div className="flex flex-col items-center px-2">
      <span className="text-xs text-gray-500 mb-1">{label.flowLeft ?? 'Subscribe'}</span>
      <div className="w-12 h-0.5 bg-gray-300 border-t border-dashed" />
      <div className="w-2 h-2 border-r border-t border-gray-500 transform -rotate-135 translate-x-1" />
    </div>
    <div className="flex flex-col items-center">
      <Laptop className="w-10 h-10 text-gray-600" />
      <span className="text-sm font-medium mt-1">{label.right ?? '3. Server'}</span>
    </div>
  </div>
);

const DiagramWebapp = ({ label }: { label: NonNullable<Project['diagramLabel']> }) => (
  <div className="flex items-center justify-center gap-4 py-6">
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium text-gray-700">{label.left ?? 'User'}</span>
    </div>
    <div className="flex flex-col items-center px-2">
      <span className="text-xs text-gray-500">{label.flowRight ?? 'Actions'}</span>
      <div className="w-8 h-0.5 bg-gray-300 border-t border-dashed" />
    </div>
    <div className="flex flex-col items-center">
      <Monitor className="w-10 h-10 text-gray-600" />
      <span className="text-sm font-medium mt-1">{label.center ?? 'Web App'}</span>
    </div>
    <div className="flex flex-col items-center px-2">
      <span className="text-xs text-gray-500">{label.flowLeft ?? 'Data'}</span>
      <div className="w-8 h-0.5 bg-gray-300 border-t border-dashed" />
    </div>
    <div className="flex flex-col items-center">
      <Server className="w-10 h-10 text-gray-600" />
      <span className="text-sm font-medium mt-1">{label.right ?? 'Firebase'}</span>
    </div>
  </div>
);

const ProjectDetailModal = ({ isOpen, onClose, project }: ProjectDetailModalProps) => {
  if (!isOpen || !project) return null;

  const renderDiagram = () => {
    if (!project.diagramType) return null;
    const label = project.diagramLabel ?? {};
    if (project.diagramType === 'mqtt') return <DiagramMqtt label={label} />;
    if (project.diagramType === 'webapp') return <DiagramWebapp label={label} />;
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 pt-4 pb-3 flex justify-between items-start z-10">
          <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900 pr-8">
            {project.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">

          {project.diagramType && (
            <div className="border border-gray-200 rounded-lg bg-gray-50/50 mb-6">
              {renderDiagram()}
            </div>
          )}

          <p className="text-gray-700 mb-4">{project.overview}</p>

          <p className="text-sm text-gray-700 mb-4">
            <span className="font-semibold text-gray-900">Tools:</span>{' '}
            {project.tools.join(', ')}
          </p>

          <div className="space-y-1 text-sm text-gray-700 mb-4">
            {project.semester && <p>{project.semester}</p>}
            {project.teamSize != null && <p>Team size: {project.teamSize}</p>}
            {project.date && <p>Date: {project.date}</p>}
            {project.course && <p>Course: {project.course}</p>}
          </div>

          {project.details && project.details.length > 0 && (
            <div className="space-y-2 text-gray-700 text-sm">
              {project.details.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              {project.linkLabel ?? 'View project'}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
