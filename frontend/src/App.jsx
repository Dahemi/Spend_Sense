import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import SignUpSignIn from "./components/SignUpSignIn";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<SignUpSignIn />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
