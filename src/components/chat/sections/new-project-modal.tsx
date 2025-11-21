"use client";

import React from "react";
import { NewFolderModal } from "@/components/ui";
import { Investing, Homework, Writing, Health, Travel } from "@/icons";
import { t } from "@/i18n";

interface Project {
  id: string;
  name: string;
  category?: string;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (project: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = (projectName: string, selectedCategory?: string) => {
    if (projectName.trim()) {
      const newProject: Project = {
        id: `folder-${Date.now()}`,
        name: projectName.trim(),
        category: selectedCategory,
      };
      onConfirm(newProject);
    }
  };

  return (
    <NewFolderModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("chat.newFolder") || "Project name"}
      placeholder="Copenhagen Trip"
      infoText="Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy."
      buttonText="Create project"
      showText={true}
      showInput={true}
      showButton={true}
      categories={[
        {
          id: "investing",
          label: "Investing",
          icon: <Investing className="w-4 h-4" color="#10b981" />,
        },
        {
          id: "homework",
          label: "Homework",
          icon: <Homework className="w-4 h-4" color="#3b82f6" />,
        },
        {
          id: "writing",
          label: "Writing",
          icon: <Writing className="w-4 h-4" color="#8b5cf6" />,
        },
        {
          id: "health",
          label: "Health",
          icon: <Health className="w-4 h-4" color="#ef4444" />,
        },
        {
          id: "travel",
          label: "Travel",
          icon: <Travel className="w-4 h-4" color="#eab308" />,
        },
      ]}
      onConfirm={handleConfirm}
    />
  );
};

