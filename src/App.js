import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Compiler from "./Compiler/Compiler";
import RulesPage from "./rules_page/rules";
import Verification from "./verification/verification";
import SubmitPage from "./Submitpage/SubmitPage";


const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/compiler/:questionId" element={<Compiler />} /> 
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/verification" element={<Verification/>}/>
          <Route path="/Submit" element={<SubmitPage/>}/>
        </Routes>
      </Router>
    );
};

export default App;
