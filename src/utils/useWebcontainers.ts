// // src/hooks/useWebContainer.ts
// import { WebContainer } from '@webcontainer/api';
// import { useState, useEffect } from 'react';
// import { useEditorStore } from '../stores/editorStore';
// import { FileNode } from '../types';

// // Correct type for WebContainer mount
// type WebContainerFileSystem = {
//   [path: string]: {
//     file: { contents: string };
//   } | {
//     directory: Record<string, never>; // Empty object for directories
//   };
// };

// export const useWebContainer = () => {
//   const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { files } = useEditorStore();

//   useEffect(() => {
//     let isMounted = true;

//     const initWebContainer = async () => {
//       try {
//         setIsLoading(true);
//         const instance = await WebContainer.boot();
        
//         // Convert file tree to WebContainer format with correct typing
//         const filesToMount: WebContainerFileSystem = {};
        
//         const processFiles = (nodes: FileNode[], basePath = '') => {
//           nodes.forEach(node => {
//             // Clean up the path
//             const cleanBasePath = basePath.replace(/^\/+|\/+$/g, '');
//             const cleanName = node.name.replace(/^\/+|\/+$/g, '');
            
//             const fullPath = cleanBasePath ? `${cleanBasePath}/${cleanName}` : cleanName;
            
//             if (node.type === 'file') {
//               // For files
//               filesToMount[fullPath] = {
//                 file: { 
//                   contents: node.content !== undefined ? node.content : '' 
//                 }
//               };
//             } else if (node.type === 'directory') {
//               // For directories
//               filesToMount[fullPath] = { directory: {} };
              
//               // Process children if they exist
//               if (node.children && node.children.length > 0) {
//                 processFiles(node.children, fullPath);
//               }
//             }
//           });
//         };
        
//         processFiles(files);
        
//         console.log('Mounting files to WebContainer:', Object.keys(filesToMount));
        
//         await instance.mount(filesToMount);
        
//         if (isMounted) {
//           setWebContainer(instance);
//           setIsLoading(false);
//         }
//       } catch (err) {
//         console.error('Failed to initialize WebContainer:', err);
//         if (isMounted) {
//           setError('Failed to initialize WebContainer: ' + (err instanceof Error ? err.message : String(err)));
//           setIsLoading(false);
//         }
//       }
//     };

//     initWebContainer();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return { webContainer, isLoading, error };
// };









// Debug version to identify the problematic file
import { WebContainer } from '@webcontainer/api';
import { useState, useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import { FileNode } from '../types';

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { files } = useEditorStore();

  useEffect(() => {
    let isMounted = true;

    const initWebContainer = async () => {
      try {
        setIsLoading(true);
        const instance = await WebContainer.boot();
        
        // Create file system manually with detailed error reporting
        const createFileSystem = async (nodes: FileNode[], basePath = '') => {
          for (const node of nodes) {
            try {
              const cleanBasePath = basePath.replace(/^\/+|\/+$/g, '');
              const cleanName = node.name.replace(/^\/+|\/+$/g, '');
              
              const fullPath = cleanBasePath ? `${cleanBasePath}/${cleanName}` : cleanName;
              
              console.log('Creating:', { type: node.type, path: fullPath });
              
              if (node.type === 'file') {
                // Ensure parent directory exists
                const dirPath = fullPath.split('/').slice(0, -1).join('/');
                if (dirPath) {
                  await instance.fs.mkdir(dirPath, { recursive: true });
                }
                
                // Write file content
                await instance.fs.writeFile(
                  fullPath, 
                  node.content !== undefined ? node.content : ''
                );
                
              } else if (node.type === 'directory') {
                // Create directory
                await instance.fs.mkdir(fullPath, { recursive: true });
                
                // Process children
                if (node.children && node.children.length > 0) {
                  await createFileSystem(node.children, fullPath);
                }
              }
            } catch (nodeError) {
              console.error(`Error creating ${node.name}:`, nodeError);
              throw new Error(`Failed to create ${node.name}: ${nodeError}`);
            }
          }
        };
        
        await createFileSystem(files);
        console.log('File system created successfully');
        
        if (isMounted) {
          setWebContainer(instance);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to initialize WebContainer:', err);
        if (isMounted) {
          setError('Failed to initialize WebContainer: ' + (err instanceof Error ? err.message : String(err)));
          setIsLoading(false);
        }
      }
    };

    initWebContainer();

    return () => {
      isMounted = false;
    };
  }, []);

  return { webContainer, isLoading, error };
};