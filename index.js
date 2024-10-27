const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
const axios = require("axios");

require("dotenv").config(); // Load environment variables

let mainWindow;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log(backendUrl);

// Function to submit the paper when cheating is detected
async function submitPaper() {
  try {
    const start = await mainWindow.webContents.executeJavaScript('localStorage.getItem("start")');
    if (start !== "true") {
      console.log("Submission skipped: 'start' is not set to 'true'.");
      return;
    }

    const paperId = await mainWindow.webContents.executeJavaScript('localStorage.getItem("paperId")');
    if (!paperId) {
      console.error("Paper ID not found in localStorage.");
      return;
    }

  
    if (!backendUrl) {
      console.error("Backend URL is not defined. Check .env file.");
      return;
    }

    await axios.post(`${backendUrl}/student/submitPaper`, { paperId });
    console.log("Paper has been submitted because cheating has been detected.");
  } catch (error) {
    console.log(backendUrl);
    console.error("Error submitting paper:", error.message || error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Preload script
      nodeIntegration: false, // Security enhancement
      contextIsolation: true, // Isolates browser context
    },
  });

  // Clear localStorage before loading the URL
  mainWindow.webContents.executeJavaScript('localStorage.clear();')
    .then(() => console.log("Local storage cleared on app start"))
    .catch((error) => console.error("Error clearing local storage:", error));

  mainWindow.loadURL("http://localhost:3001");

  // Prevent right-click menu
  mainWindow.webContents.on("context-menu", (e) => e.preventDefault());

  // Event handler for losing window focus (cheating detection)
  mainWindow.on("blur", () => {
    submitPaper();
    setTimeout(() => mainWindow.focus(), 0); // Refocus the window
  });

  // Event handler for window close (submitting paper before closing)
  mainWindow.on("close", async (e) => {
    e.preventDefault();
    await submitPaper();
    app.quit();
  });
}

app.on("ready", () => {
  createWindow();
  Menu.setApplicationMenu(null); // Remove default menu

  // Global shortcuts to prevent exit keys
  const preventExitKeys = ["Alt+F4", "CommandOrControl+W", "F11"];
  preventExitKeys.forEach((key) => {
    globalShortcut.register(key, () => mainWindow.focus());
  });

  // Additional shortcut configurations for Windows (optional)
  if (process.platform === "win32") {
    globalShortcut.register("Alt+Tab", () => mainWindow.focus());
    globalShortcut.register("CommandOrControl+Tab", () => mainWindow.focus());
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
