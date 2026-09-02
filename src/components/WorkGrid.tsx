import React, { useState } from 'react';
import { ArrowUpRight, ExternalLink, X } from 'lucide-react';
import { ProjectItem } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

export const WorkGrid: React.FC = () => {
  const { content } = useSiteContent();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const projectsList = content.projects || [];

  return (
    <section id="work" className="section relative z-10 container-custom">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="section-tag">Selected Work</div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)]">
            Featured Projects
          </h2>
        </div>
      </div>

      {/* Projects Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectsList.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative rounded-xl overflow-hidden cursor-pointer bg-neutral-900 border border-[var(--glass-border)] hover:border-[var(--accent)]/40 transition-all duration-500 shadow-xl min-h-[340px] sm:min-h-[400px]"
          >
            {/* Background Image */}
            <img
              src={project.image}
              alt={project.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end transition-opacity duration-300">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-medium mb-1.5">
                {project.category}
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-[var(--accent)] transition-colors">
                  {project.name}
                </h3>
                <div className="p-2.5 rounded-full bg-black/60 border border-white/20 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mt-2 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Project Detail */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-card w-full max-w-3xl p-6 sm:p-8 relative bg-[var(--bg-alt)] border border-[var(--accent)]/30 rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-[var(--accent)] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
                    {selectedProject.category}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold">{selectedProject.name}</h3>
                </div>
                <span className="font-mono text-xs text-gray-300">{selectedProject.year}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-muted)] font-light leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {selectedProject.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] text-xs font-mono text-[var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[var(--bg)] bg-[var(--accent)] px-6 py-3 rounded-full hover:shadow-[0_0_20px_var(--accent-glow)] transition-all"
              >
                <span>Visit Project Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
