import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { WebContainer } from '@webcontainer/api';

export const MonacoEditor = ({ webContainer }: { webContainer: WebContainer | null }) => {
  const { openTabs, activeTab, updateFileContent, markTabClean } = useEditorStore();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const activeTabData = openTabs.find(tab => tab.path === activeTab);

  const handleEditorChange = async (value: string | undefined) => {
    if (!activeTab || value === undefined) return;

    // Update local store
    updateFileContent(activeTab, value);

    // Write changes into WebContainer FS (so preview updates)
    if (webContainer) {
      try {
        await webContainer.fs.writeFile(activeTab, value);
      } catch (err) {
        console.error("Failed to write file to WebContainer:", err);
      }
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Mark tab clean after 2s of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      markTabClean(activeTab);
    }, 2000);
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      tsx: 'typescript',
      ts: 'typescript',
      jsx: 'javascript',
      js: 'javascript',
      json: 'json',
      css: 'css',
      scss: 'scss',
      html: 'html',
      md: 'markdown',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    return langMap[ext || ''] || 'plaintext';
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!activeTabData) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No file open</h3>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900">
      <Editor
        height="100%"
        language={getLanguage(activeTabData.name)}
        value={activeTabData.content}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
          wordWrap: 'on',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true
          }
        }}
        className="h-full w-full"
      />
    </div>
  );
};
