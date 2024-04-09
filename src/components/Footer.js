import React from "react";
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="top">
        <div className="left">
          <img src="./assets/logo.png" alt="" />
          <h1>Crypto Watch</h1>
        </div>
        <div className="mid">
          <a href="#app-container">
            <h3>Home</h3>
          </a>
        </div>
        <div className="right">
          <a href="https://github.com/VictorDpnt">
            <AiFillGithub />
          </a>
        </div>
      </div>
      <div className="bot">
        <p>Copyright © 2024 CRYPTOWATCH</p>
      </div>
    </div>
  );
};

export default Footer;
