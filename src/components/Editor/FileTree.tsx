import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2, Edit3 } from 'lucide-react';
import { FileNode } from '../../types';
import { useEditorStore } from '../../stores/editorStore';
import { motion, AnimatePresence } from 'framer-motion';

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (path: string, name: string, content: string) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, level, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const { selectedFile, createFile, deleteFile, renameFile } = useEditorStore();

  const isDirectory = node.type === 'directory';
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else if (node.content !== undefined) {
      onSelect(node.path, node.name, node.content);
    }
  };

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      const newPath = node.path.split('/').slice(0, -1).join('/') + '/' + editName.trim();
      renameFile(node.path, newPath);
    }
    setIsEditing(false);
    setEditName(node.name);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
      deleteFile(node.path);
    }
  };

  const handleAddFile = (e: React.MouseEvent, type: 'file' | 'directory') => {
    e.stopPropagation();
    const name = prompt(`Enter ${type} name:`);
    if (name?.trim()) {
      createFile(node.path, name.trim(), type);
      setIsExpanded(true);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer group hover:bg-gray-800 ${
          isSelected ? 'bg-blue-900 bg-opacity-50' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {isDirectory && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} className="text-gray-400" />
          </motion.div>
        )}
        
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {isDirectory ? (
            isExpanded ? <FolderOpen size={16} className="text-blue-400 flex-shrink-0" /> 
                       : <Folder size={16} className="text-blue-400 flex-shrink-0" />
          ) : (
            <File size={16} className="text-gray-400 flex-shrink-0" />
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              placeholder='File name '
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditName(node.name);
                }
              }}
              className="bg-gray-700 text-white text-sm px-1 py-0.5 rounded border-blue-500 border outline-none flex-1"
              autoFocus
            />
          ) : (
            <span className="text-gray-300 text-sm truncate">{node.name}</span>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isDirectory && (
            <>
              <button
                onClick={(e) => handleAddFile(e, 'file')}
                className="p-1 hover:bg-gray-700 rounded"
                title="Add file"
              >
                <Plus size={12} className="text-gray-400" />
              </button>
              <button
                onClick={(e) => handleAddFile(e, 'directory')}
                className="p-1 hover:bg-gray-700 rounded"
                title="Add folder"
              >
                <Folder size={12} className="text-gray-400" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-700 rounded"
            title="Rename"
          >
            <Edit3 size={12} className="text-gray-400" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-gray-700 rounded"
            title="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDirectory && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                level={level + 1}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileTree: React.FC = () => {
  const { files, openFile, createFile } = useEditorStore();

  const handleFileSelect = (path: string, name: string, content: string) => {
    openFile(path, name, content);
  };

  const handleAddFile = (type: 'file' | 'directory') => {
    const name = prompt(`Enter ${type} name:`);
    if (name?.trim()) {
      createFile('', name.trim(), type);
    }
  };

  return (
    <div className="bg-gray-900 h-full flex flex-col">
      <div className="border-b border-gray-700 px-3 py-2 flex items-center justify-between">
        <h2 className="text-gray-300 font-medium text-sm">Explorer</h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleAddFile('file')}
            className="p-1 hover:bg-gray-800 rounded"
            title="New file"
          >
            <Plus size={14} className="text-gray-400" />
          </button>
          <button
            onClick={() => handleAddFile('directory')}
            className="p-1 hover:bg-gray-800 rounded"
            title="New folder"
          >
            <Folder size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            level={0}
            onSelect={handleFileSelect}
          />
        ))}
      </div>
    </div>
  );
};