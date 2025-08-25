import React from 'react';
import { Play, Square, Save, FolderOpen, Settings, MessageSquare } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useChatStore } from '../../stores/chatStore';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { currentProject, saveProject, isSaving, lastSaved } = useProjectStore();
  const { togglePanel,panelMode } = useChatStore();

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-white font-semibold text-lg">CodeStudio</h1>
        </div>
        
        <nav className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
            <FolderOpen size={16} />
            <span className="text-sm">Open</span>
          </button>
          
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span className="text-sm">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {lastSaved && (
          <span className="text-xs text-gray-400">
            Last saved: {formatLastSaved(lastSaved)}
          </span>
        )}
        
        {/* <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
            <Play size={16} />
          </button>
          <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
            <Square size={14} />
          </button>
        </div> */}

        <motion.button
          onClick={() => togglePanel('chat')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg transition-colors ${
            panelMode === 'chat'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
          }`}
        >
          <MessageSquare size={16} />
        </motion.button>

        <button
          onClick={() => togglePanel('preview')}
          className={`p-2 rounded-lg transition-colors flex justify-content-center align-items-center gap-2 ${
            panelMode === 'preview'
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
          }`}
        >
        <Play size={16} />
        </button>

        <button className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};