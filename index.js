const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const axios = require('axios'); // Add axios for HTTP requests

let mainWindow;

async function submitPaper() {
  const start = await mainWindow.webContents.executeJavaScript('localStorage.getItem("start")');

  // Proceed with submission only if "start" is true
  if (start === "true") {
    const paperId = await mainWindow.webContents.executeJavaScript('localStorage.getItem("paperId")');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/student/submitPaper`, { paperId });
      console.log("Paper has been submitted because cheating has been detected.");
    } catch (error) {
      console.error("Error submitting paper:", error);
    }
  } else {
    console.log("Submission skipped: 'start' is not true.");
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.on('context-menu', (e) => e.preventDefault());
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    // On losing focus, submit the paper and refocus the window
    submitPaper();
    setTimeout(() => mainWindow.focus(), 0);
  });

  mainWindow.on('close', async (e) => {
    e.preventDefault(); // Prevent default close
    await submitPaper(); // Submit the paper if conditions are met
    app.quit(); // Quit the app after submission
  });
}

app.on('ready', () => {
  createWindow();
  Menu.setApplicationMenu(null);

  // Registering global shortcuts to prevent common exit keys
  const preventExitKeys = ['Alt+F4', 'CommandOrControl+W', 'F11'];
  preventExitKeys.forEach((key) => {
    globalShortcut.register(key, () => mainWindow.focus());
  });

  if (process.platform === 'win32') {
    globalShortcut.register('Alt+Tab', () => mainWindow.focus());
    globalShortcut.register('CommandOrControl+Tab', () => mainWindow.focus());
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
