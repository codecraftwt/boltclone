import React from 'react';
import { Header } from './components/Layout/Header';
import { FileTree } from './components/Editor/FileTree';
import { TabManager } from './components/Editor/TabManager';
import { MonacoEditor } from './components/Editor/MonacoEditor';
import Terminal from './components/Terminal/Terminal';
import { ChatPanel } from './components/Chat/ChatPanel';
import { useAutoSave } from './hooks/useAutoSave';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { WebContainer } from '@webcontainer/api';
import { VITE_REACT_TEMPLATE } from './templates/react-vite';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { useEditorStore } from "./stores/editorStore";
import { initWebContainer, syncStoreToWebContainer } from './utils/writeWebcontainerfs';
import { useChatStore } from './stores/chatStore';
import PreviewPanel from './components/PreviewPanel/previewpanel';
import { useWebContainer } from './utils/useWebcontainers';




// function App() {
//    const { panelMode } = useChatStore();



//   // const [webContainer, setWebContainer] = React.useState<WebContainer | null>(null);
//   // const [isWebContainerLoading, setIsWebContainerLoading] = React.useState(true);


//    const { webContainer, isLoading: isWebContainerLoading } = useWebContainer();

//      const [serverUrl, setServerUrl] = React.useState<string>('');

//        useAutoSave();
//   useKeyboardShortcuts();

//   // React.useEffect(() => {
//   //   const createWebContainer = async () => {
//   //     const webContainerInstance = await WebContainer.boot();
//   //     await webContainerInstance.mount(VITE_REACT_TEMPLATE.files);

//   //     setWebContainer(webContainerInstance);
//   //   };

//   //   createWebContainer();
//   // }, []);


//   // React.useEffect(() => {
//   // const init = async () => {
//   //   const instance = await WebContainer.boot();
//   //   await syncStoreToWebContainer(instance);
//   //   setWebContainer(instance);
//   // };
//   //   init();
//   // }, []);



// //   React.useEffect(() => {
// //   const init = async () => {
// //     const instance = await WebContainer.boot();
// //     const container = await initWebContainer(instance);
// //     setWebContainer(container);
// //   };
// //   init();
// // }, []);

// // In App.tsx
//     // React.useEffect(() => {
//     // const init = async () => {
//     //   try {
//     //     setIsWebContainerLoading(true);
//     //     const instance = await WebContainer.boot();
//     //     const container = await initWebContainer(instance);
//     //     setWebContainer(container);
        
//     //     // Start the dev server immediately after initialization
//     //     try {
//     //       // Install dependencies
//     //       const installProcess = await container.spawn('npm', ['install']);
//     //       await installProcess.exit;
          
//     //       // Start dev server
//     //       await container.spawn('npm', ['run', 'dev']);
//     //     } catch (err) {
//     //       console.error('Failed to start dev server:', err);
//     //     }
//     //   } catch (error) {
//     //     console.error('Failed to initialize WebContainer:', error);
//     //   }finally{
//     //     setIsWebContainerLoading(false);
//     //   }
//     // };

//     // init();
//     // }, []);


//       const handleServerReady = (url: string) => {
//     setServerUrl(url);
//   };



//     // Show loading state while WebContainer is initializing
//   if (isWebContainerLoading) {
//     return (
//       <div className="h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-400">Initializing WebContainer...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
//       <Header />

//       <PanelGroup direction="horizontal" className="flex-1 min-h-0">
//         {/* Left Sidebar - File Explorer */}
//         <Panel defaultSize={20} minSize={15}>
//           <div className="h-full border-r border-gray-700">
//             <FileTree />
//           </div>
//         </Panel>
//         <PanelResizeHandle className="w-1 bg-gray-800 cursor-col-resize" />

//         {/* Middle Section (Editor + Terminal stacked) */}
//         <Panel defaultSize={55} minSize={30}>
//           <PanelGroup direction="vertical">
//             {/* Editor */}
//             <Panel defaultSize={70} minSize={40}>
//               <div className="flex flex-col h-full">
//                 <TabManager />
//                 <MonacoEditor webContainer={webContainer}/>
//               </div>
//             </Panel>
//             <PanelResizeHandle className="h-1 bg-gray-800 cursor-row-resize" />

//             {/* Terminal */}
//             <Panel defaultSize={30} minSize={20}>
//               <div className="h-full border-t border-gray-700">
//                 <Terminal webContainer={webContainer}  onServerReady={handleServerReady}/>
//               </div>
//             </Panel>
//           </PanelGroup>
//         </Panel>
//         <PanelResizeHandle className="w-1 bg-gray-800 cursor-col-resize" />

//         {/* Right Sidebar (Preview / Chat) */}
//         <Panel defaultSize={25} minSize={20}>
//           <div className="h-full border-l border-gray-700">
//             {/* <ChatPanel /> */}
//             {/* PreviewPanel */}
//              <div className="h-full border-l border-gray-700">
//               {panelMode === 'chat' && <ChatPanel />}
//               {panelMode === 'preview' && <PreviewPanel webContainer={webContainer} serverUrl={serverUrl} />}
//             </div>
//           </div>
//         </Panel>
//       </PanelGroup>
//     </div>
//   );
// }

// export default App;





// In App.tsx - Update the main component
function App() {
  const { panelMode } = useChatStore();
  const { webContainer, isLoading: isWebContainerLoading } = useWebContainer();
  const [serverUrl, setServerUrl] = React.useState<string>('');
  const [isServerReady, setIsServerReady] = React.useState(false);

  useAutoSave();
  useKeyboardShortcuts();

  // const handleServerReady = (url: string) => {
  //   console.log('Server ready callback:', url);
  //   setServerUrl(url);
  //   setIsServerReady(true);
  // };


  const handleServerReady = (url: string) => {
  // Clean ANSI escape codes from the URL
  const cleanUrl = url.replace(/\x1B\[[0-9;]*[mK]/g, '');
  console.log('Server ready callback (cleaned):', cleanUrl);
  setServerUrl(cleanUrl);
  setIsServerReady(true);
};
  // Show loading state while WebContainer is initializing
  if (isWebContainerLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing WebContainer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      <Header />

      <PanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left Sidebar - File Explorer */}
        <Panel defaultSize={20} minSize={15}>
          <div className="h-full border-r border-gray-700">
            <FileTree />
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-800 cursor-col-resize" />

        {/* Middle Section (Editor + Terminal stacked) */}
        <Panel defaultSize={55} minSize={30}>
          <PanelGroup direction="vertical">
            {/* Editor */}
            <Panel defaultSize={70} minSize={40}>
              <div className="flex flex-col h-full">
                <TabManager />
                <MonacoEditor webContainer={webContainer}/>
              </div>
            </Panel>
            <PanelResizeHandle className="h-1 bg-gray-800 cursor-row-resize" />

            {/* Terminal */}
            <Panel defaultSize={30} minSize={20}>
              <div className="h-full border-t border-gray-700">
                {webContainer && !isServerReady && (
                  <Terminal webContainer={webContainer} onServerReady={handleServerReady} />
                )}
                {isServerReady && (
                  <div className="h-full flex items-center justify-center bg-green-900 bg-opacity-20">
                    <div className="text-center">
                      <div className="text-green-400 mb-2">✓</div>
                      <p className="text-green-400">Server is running</p>
                      <p className="text-gray-400 text-sm">{serverUrl}</p>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-800 cursor-col-resize" />

        {/* Right Sidebar (Preview / Chat) */}
        <Panel defaultSize={25} minSize={20}>
          <div className="h-full border-l border-gray-700">
            {panelMode === 'chat' && <ChatPanel />}
            {panelMode === 'preview' && (
              <PreviewPanel webContainer={webContainer} serverUrl={serverUrl} />
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}


export default App;