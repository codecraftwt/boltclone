import { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useEditorStore } from '../stores/editorStore';

export const useAutoSave = () => {
  const { autoSave } = useProjectStore();
  const { openTabs } = useEditorStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const hasUnsavedChanges = openTabs.some(tab => tab.isDirty);
      if (hasUnsavedChanges) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [autoSave, openTabs]);
};