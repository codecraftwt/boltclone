import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, Copy, Check, X } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useEditorStore } from '../../stores/editorStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatPanel: React.FC = () => {
  const { messages, isLoading, isOpen, addMessage, setLoading, setOpen } = useChatStore();
  const { openFile, createFile } = useEditorStore();
  const [input, setInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const responses = [
      `I can help you with that! Here's a React component that should work for your needs:

\`\`\`tsx
import React, { useState } from 'react';

export const ExampleComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Counter Example</h2>
      <p className="mb-4">Current count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
};
\`\`\`

This component demonstrates state management with hooks and includes proper TypeScript typing. Would you like me to explain any part of this code or help you modify it?`,

      `Based on your question, here's a solution using modern JavaScript patterns:

\`\`\`javascript
// Utility function for API calls
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage example
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

This includes proper error handling and follows modern async/await patterns. The function is reusable and provides good error information for debugging.`,

      `Great question! Here's how you can implement that feature:

\`\`\`css
/* Modern CSS with smooth animations */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 1.5rem;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.card-content {
  color: #4a5568;
  line-height: 1.6;
}
\`\`\`

This creates a clean, modern card design with smooth hover animations. The shadow and transform effects provide nice visual feedback when users interact with the elements.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });

    // Set loading state
    setLoading(true);

    try {
      const aiResponse = await simulateAIResponse(userMessage);
      
      // Add AI response
      addMessage({
        type: 'assistant',
        content: aiResponse
      });
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.type === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-green-400" />}
            </div>
            <span className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-200 border border-gray-700'
          }`}>
            <div className="whitespace-pre-wrap">
              {message.content.split(/```(\w+)?\n([\s\S]*?)```/g).map((part: string, i: number) => {
                if (i % 3 === 0) {
                  return <span key={i}>{part}</span>;
                } else if (i % 3 === 1) {
                  return null; // Language identifier
                } else {
                  const language = message.content.split(/```(\w+)?\n([\s\S]*?)```/g)[i - 1] || 'code';
                  const codeId = `${message.id}-${i}`;
                  
                  return (
                    <div key={i} className="my-3 relative">
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                          <span className="text-xs text-gray-400 font-mono">{language}</span>
                          <button
                            onClick={() => copyToClipboard(part, codeId)}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                          >
                            {copiedCode === codeId ? (
                              <>
                                <Check size={12} className="text-green-400" />
                                <span className="text-green-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-sm overflow-x-auto">
                          <code>{part}</code>
                        </pre>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col h-full"
        >
          <div className="border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} className="text-green-400" />
              <h2 className="text-white font-semibold">AI Assistant</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div 
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => renderMessage(message, index))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about coding, debugging, or project help..."
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};