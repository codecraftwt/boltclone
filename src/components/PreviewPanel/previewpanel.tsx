// // src/components/PreviewPanel/previewpanel.tsx
// import { WebContainer } from "@webcontainer/api";
// import React, { useState, useEffect } from "react";

// export default function PreviewPanel({
//   webContainer,
//   serverUrl,
// }: {
//   webContainer: WebContainer | null;
//   serverUrl?: string;
// }) {
//   const iframeRef = React.useRef<HTMLIFrameElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentUrl, setCurrentUrl] = useState<string>('');

//   useEffect(() => {
//     if (serverUrl && serverUrl !== currentUrl) {
//       console.log('Setting server URL from prop:', serverUrl);
//       setCurrentUrl(serverUrl);
//       if (iframeRef.current) {
//         iframeRef.current.src = serverUrl;
//         setIsLoading(false);
//       }
//     }
//   }, [serverUrl, currentUrl]);

//   React.useEffect(() => {
//     if (!webContainer) return;

//     const handleServerReady = (port: number, url: string) => {
//       console.log('WebContainer server-ready event received:', url);
//       setCurrentUrl(url);
//       if (iframeRef.current) {
//         iframeRef.current.src = url;
//         setIsLoading(false);
//       }
//     };

//     // Listen for server-ready events
//     webContainer.on('server-ready', handleServerReady);

//     // Cleanup function
//     return () => {
//       // Note: WebContainer doesn't have off() method, but we can use this pattern
//       // to prevent memory leaks in our component
//     };
//   }, [webContainer]);

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-2 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
//         <h1 className="text-white font-medium">Preview</h1>
//         {currentUrl && (
//           <a 
//             href={currentUrl} 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="text-blue-400 text-sm hover:text-blue-300"
//           >
//             Open in new tab
//           </a>
//         )}
//       </div>
      
//       {isLoading && (
//         <div className="flex-1 flex items-center justify-center bg-gray-900">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-400">Waiting for server to start...</p>
//             {currentUrl && (
//               <p className="text-gray-500 text-sm mt-2">Server URL: {currentUrl}</p>
//             )}
//           </div>
//         </div>
//       )}
      
//       <iframe
//         name="Preview"
//         title="Preview"
//         ref={iframeRef}
//         className="h-full w-full bg-white"
//         sandbox="allow-same-origin allow-scripts"
//         onLoad={() => {
//           console.log('iframe loaded successfully');
//           setIsLoading(false);
//         }}
//         onError={() => {
//           console.log('iframe loading error');
//           setIsLoading(true);
//           // Retry after a delay
//           setTimeout(() => {
//             if (iframeRef.current && currentUrl) {
//               iframeRef.current.src = currentUrl;
//             }
//           }, 2000);
//         }}
//       />
//     </div>
//   );
// }



// src/components/PreviewPanel/previewpanel.tsx
import { WebContainer } from "@webcontainer/api";
import React, { useState, useEffect } from "react";

// Function to remove ANSI escape codes
const removeAnsiCodes = (str: string): string => {
  return str.replace(/\x1B\[[0-9;]*[mK]/g, '');
};

export default function PreviewPanel({
  webContainer,
  serverUrl,
}: {
  webContainer: WebContainer | null;
  serverUrl?: string;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (serverUrl) {
      // Clean ANSI escape codes from the URL
      const cleanUrl = removeAnsiCodes(serverUrl);
      if (cleanUrl !== currentUrl) {
        console.log('Setting clean server URL:', cleanUrl);
        setCurrentUrl(cleanUrl);
        if (iframeRef.current) {
          iframeRef.current.src = cleanUrl;
          setIsLoading(false);
        }
      }
    }
  }, [serverUrl, currentUrl]);

  React.useEffect(() => {
    if (!webContainer) return;

    const handleServerReady = (port: number, url: string) => {
      console.log('WebContainer server-ready event received:', url);
      setCurrentUrl(url);
      if (iframeRef.current) {
        iframeRef.current.src = url;
        setIsLoading(false);
      }
    };

    webContainer.on('server-ready', handleServerReady);

    return () => {
      // Cleanup if needed
    };
  }, [webContainer]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
        <h1 className="text-white font-medium">Preview</h1>
        {currentUrl && (
          <a 
            href={currentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            Open in new tab
          </a>
        )}
      </div>
      
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Waiting for server to start...</p>
            {currentUrl && (
              <p className="text-gray-500 text-sm mt-2">Server URL: {currentUrl}</p>
            )}
          </div>
        </div>
      )}
      
      <iframe
        name="Preview"
        title="Preview"
        ref={iframeRef}
        className="h-full w-full bg-white"
        sandbox="allow-same-origin allow-scripts"
        onLoad={() => {
          console.log('iframe loaded successfully');
          setIsLoading(false);
        }}
        onError={(e) => {
          console.log('iframe loading error', e);
          setIsLoading(true);
          // Retry after a delay with a clean URL
          setTimeout(() => {
            if (iframeRef.current && currentUrl) {
              const cleanUrl = removeAnsiCodes(currentUrl);
              iframeRef.current.src = cleanUrl;
            }
          }, 2000);
        }}
      />
    </div>
  );
}