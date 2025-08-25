import { create } from 'zustand';
import { TerminalCommand } from '../types';

interface TerminalStore {
  commands: TerminalCommand[];
  isRunning: boolean;
  currentDirectory: string;
  addCommand: (command: string) => void;
  updateCommand: (id: string, output: string, status: 'success' | 'error' | 'running') => void;
  clearTerminal: () => void;
  setRunning: (running: boolean) => void;
}

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  commands: [],
  isRunning: false,
  currentDirectory: '/',

  addCommand: (command) => {
    const { commands } = get();
    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command,
      output: '',
      timestamp: new Date(),
      status: 'running'
    };
    
    set({ commands: [...commands, newCommand], isRunning: true });

    // Simulate command execution
    setTimeout(() => {
      const { updateCommand } = get();
      let output = '';
      let status: 'success' | 'error' = 'success';

      if (command.startsWith('npm install')) {
        output = 'Installing dependencies...\n✓ Dependencies installed successfully';
      } else if (command.startsWith('npm run')) {
        output = 'Starting development server...\n✓ Server running on http://localhost:3000';
      } else if (command === 'ls' || command === 'dir') {
        output = 'src/\npackage.json\nREADME.md\nnode_modules/';
      } else if (command.startsWith('node ')) {
        output = 'Hello World!\n✓ Script executed successfully';
      } else if (command === 'clear') {
        set({ commands: [] });
        return;
      } else {
        output = `Command '${command}' executed`;
      }

      updateCommand(newCommand.id, output, status);
    }, Math.random() * 2000 + 1000);
  },

  updateCommand: (id, output, status) => {
    const { commands } = get();
    const updatedCommands = commands.map(cmd =>
      cmd.id === id ? { ...cmd, output, status } : cmd
    );
    
    set({ 
      commands: updatedCommands,
      isRunning: status === 'running'
    });
  },

  clearTerminal: () => set({ commands: [] }),

  setRunning: (running) => set({ isRunning: running })
}));