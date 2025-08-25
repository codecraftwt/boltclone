import { create } from "zustand";
import { ChatMessage } from "../types";

// src/stores/chatStore.ts
type PanelMode = "chat" | "preview" | null;

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  panelMode: PanelMode;
   isOpen ?: boolean; // Add this
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  togglePanel: (mode: PanelMode) => void;
  closePanel: () => void;
  setOpen : (open: boolean) => void; // Add this
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm your AI coding assistant...",
      timestamp: new Date(),
    },
  ],
  isLoading: false,
  panelMode: null,

  addMessage: (message: any) => {
    const { messages } = get();
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    set({ messages: [...messages, newMessage] });
  },

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading: any) => set({ isLoading: loading }),

  togglePanel: (mode: any) => {
    const { panelMode } = get();
    set({ panelMode: panelMode === mode ? null : mode }); // toggle same, switch if different
  },

  closePanel: () => set({ panelMode: null }),
  setOpen: (open) => set({ isOpen: open }),
}));
