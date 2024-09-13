import React from "react";
import PropTypes from "prop-types";
import { MdReportProblem } from "react-icons/md";
import "./Questions.css";

const Questions = ({ question }) => {
  if (!question) {
    return <div>Loading question...</div>; 
  }

  return (
    <>
      <div className="compiler-questions">
        <div>
          <div className="questions-header">
            <MdReportProblem />
            Problem
            <p className="question_marks_body">{question.marks} mark</p>
          </div>
          <div className="questions-content">
             <div className="content-heading">
               {question.questionheading}
              
                </div>
            <br />
            <div
              className="content-body"
              dangerouslySetInnerHTML={{ __html: question.questionDescription }}
            />
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
