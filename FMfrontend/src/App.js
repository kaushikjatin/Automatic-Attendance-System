import "./App.css";
import HomePage from "./Screens/HomePage/HomePage";
import Header from "./Components/Header";
import Register from "./Components/Register/Register";
import Login from "./Components/Login";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import VerifyEmail from "./Components/VerifyEmail";
import { memo, useEffect, useState } from "react";
import TeacherData from "./Screens/TeacherData";
import DepttData from "./Screens/DepttData";
import StudentData from "./Screens/StudentData";
import { Component } from "react";
import Parent from "./Components/Experiment";
// import Temp from "./Components/Temp";
function App(props) {
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const [success, setsuccess] = useState(null);
  const [heading, setheading] = useState("");
  const [width, setWidth] = useState(window.innerWidth <= 768);
  const [showNav, setshowNav] = useState("false");
  // var showNav=false
  // const setshowNav=(b)=>showNav=b;
  function handleWindowSizeChange() {
    setWidth(window.innerWidth <= 768);
  }
  // console.log(showNav);
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const { user } = useSelector((state) => state.auth);
  const newprop = {
    isMobile: width,
    loading,
    success,
    error,
    setsuccess,
    setloading,
    seterror,
    heading,
    setheading,
    showNav,
    setshowNav,
  };
  const userRoute = {
    home: (
      <Route
        path="/"
        render={(props) => <HomePage {...props} {...newprop} />}
        exact
      />
    ),
    0: (
      <Route path="/" exact>
        <StudentData {...props} {...newprop} />
      </Route>
    ),
    1: (
      <Route path="/" exact>
        <TeacherData {...props} {...newprop} />
      </Route>
    ),
    2: (
      <Route path="/" exact>
        <DepttData {...props} {...newprop} />
      </Route>
    ),
  };
  return (
    <BrowserRouter>
      <Header
        style={{ backgroundColor: "#222" }}
        isMobile={newprop.isMobile}
        showNav={showNav}
        setshowNav={setshowNav}
      />
      <Container fluid>
        <main className="" style={{ backgroundColor: "#222" }}>
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Route path="/register" render={(props) => <Register {...props} />} />
          <Route
            path="/verifyAccount/:role"
            render={(props) => <VerifyEmail {...props} />}
          />
          {userRoute[user ? user.role : "home"]}
        </main>
      </Container>
    </BrowserRouter>
  );
}
export default App;
