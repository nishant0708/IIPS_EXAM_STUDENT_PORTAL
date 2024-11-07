// preload.js
const path = require("path");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("monacoConfig", {
  getMonacoPath: () => {
    return path.join(__dirname, "node_modules", "monaco-editor", "min", "vs");
  },
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
    send: (channel, data) => ipcRenderer.send(channel, data),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  },
});
