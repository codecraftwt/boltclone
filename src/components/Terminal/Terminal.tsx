// src/components/Terminal/Terminal.tsx
import type { WebContainer } from '@webcontainer/api';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal as XTerminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import React from 'react';
import useResizeObserver from 'use-resize-observer';

export default function Terminal({
  webContainer,
  onServerReady,
}: {
  webContainer: WebContainer | null;
  onServerReady?: (url: string) => void;
}) {
  const [terminal, setTerminal] = React.useState<XTerminal | null>(null);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const fitAddonRef = React.useRef<FitAddon | null>(null);
  const isServerStartedRef = React.useRef(false); // Add this ref to track server state

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    },
  });

  React.useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new XTerminal({ convertEol: true });
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    setTerminal(terminal);

    fitAddon.fit();

    return () => {
      terminal.dispose();
      setTerminal(null);
    };
  }, [terminalRef]);

  // React.useEffect(() => {
  //   if (!webContainer || !terminal || isServerStartedRef.current) return;

  //   const startShell = async () => {
  //     try {
  //       isServerStartedRef.current = true; // Mark server as started
        
  //       // First, install dependencies
  //       terminal.write('Installing dependencies...\r\n');
  //       const installProcess = await webContainer.spawn('npm', ['install']);
        
  //       installProcess.output.pipeTo(
  //         new WritableStream({
  //           write(data) {
  //             terminal.write(data);
  //           },
  //         })
  //       );
        
  //       const installExitCode = await installProcess.exit;
  //       if (installExitCode !== 0) {
  //         terminal.write('Dependency installation failed\r\n');
  //         return;
  //       }
        
  //       terminal.write('Dependencies installed successfully\r\n');
        
  //       // Now start the dev server
  //       terminal.write('Starting development server...\r\n');
  //       const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
        
  //       devProcess.output.pipeTo(
  //         new WritableStream({
  //           write(data) {
  //             terminal.write(data);
  //             // Check if server is ready from terminal output
  //             // if (data.includes('Local:') || data.includes('http://localhost')) {
  //             //   const urlMatch = data.match(/http:\/\/[^\s]+/);
  //             //   if (urlMatch && onServerReady) {
  //             //     onServerReady(urlMatch[0]);
  //             //   }
  //             // }

  //             if (data.includes('Local:') || data.includes('http://localhost')) {
  //             // Clean ANSI escape codes from the URL
  //             const cleanData = data.replace(/\x1B\[[0-9;]*[mK]/g, '');
  //             const urlMatch = cleanData.match(/http:\/\/[^\s]+/);
  //             if (urlMatch && onServerReady) {
  //               onServerReady(urlMatch[0]);
  //             }
  //           }
  //           },
  //         })
  //       );

  //       // Listen for server-ready event from WebContainer
  //       webContainer.on('server-ready', (port, url) => {
  //         console.log('WebContainer server-ready event:', url);
  //         if (onServerReady) {
  //           onServerReady(url);
  //         }
  //       });

  //     } catch (error) {
  //       console.error('Failed to start processes:', error);
  //       terminal.write('Failed to start processes. Please try again.\r\n');
  //       isServerStartedRef.current = false; // Reset on error
  //     }
  //   };

  //   startShell();
  // }, [webContainer, terminal, onServerReady]);


  // In Terminal.tsx - Simplify to use only WebContainer events
React.useEffect(() => {
  if (!webContainer || !terminal || isServerStartedRef.current) return;

  const startShell = async () => {
    try {
      isServerStartedRef.current = true;
      
      // Listen for server-ready event from WebContainer
      webContainer.on('server-ready', (port, url) => {
        console.log('WebContainer server-ready event:', url);
        if (onServerReady) {
          onServerReady(url);
        }
      });

      // Install dependencies
      terminal.write('Installing dependencies...\r\n');
      const installProcess = await webContainer.spawn('npm', ['install']);
      
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );
      
      await installProcess.exit;
      terminal.write('Dependencies installed successfully\r\n');
      
      // Start dev server
      terminal.write('Starting development server...\r\n');
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      
      // Just pipe output to terminal, don't try to parse URLs
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

    } catch (error) {
      console.error('Failed to start processes:', error);
      terminal.write('Failed to start processes. Please try again.\r\n');
      isServerStartedRef.current = false;
    }
  };

  startShell();
}, [webContainer, terminal, onServerReady]);

  return (
    <div className="h-full border bg-red-100" ref={ref}>
      <div className="h-full w-full" ref={terminalRef} />
    </div>
  );
}