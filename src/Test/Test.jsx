import React from "react";
import PropTypes from "prop-types";
import "./Test.css";
import { IoCheckmarkDone } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

const Test = ({ output }) => {
  return (
    <div className="compiler-test">
      <div className="test-header">
        <IoCheckmarkDone />
        Test Output
      </div>
      <div className="test-output">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]} 
          rehypePlugins={[rehypeSanitize]}
        >
          {output}
        </ReactMarkdown>
      </div>
    </div>
  );
};


Test.propTypes = {
  output: PropTypes.string.isRequired, 
};

export default Test;
