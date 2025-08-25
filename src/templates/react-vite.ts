import type { FileNode } from '@webcontainer/api';
 
export type Template = {
  files: Record<string, FileNode>;
  entry: string;
  visibleFiles: string[];
};
 
export const VITE_REACT_TEMPLATE: Template = {
  files: {
    'App.jsx': {
      file: {
        contents: `export default function App() {
    const data = "world"
  
    return <h1>Hello {data}</h1>
  }
  `,
      },
    },
 
    'index.jsx': {
      file: {
        contents: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
 
import App from "./App";
 
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      },
    },
 
    'index.html': {
      file: {
        contents: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/index.jsx"></script>
    </body>
  </html>
  `,
      },
    },
 
    'package.json': {
      file: {
        contents: `{
      "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
      },
      "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
      },
      "devDependencies": {
          "@vitejs/plugin-react": "3.1.0",
          "vite": "4.1.4",
          "esbuild-wasm": "0.17.12"
      }
  }`,
      },
    },
    'vite.config.js': {
      file: {
        contents: `import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  
  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
  });
  `,
      },
    },
  },
  entry: 'App.jsx',
  visibleFiles: ['App.jsx', 'index.jsx', 'index.html'],
};