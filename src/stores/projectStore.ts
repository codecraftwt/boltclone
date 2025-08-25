import { create } from 'zustand';
import { Project } from '../types';

interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  isSaving: boolean;
  lastSaved: Date | null;
  createProject: (name: string) => void;
  loadProject: (id: string) => void;
  saveProject: () => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  autoSave: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],
  isSaving: false,
  lastSaved: null,

  createProject: (name) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: []
    };
    
    const { projects } = get();
    set({
      projects: [...projects, newProject],
      currentProject: newProject
    });
  },

  loadProject: (id) => {
    const { projects } = get();
    const project = projects.find(p => p.id === id);
    if (project) {
      set({ currentProject: project });
    }
  },

  saveProject: () => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({ isSaving: true });
    
    // Simulate save operation
    setTimeout(() => {
      set({
        isSaving: false,
        lastSaved: new Date()
      });
    }, 1000);
  },

  deleteProject: (id) => {
    const { projects, currentProject } = get();
    const updatedProjects = projects.filter(p => p.id !== id);
    const newCurrentProject = currentProject?.id === id ? null : currentProject;
    
    set({
      projects: updatedProjects,
      currentProject: newCurrentProject
    });
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  autoSave: () => {
    const { saveProject } = get();
    saveProject();
  }
}));