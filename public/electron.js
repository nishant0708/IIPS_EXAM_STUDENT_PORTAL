const { app, BrowserWindow, Menu, globalShortcut, /*dialog*/ } = require("electron");
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");

require("dotenv").config();

let mainWindow;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
let isSubmitting = false;

const isPackaged = app.isPackaged;
const ahkScriptPath = isPackaged
  ? path.join(process.resourcesPath, "app.asar.unpacked", "resources", "disable_keys.ahk")
  : path.join(__dirname, "resources", "disable_keys.ahk");          // For development

  console.log("AHK script path:", ahkScriptPath);


// Function to check if AutoHotkey is running
// function checkAutoHotkeyRunning() {
  
//   exec('tasklist /FI "IMAGENAME eq AutoHotkey Unicode 64-bit"', (error, stdout) => {
//     if (error || !stdout.includes("AutoHotkey.exe")) {
//       console.error("AutoHotkey is not running or not detected.");
//       dialog.showErrorBox("AHK Alert", "AutoHotkey is not running. Please start it before launching the app.");
//       process.exit(1); // Exit the application if AHK is not running
//     } else {
//       console.log("AutoHotkey is running.");
//     }
//   });
// }

// // Run the check before creating the Electron window
// checkAutoHotkeyRunning();

exec(`start "" "${ahkScriptPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting AHK script: ${error.message}`);
    console.log(stdout, stderr);
    return;
  }
  console.log("AHK script started successfully.");
});

function terminateAutoHotkeyProcesses() {
  exec('taskkill /IM AutoHotkey64.exe /F', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error terminating AutoHotkey64: ${error.message}`);
      console.log(stdout, stderr);
    } else {
      console.log("AutoHotkey64 terminated successfully.");
    }
  });
  exec('taskkill /IM AutoHotkeyU64.exe /F', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error terminating AutoHotkeyU64: ${error.message}`);
      console.log(stdout, stderr);
    } else {
      console.log("AutoHotkeyU64 terminated successfully.");
    }
  });
  exec('taskkill /IM AutoHotkey32.exe /F', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error terminating AutoHotkey32: ${error.message}`);
      console.log(stdout, stderr);
    } else {
      console.log("AutoHotkey32 terminated successfully.");
    }
  });
}

const processesToClose = [

  "discord.exe",
  "zoom.exe",
  "Teams.exe",
  "Telegram.exe",
  "WhatsApp.exe",
  "Viber.exe",
  "Slack.exe",
  "Skype.exe",
  "WeChat.exe",
  "Line.exe",
  "Messenger.exe",         
  "Signal.exe",
  "WINWORD.exe",

  "chrome.exe",
  "msedge.exe",
  "firefox.exe",
  "opera.exe",
  "brave.exe",
  "Safari.exe",
  "vivaldi.exe",
  "chromium.exe",

  "spotify.exe",
  "YouTube.exe",           
  "Netflix.exe",
  "PrimeVideo.exe",
  "Twitch.exe",
  "Hulu.exe",
  "DisneyPlus.exe",
  "TikTok.exe",
  "Snapchat.exe",
  "RiotClientServices.exe",
  "steam.exe",
  "EpicGamesLauncher.exe",


  "TeamViewer.exe",
  "AnyDesk.exe",
  "LogMeIn.exe",
  "RemotePC.exe",
  "ZoomIt.exe",           
  "BlueJeans.exe",
  "GoToMeeting.exe",
  "JoinMe.exe",
  "Webex.exe",    
  "obs64.exe",
  "obs32.exe",
  "obs.exe",         

  "Dropbox.exe",
  "OneDrive.exe",
  "GoogleDrive.exe",
  "iCloud.exe",
  "BoxSync.exe",          

  "notepad.exe",
  "notepad++.exe",
  "Evernote.exe",
  "Obsidian.exe",
  "OneNote.exe",
  "Notion.exe",            
  "Todoist.exe",
  "MicrosoftWord.exe",     
  "Scrivener.exe",


  "AcroRd32.exe",        
  "FoxitReader.exe",
  "SumatraPDF.exe",
  "NitroPDF.exe",
  "Preview.exe",         

  // "code.exe",              // Visual Studio Code
  "Atom.exe",
  "PyCharm.exe",
  "IntelliJ.exe",
  "CLion.exe",
  "eclipse.exe",
  "sublime_text.exe",
  "NetBeans.exe",
  "RStudio.exe",   
  "MATLAB.exe",
  "devcpp.exe",          
  "Xcode.exe",


  "GeoGebra.exe",
  "WolframMathematica.exe",
  "Maple.exe",          
  "Mathematica.exe",
  "SPSS.exe",          
  "Minitab.exe",
  "SAS.exe",           

  "VirtualBox.exe",
  "vmware.exe",
  "BlueStacks.exe", 
  "Nox.exe",

  "Photoshop.exe",
  "GIMP.exe",
  "Illustrator.exe",
  "Paint.exe",
  "SnippingTool.exe",
  "Lightshot.exe",
  "Greenshot.exe"
];

// Terminate any disallowed processes
processesToClose.forEach((process) => {
  exec(`taskkill /IM ${process} /F`, (error, stdout, stderr) => {
    if (error) {
      console.log(`Failed to kill ${process}:`, stderr);
    } else {
      console.log(`Successfully terminated ${process}`);
    }
  });
});

async function submitPaper() {
  if (isSubmitting) return;

  isSubmitting = true;

  try {
    const start = await mainWindow.webContents.executeJavaScript('localStorage.getItem("start")');
    if (start !== "true") {
      mainWindow.webContents.send("open-modal", { message: "Submission skipped: 'start' is not set to 'true'.", isError: true });
      return;
    }

    const teacherId = await mainWindow.webContents.executeJavaScript('localStorage.getItem("teacherId")');
    const studentId = await mainWindow.webContents.executeJavaScript('localStorage.getItem("studentId")');
    const paperId = await mainWindow.webContents.executeJavaScript('localStorage.getItem("paperId")');

    if (!teacherId || !studentId || !paperId) {
      throw new Error("Missing required data in localStorage");
    }

    const response = await axios.post(`${backendUrl}/student/getQuestionByPaperId`, { paperId });
    const questions = response.data.questions;

    const questionResponses = await Promise.all(
      questions.map(async (question) => {
        const finalCode = await mainWindow.webContents.executeJavaScript(`localStorage.getItem("code_${question._id}")`);
        const runHistory = JSON.parse(await mainWindow.webContents.executeJavaScript(`localStorage.getItem("runHistory_${question._id}")`)) || [];

        return {
          questionId: question._id,
          finalCode,
          runHistory,
        };
      })
    );

    const submissionPayload = {
      teacherId,
      studentId,
      paperId,
      questions: questionResponses,
    };

    const submitResponse = await axios.post(`${backendUrl}/student/submitResponse`, submissionPayload);

    if (submitResponse.status === 200) {
      console.log("Paper submitted because of cheating");
      await mainWindow.webContents.executeJavaScript('localStorage.clear();');
      await mainWindow.webContents.executeJavaScript('window.location.href = "/"');
      mainWindow.webContents.send("open-modal", { message: "Response submitted successfully!", isError: false });
    } else {
      console.log("Failed to submit response: " + submitResponse.statusText);
      mainWindow.webContents.send("open-modal", { message: "Failed to submit response: " + submitResponse.statusText, isError: true });
    }
  } catch (error) {
    console.error(error);
    mainWindow.webContents.send("open-modal", { message: "Error submitting response: " + (error.message || error), isError: true });
  } finally {
    isSubmitting = false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.session.clearStorageData({ storages: ["localstorage"] }).then(() => {
    console.log("Local storage cleared");
    mainWindow.loadURL("https://iips-exam-student-portal.vercel.app");
  });
  let blurTimeout;

  mainWindow.on("blur", () => {
    submitPaper();
  });

  mainWindow.on("focus", () => {
    if (blurTimeout) {
      clearTimeout(blurTimeout);
      blurTimeout = null;
    }
  });

  mainWindow.on("close", async (e) => {
    e.preventDefault();
    await submitPaper();
    app.quit();
  });
}

app.on("ready", () => {
  createWindow();
  Menu.setApplicationMenu(null);
  const preventExitKeys = ["Alt+F4", "CommandOrControl+W", "F11"];
  preventExitKeys.forEach((key) => {
    globalShortcut.register(key, () => mainWindow.focus());
  });

  if (process.platform === "win32") {
    globalShortcut.register("Alt+Tab", () => mainWindow.focus());
    globalShortcut.register("CommandOrControl+Tab", () => mainWindow.focus());
  }
});

app.on("window-all-closed", () => {
  terminateAutoHotkeyProcesses();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", (event) => {
  event.preventDefault();
  terminateAutoHotkeyProcesses();
  process.exit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

process.on("SIGINT", () => {
  terminateAutoHotkeyProcesses();
  process.exit();
});

process.on("SIGTERM", () => {
  terminateAutoHotkeyProcesses();
  process.exit();
});
