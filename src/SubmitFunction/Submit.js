import axios from "axios";

export const submitResponse = async ({ ontimeOut = false }) => {
  try {
    // Get teacherId, studentId, and paperId from local storage
    const teacherId = localStorage.getItem("teacherId");
    const studentId = localStorage.getItem("studentId");
    const paperId = localStorage.getItem("paperId");

    if (!teacherId || !studentId || !paperId) {
      throw new Error("Missing required data in localStorage");
    }

    // Fetch all question IDs by paperId
    const response = await axios.post(
      "http://localhost:5000/student/getQuestionByPaperId",
      { paperId }
    );
    const questions = response.data.questions;

    // Prepare the responses for each question
    const questionResponses = questions.map((question) => {
      const finalCode = localStorage.getItem(`code_${question._id}`);
      const runHistory =
        JSON.parse(localStorage.getItem(`runHistory_${question._id}`)) || [];

      return {
        questionId: question._id,
        finalCode,
        runHistory,
      };
    });

    // Submit the response data
    const submissionPayload = {
      teacherId,
      studentId,
      paperId,
      questions: questionResponses, // Send the collected question responses
    };

    const submitResponse = await axios.post(
      "http://localhost:5000/student/submitResponse",
      submissionPayload
    );

    if (submitResponse.status === 200) {
      console.log("Response submitted successfully!");

      if (!ontimeOut) {
        // Clear all localStorage data
        localStorage.clear();

        // Redirect to the home page
        window.location.href = "/";
      }else{
        localStorage.removeItem("teacherId")
        localStorage.removeItem("studentId")
        localStorage.removeItem("paperId")
      }
    } else {
      console.error("Failed to submit response:", submitResponse.statusText);
    }
  } catch (error) {
    console.error("Error submitting response:", error);
  }
};
