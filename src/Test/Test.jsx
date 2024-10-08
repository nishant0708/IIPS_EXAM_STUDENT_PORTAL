import React from "react";
import PropTypes from "prop-types";
import "./Test.css";
import { IoCheckmarkDone } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

const Test = ({ output }) => {
  // Split stdout and stderr
  const stdout = output.stdout || "";
  const stderr = output.stderr || "";

  return (
    <div className="compiler-test">
      <div className="test-header">
        <IoCheckmarkDone />
        Test Output
      </div>
      <div className="test-output">
        {/* Display stdout in white */}
        {stdout && (
          <ReactMarkdown
            className="stdout-output" // Add class for stdout
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
          >
            {stdout}
          </ReactMarkdown>
        )}
        {/* Display stderr in red */}
        {stderr && (
          <ReactMarkdown
            className="stderr-output" // Add class for stderr
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
          >
            {stderr}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

Test.propTypes = {
  output: PropTypes.shape({
    stdout: PropTypes.string,
    stderr: PropTypes.string,
  }).isRequired,
};

export default Test;
