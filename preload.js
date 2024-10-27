const path = require("path");
const { contextBridge } = require("electron");

// Expose getMonacoPath to safely interact with the main process
contextBridge.exposeInMainWorld("monacoConfig", {
  getMonacoPath: () => {
    return path.join(__dirname, "node_modules", "monaco-editor", "min", "vs");
  }
});
