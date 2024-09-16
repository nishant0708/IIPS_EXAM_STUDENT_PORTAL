import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "flex-splitter-directive";
import "flex-splitter-directive/styles.min.css";
import Questions from "../Questions/Questions";
import Editor from "../Editor/Editor";
import Test from "../Test/Test";
import "./Body.css";

const Body = ({ question }) => {
  const bodyContentsRef = useRef(null); // Reference for body-contents
  const [isSmallWidth, setIsSmallWidth] = useState(false); // State to track if width < 200px

  // useEffect to observe the width of body-contents
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (bodyContentsRef.current) {
        const { width } = entries[0].contentRect;
        setIsSmallWidth(width < 200); // Set state based on width
      }
    });

    if (bodyContentsRef.current) {
      observer.observe(bodyContentsRef.current);
    }

    // Cleanup
    return () => {
      if (bodyContentsRef.current) {
        observer.unobserve(bodyContentsRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="compiler-body" data-flex-splitter-horizontal>
      {/* Pass the question as a prop to the Questions component */}
      <Questions question={question} />
      <div role="separator" tabIndex="1"></div>

      {/* Conditionally render based on width */}
      {isSmallWidth ? (
        <div className="body-contents-small" ref={bodyContentsRef}>
          {/* Render alternate content when width is less than 200px */}
          <p>Code</p>
        </div>
      ) : (
        <div className="body-contents" data-flex-splitter-vertical ref={bodyContentsRef}>
          <Editor question={question} />
          <div role="separator" tabIndex="1"></div>
          <Test />
        </div>
      )}
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