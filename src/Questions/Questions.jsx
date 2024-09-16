import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MdReportProblem } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import "./Questions.css";

const Questions = ({ question }) => {
  const questionRef = useRef(null); // Reference for .compiler-questions
  const [isSmallWidth, setIsSmallWidth] = useState(false); // State to track if width < 150px

  // useEffect to observe the width of .compiler-questions
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (questionRef.current) {
        const { width } = entries[0].contentRect;
        setIsSmallWidth(width < 200); // Set state based on width < 150px
      }
    });

    if (questionRef.current) {
      observer.observe(questionRef.current);
    }

    // Cleanup
    return () => {
      if (questionRef.current) {
        observer.unobserve(questionRef.current);
      }
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures it runs once after the first render

  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <>
      {/* Reference added to observe width */}
      <div className="compiler-questions" ref={questionRef}>
        {isSmallWidth ? (
          // Render "Question description" when width < 150px
          <div className="questions-small-content">
            <p>Question description</p>
          </div>
        ) : (
          <div>
            <div className="questions-header">
              <MdReportProblem />
              Problem
              <p className="question_marks_body">{question.marks} mark</p>
            </div>
            <div className="questions-content">
              <div className="content-heading">{question.questionheading}</div>
              <br />
              <ReactMarkdown className="content-body">
                {question.questionDescription}
              </ReactMarkdown>
              {question.image && (
                <>
                  <br />
                  <img
                    src={question.image}
                    alt={question.questionheading}
                    className="questions-image"
                  />
                  <br />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Define prop types for the Questions component
Questions.propTypes = {
  question: PropTypes.shape({
    questionheading: PropTypes.string.isRequired,
    questionDescription: PropTypes.string.isRequired,
    marks: PropTypes.number.isRequired,
    image: PropTypes.string,
  }),
};

export default Questions;
