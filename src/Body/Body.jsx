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

  return (
    <div className="compiler-body" data-flex-splitter-horizontal>
      <Questions question={question} />

      <div role="separator" tabIndex="1"></div>

      {/* Always render the main content */}
      <div className="body-contents" data-flex-splitter-vertical ref={bodyContentsRef}>
        {/* Pass setOutput function to Editor to update the output */}
        <Editor question={question} onOutput={setOutput} />
        <div role="separator" tabIndex="1"></div>
        {/* Pass the output state to the Test component */}
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
