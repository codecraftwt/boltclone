import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { useProjectStore } from '../stores/projectStore';
import { useChatStore } from '../stores/chatStore';

export const useKeyboardShortcuts = () => {
  const { closeTab, activeTab } = useEditorStore();
  const { saveProject } = useProjectStore();
  const { togglePanel } = useChatStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Save project (Ctrl/Cmd + S)
      if (cmdOrCtrl && e.key === 's') {
        e.preventDefault();
        saveProject();
        return;
      }

      // Close tab (Ctrl/Cmd + W)
      if (cmdOrCtrl && e.key === 'w' && activeTab) {
        e.preventDefault();
        closeTab(activeTab);
        return;
      }

      // Toggle chat panel (Ctrl/Cmd + Shift + C)
      if (cmdOrCtrl && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        togglePanel();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeTab, activeTab, saveProject, togglePanel]);
};