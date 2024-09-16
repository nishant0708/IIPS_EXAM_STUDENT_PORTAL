import React from "react";
import PropTypes from "prop-types";
import "flex-splitter-directive";
import "flex-splitter-directive/styles.min.css";
import Questions from "../Questions/Questions";
import Editor from "../Editor/Editor";
import Test from "../Test/Test";
import "./Body.css";

const Body = ({ question }) => {
  return (
    <>
      <div className="compiler-body" data-flex-splitter-horizontal>
        {/* Pass the question as a prop to the Questions component */}
        <Questions question={question} />
        <div role="separator" tabIndex="1"></div>
        <div className="body-contents" data-flex-splitter-vertical>
        
          <Editor question={question} />
          <div role="separator" tabIndex="1"></div>
          <Test />
        </div>
      </div>
    </>
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
