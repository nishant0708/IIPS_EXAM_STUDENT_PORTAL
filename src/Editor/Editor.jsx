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
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  // Handle "Run" button click
  const handleRunClick = async () => {
    const code = editorRef.current.getValue();

    try {
      const response = await axios.post(
        "http://localhost:5000/student/compile",
        {
          code,
          language: question?.compilerReq,
          input: input || "", // Send user input if available
        }
      );

      const { output, waitingForInput } = response.data;

      if (waitingForInput) {
        setIsModalOpen(true); // Open the modal if input is required
      }

      onOutput(output);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  // Handle input submission
  const handleInputSubmit = async () => {
    setIsModalOpen(false); // Close the modal
    await handleRunClick(); // Re-run the code with the new input
  };

  return (
    <div className="compiler-editor">
      <div className="editor-header">
        <div className="editor-code">
          <FaCode />
          <div>Code</div>
        </div>
        <div className="editor-run" onClick={handleRunClick}>
          <FaPlay size={15} />
          <div>Run</div>
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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
};

export default Editor;
