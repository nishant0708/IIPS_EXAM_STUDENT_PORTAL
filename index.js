const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

let mainWindow;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
let isSubmitting = false;

// Function to submit the paper when cheating is detected
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
      // Navigate to the root route
      await mainWindow.webContents.executeJavaScript('window.location.href = "/"');
      // Show the success modal
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
    mainWindow.loadURL("http://localhost:3000");
  });

  // Flag to check if window regained focus shortly after blur
  let blurTimeout;

  mainWindow.on("blur", () => {
    // Set a timeout before submitting to check if the window regains focus
    blurTimeout = setTimeout(() => {
      submitPaper();
    }, 500); // Adjust delay as needed
  });

  mainWindow.on("focus", () => {
    // Clear the blur timeout if the window regains focus quickly
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
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
