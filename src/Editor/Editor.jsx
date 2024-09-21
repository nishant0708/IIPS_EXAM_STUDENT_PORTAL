import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Editor.css";
import { Editor as Ed } from "@monaco-editor/react";
import { FaCode, FaPlay } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal"; // Import Modal component

Modal.setAppElement("#root"); // Set the root element for accessibility

const Editor = ({ question, onOutput }) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [input, setInput] = useState(""); // Input for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [userCode, setUserCode] = useState(""); // Store code for resubmission
  const [userOutput, setUserOutput] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  console.log(userCode, userOutput);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    });

    if (editorContainerRef.current) {
      observer.observe(editorContainerRef.current);
    }

    return () => {
      if (editorContainerRef.current) {
        observer.unobserve(editorContainerRef.current);
      }
      observer.disconnect();
    };
  }, []);

  const handleRunClick = async () => {
    const code = editorRef.current.getValue();
    setUserCode(code); // Store code for future use
  
    // Check for user input methods in different languages
    const needsInputModal = (code) => {
      switch (question?.compilerReq) {
        case "cpp":
        case "c":
          return (
            code.includes("cin") ||
            code.includes("scanf") ||
            code.includes("getline") ||
            code.includes("gets") ||
            code.includes("fgets") ||  // For safer string input
            code.includes("getchar") ||
            code.includes("cin.get") || 
            code.includes("cin.getline")
          );
        case "java":
          return (
            code.includes("Scanner") && code.includes("next") ||
            code.includes("BufferedReader") && code.includes("readLine") ||
            code.includes("InputStreamReader") ||
            code.includes("Console") && code.includes("readLine") ||
            code.includes("DataInputStream")
          );
        case "python":
          return (
            code.includes("input") || 
            code.includes("sys.stdin.read") || 
            code.includes("sys.stdin.readline") ||
            code.includes("fileinput.input") // Handles input from files (stdin)
          );
        default:
          return false;
      }
    };
  
    if (needsInputModal(code)) {
      setIsModalOpen(true); // Open modal if input method is detected
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/student/compile`, {
        code: code,
        language: question?.compilerReq,
        input: input || "", // Send empty input if none is provided
      });
  
      const output = res.data.stdout || res.data.stderr;
      setUserOutput(output);
      onOutput(output); // Pass the output back to the parent (Body)
    } catch (err) {
      const errorOutput = "Error: " + (err.response ? err.response.data.error : err.message);
      setUserOutput(errorOutput);
      onOutput(errorOutput); // Pass the error back to the parent
    } finally {
      setLoading(false);
    }
  };

  // Separate function to handle code execution
  const executeCode = async (inputValue) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/student/compile`, {
        code: userCode,
        language: question?.compilerReq,
        input: inputValue || "", // Send empty input if none is provided
      });

      const output = res.data.stdout || res.data.stderr;
      setUserOutput(output);
      onOutput(output); // Pass the output back to the parent (Body)
    } catch (err) {
      const errorOutput =
        "Error: " + (err.response ? err.response.data.error : err.message);
      setUserOutput(errorOutput);
      onOutput(errorOutput); // Pass the error back to the parent
    } finally {
      setLoading(false);
    }
  };

  const handleInputSubmit = () => {
    setIsModalOpen(false);
    executeCode(input); // Run the code with the input provided in the modal
  };

  console.log(question?.compilerReq);
  return (
    <div className="compiler-editor">
      <div className="editor-header">
        <div className="editor-code">
          <FaCode />
          <div>Code</div>
        </div>
        <div className="editor-run" onClick={handleRunClick}>
          <FaPlay size={15} />
          <div>{loading ? "Running..." : "Run"}</div>
        </div>
      </div>
      <div className="editor-editor" ref={editorContainerRef}>
        <Ed
          theme="vs-dark"
          defaultLanguage={question?.compilerReq}
          defaultValue="// Write Code Here"
          className="editor-monaco"
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Modal for input prompt */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Input Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Input Required</h2>
          <label>Enter Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
          />
          <button onClick={handleInputSubmit}>Submit</button>
        </div>
      </Modal>
    </div>
  );
};

Editor.propTypes = {
  question: PropTypes.shape({
    compilerReq: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
  onOutput: PropTypes.func.isRequired,
  userLang: PropTypes.string.isRequired,
};

export default Editor;
