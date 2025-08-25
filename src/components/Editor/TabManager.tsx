import React from 'react';
import { X } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { motion, AnimatePresence } from 'framer-motion';

export const TabManager: React.FC = () => {
  const { openTabs, activeTab, setActiveTab, closeTab } = useEditorStore();

  if (openTabs.length === 0) return null;

  return (
    <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
      <AnimatePresence>
        {openTabs.map((tab) => (
          <motion.div
            key={tab.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`flex items-center space-x-2 px-4 py-2 border-r border-gray-700 cursor-pointer group min-w-0 ${
              activeTab === tab.path 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab(tab.path)}
          >
            <span className="text-sm truncate max-w-[150px]">
              {tab.name}
              {tab.isDirty && <span className="ml-1 text-orange-400">•</span>}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.path);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded transition-all"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};