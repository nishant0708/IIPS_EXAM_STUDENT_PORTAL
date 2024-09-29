import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor as Ed } from "@monaco-editor/react"; 
import "./SubmitPage.css"; 
import Navbar from "../Navbar/Navbar";

const SubmitPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paperId = localStorage.getItem("paperId");


  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/student/getQuestionByPaperId",
        { paperId }
      );

      const sortedQuestions = response.data.questions.sort(
        (a, b) => a.marks - b.marks
      );

      setQuestions(sortedQuestions);
    } catch (error) {
      console.error("Error fetching question details:", error);
      setError("Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, []);


  const getStatus = (question) => {
    const code = localStorage.getItem(`code_${question._id}`);
    const runHistory =
      JSON.parse(localStorage.getItem(`runHistory_${question._id}`)) || [];

    if (code) {
      if (runHistory.length > 0) {
        return "Attempted";
      }
      return "Attempted but Not Run";
    }
    return "Not Attempted";
  };


  const handleEditorDidMount = (editor) => {
    console.log("Editor mounted", editor);
  };


  const handleCardClick = (e, questionId) => {

    if (!e.target.closest(".monaco-editor")) {
      window.location.href = `/compiler/${questionId}`;
    }
  };

  return (
    <>
      <Navbar />
      <div className="submitpage_container">
        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p className="submitpage_error">{error}</p>
        ) : questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          questions.map((question) => {
            const userCode = localStorage.getItem(`code_${question._id}`) || ""; 

            return (
              <div
                key={question._id}
                className="submitpage_question-card"
                onClick={(e) => handleCardClick(e, question._id)} 
              >
                <span className="submitpage_question-heading-block">
                  <h2 className="submitpage_question-heading">
                    {question.questionheading}
                  </h2>
                  <p className="submitpage_question-marks">
                    {question.marks} marks
                  </p>
                </span>
                <p
                  className="submitpage_question-description"
                  dangerouslySetInnerHTML={{
                    __html: question.questionDescription.replace(/[#*_]/g, ""),
                  }}
                ></p>

                <div className="submitpage_editor-section">
                  <h3>Submitted Code</h3>

                  <Ed
                    theme="vs-dark"
                    defaultLanguage={question?.compilerReq}
                    value={userCode || ""}
                    className="submitpage_editor-monaco"
                    onMount={handleEditorDidMount}
                    options={{
                      readOnly: true, // Ensure the editor is read-only
                      domReadOnly: true, 
                    }}
                  />
                </div>

                <div
                  className={`submitpage_status ${getStatus(question)
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  Status: {getStatus(question)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default SubmitPage;
