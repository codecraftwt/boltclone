// // src/utils/writeWebcontainerfs.ts
// import type { WebContainer } from "@webcontainer/api";
// import { useEditorStore } from "../stores/editorStore";
// import { FileNode } from "../types";

// async function writeFilesToWebContainer(
//   webContainer: WebContainer,
//   files: FileNode[],
//   parentPath = ""
// ) {
//   for (const file of files) {
//     const filePath = parentPath ? `${parentPath}/${file.name}` : file.name;

//     if (file.type === "file") {
//       await webContainer.fs.writeFile(filePath, file.content || "");
//     } else if (file.type === "directory" && file.children) {
//       try {
//         await webContainer.fs.mkdir(filePath);
//       } catch {
//         // already exists, ignore
//       }
//       await writeFilesToWebContainer(webContainer, file.children, filePath);
//     }
//   }
// }


// export async function initWebContainer(webContainer: WebContainer) {
//   // 1. Sync files from editor store
//   await syncStoreToWebContainer(webContainer);

//   // 2. Install dependencies
//   const install = await webContainer.spawn("npm", ["install"]);
//   await install.exit;

//   // 3. Run Vite dev server with host
//   const server = await webContainer.spawn("npm", ["run", "dev"]);
//   server.output.pipeTo(
//     new WritableStream({
//       write(data) {
//         console.log(data); // optional: forward to Terminal
//       }
//     })
//   );

//   return webContainer;
// }


// export async function syncStoreToWebContainer(webContainer: WebContainer) {
//   const { files } = useEditorStore.getState();

//   console.log("Syncing files to WebContainer:", files);
//   await writeFilesToWebContainer(webContainer, files);
// }



// src/utils/writeWebcontainerfs.ts
import { WebContainer } from '@webcontainer/api';
import { useEditorStore } from '../stores/editorStore';

export async function initWebContainer(instance: WebContainer): Promise<WebContainer> {
  try {
    // Get files from store
    const { files } = useEditorStore.getState();
    
    // Convert file tree to flat structure for WebContainer
    const filesToMount: Record<string, { file: { contents: string } }> = {};
    
    const processFiles = (nodes: any[], path = '') => {
      nodes.forEach(node => {
        const fullPath = path ? `${path}/${node.name}` : node.name;
        
        if (node.type === 'file' && node.content !== undefined) {
          filesToMount[fullPath] = { file: { contents: node.content } };
        } else if (node.type === 'directory' && node.children) {
          processFiles(node.children, fullPath);
        }
      });
    };
    
    processFiles(files);
    
    // Mount files to WebContainer
    await instance.mount(filesToMount);
    
    return instance;
  } catch (error) {
    console.error('Failed to initialize WebContainer:', error);
    throw error;
  }
}

export async function syncStoreToWebContainer(instance: WebContainer): Promise<void> {
  const { files } = useEditorStore.getState();
  
  // Update WebContainer files when store changes
  useEditorStore.subscribe((state) => {
    // This will be called whenever the store updates
    // You might want to implement a more efficient sync mechanism
    console.log('Store updated, syncing with WebContainer...');
  });
}