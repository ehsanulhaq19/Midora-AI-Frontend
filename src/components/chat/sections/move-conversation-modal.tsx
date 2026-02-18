"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useProjects } from "@/hooks";
import { t } from "@/i18n";
import { ActionButton } from "@/components/ui/buttons";

interface Project {
  uuid: string;
  name: string;
}

interface MoveConversationModalProps {
  isOpen: boolean;
  currentProjectUuid: string;
  onSelectProject: (project: Project) => void;
  onClose: () => void;
}

export const MoveConversationModal: React.FC<MoveConversationModalProps> = ({
  isOpen,
  currentProjectUuid,
  onSelectProject,
  onClose,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { loadProjects } = useProjects();

  const loadProjectsData = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const result = await loadProjects(page, 10);
        if (result) {
          const allProjects: Project[] = result.projects.map((item: any) => ({
            uuid: item.id,
            name: item.name,
          }));

          const otherProjects = allProjects.filter(
            (p) => p.uuid !== currentProjectUuid
          );

          if (page === 1) {
            setProjects(otherProjects);
            setFilteredProjects(otherProjects);
          } else {
            setProjects((prev) => [...prev, ...otherProjects]);
            setFilteredProjects((prev) => [...prev, ...otherProjects]);
          }

          setHasMore(result.pagination.page < result.pagination.total_pages);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentProjectUuid, loadProjects]
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setHasMore(true);
      loadProjectsData(1);
    }
  }, [isOpen]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasMore &&
        !isLoading
      ) {
        loadProjectsData(currentPage + 1);
      }
    },
    [hasMore, isLoading, currentPage, loadProjectsData]
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  if (!isOpen) return null;

  const displayedProjects =
    filteredProjects.length > 0 ? filteredProjects : projects;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[color:var(--tokens-color-surface-surface-primary)] rounded-2xl shadow-2xl border border-[color:var(--tokens-color-border-border-subtle)] flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-[color:var(--tokens-color-text-text-primary)]">
            {t("chat.selectProject")}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 px-6 py-4 overflow-hidden">
          {/* Search Input */}
          <div className="mb-4 flex-shrink-0">
            <input
              type="text"
              placeholder={t("chat.search")}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] placeholder-[color:var(--tokens-color-text-text-inactive-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-border-border-focus)] transition-all"
            />
          </div>

          {/* Projects List */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto space-y-1 min-h-0"
          >
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project) => (
                <ActionButton
                  key={project.uuid}
                  onClick={() => onSelectProject(project)}
                  variant="ghost"
                  className="!flex !items-center !justify-start !p-3 !rounded-lg !bg-transparent hover:!bg-[color:var(--tokens-color-surface-surface-secondary)] !text-left !w-full !h-auto transition-colors"
                  fullWidth
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[color:var(--tokens-color-text-text-primary)] truncate">
                      {project.name}
                    </p>
                  </div>
                </ActionButton>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                  {searchQuery ? "No projects found" : t("chat.noOtherProjects")}
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                  <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                    {t("chat.loadingProjects")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 flex gap-3 justify-end flex-shrink-0">
          <ActionButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="!px-4 !py-2"
          >
            {t("chat.cancel")}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

