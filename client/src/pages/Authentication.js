import React, { useState } from "react";
import "../pages/Authentication.css";
import LogoImage from "../utils/Images/Logo.png";
import AuthImage from "../utils/Images/AuthImage.jpg";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Authentication = () => {
  const [login, setLogin] = useState(false);
  return (
    <div className="container">
      <div className="left">
        <img className="logo" src={LogoImage} alt="Logo" />
        <img className="image" src={AuthImage} alt="Authentication Background" />
      </div>
      <div className="right">
        {!login ? (
          <>
            <SignIn />
            <div className="text">
              Don't have an account?{" "}
              <span className="text-button" onClick={() => setLogin(true)}>
                SignUp
              </span>
            </div>
          </>
        ) : (
          <>
            <SignUp />
            <div className="text">
              Already have an account?{" "}
              <span className="text-button" onClick={() => setLogin(false)}>
                SignIn
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;
