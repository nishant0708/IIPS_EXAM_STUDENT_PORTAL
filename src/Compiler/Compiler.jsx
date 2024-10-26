import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Compiler.css";
import Navbar from "../Navbar/Navbar";
import Body from "../Body/Body";

const Compiler = () => {
  const { questionId } = useParams(); // Get questionId from URL parameters
  const [question, setQuestion] = useState(null); // State to store the fetched question

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // POST request to send questionId in the body
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/student/getQuestionById`, {
          questionId: questionId, // Send questionId in the body
        });
        setQuestion(response.data.question); // Set the fetched question
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  return (
    <>
      <Navbar />
      <Body question={question} />
    </>
  );
};

export default Compiler;
