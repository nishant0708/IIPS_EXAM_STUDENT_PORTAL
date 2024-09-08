import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Compiler from "./Compiler/Compiler";
import RulesPage from "./rules_page/rules";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* -----------------------------------------------Compiler Component */}
        <Route path="/compiler" element={<Compiler />} />
        <Route path="/rules" element={<RulesPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
