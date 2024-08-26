import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Compiler from "./Compiler/Compiler"


const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Login />} />
        {/* -----------------------------------------------Compiler Component */}
        <Route path="/compiler" element={<Compiler />} />
       
      </Routes>
    </Router>
  )
}

export default App
