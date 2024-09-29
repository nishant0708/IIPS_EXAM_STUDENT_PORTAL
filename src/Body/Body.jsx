import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "flex-splitter-directive";
import "flex-splitter-directive/styles.min.css";
import Questions from "../Questions/Questions";
import Editor from "../Editor/Editor";
import Test from "../Test/Test";
import "./Body.css";

const Body = ({ question }) => {
  const bodyContentsRef = useRef(null); // Reference for body-contents
  const [output, setOutput] = useState(""); // State to store the output
  const [codes, setCodes] = useState([]); // Array to store code for each question

  // Function to update the code for a specific question
  const updateCode = (questionId, newCode) => {
    setCodes((prevCodes) => {
      const existingCodeIndex = prevCodes.findIndex((item) => item.questionId === questionId);
      
      if (existingCodeIndex !== -1) {
        // Update existing code
        const updatedCodes = [...prevCodes];
        updatedCodes[existingCodeIndex].code = newCode;
        return updatedCodes;
      } else {
        // Add new code
        return [...prevCodes, { questionId, code: newCode }];
      }
    });
  };

  // Function to get the code for a specific question
  const getCode = (questionId) => {
    const foundCode = codes.find((item) => item.questionId === questionId);
    return foundCode ? foundCode.code : "";
  };

  return (
    <div className="compiler-body" data-flex-splitter-horizontal>
      <Questions question={question} />

      <div role="separator" tabIndex="1"></div>

      <div className="body-contents" data-flex-splitter-vertical ref={bodyContentsRef}>
        <Editor question={question} onOutput={setOutput} getCode={getCode} updateCode={updateCode} />
        <div role="separator" tabIndex="1"></div>
        <Test output={output} />
      </div>
    </div>
  );
};

// Define prop types for the Body component
Body.propTypes = {
  question: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
};

export default Body;
