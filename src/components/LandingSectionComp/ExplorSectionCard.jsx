import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = ({ title, text, icon, buttonLabel, onClick, link }) => {
  return (
    <StyledWrapper>
      {link ? (
        <Link to={link} className="parent">
          <div className="card">
            <CardContent title={title} text={text} icon={icon} buttonLabel={buttonLabel} />
          </div>
        </Link>
      ) : (
        <div className="parent" onClick={onClick}>
          <div className="card">
            <CardContent title={title} text={text} icon={icon} buttonLabel={buttonLabel} />
          </div>
        </div>
      )}
    </StyledWrapper>
  );
};

const CardContent = ({ title, text, icon, buttonLabel }) => (
  <>
    <div className="logo">
      <span className="circle circle1" />
      <span className="circle circle2" />
      <span className="circle circle3" />
      <span className="circle circle4" />
      <span className="circle circle5">{icon}</span>
    </div>
    <div className="glass" />
    <div className="content">
      <span className="title">{title}</span>
      <span className="text">{text}</span>
    </div>
    <div className="bottom">
      {buttonLabel && (
        <button className="view-more-button">{buttonLabel}</button>
      )}
    </div>
  </>
);

const StyledWrapper = styled.div`
  .parent {
    width: 100%;
    height: 250px;
    perspective: 1000px;
    cursor: pointer;
    display: block;
    text-decoration: none;
  }

  .card {
    position: relative;
    height: 100%;
    border-radius: 30px;
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: rgba(0, 64, 128, 0.2) 0px 25px 25px -5px;
  }

  .glass {
    position: absolute;
    inset: 8px;
    border-radius: 25px;
    border-top-right-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.85) 100%
    );
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }

  .content {
    padding: 80px 40px 0px 30px;
    transform: translate3d(0, 0, 26px);
    position: relative;
    z-index: 50;
  }

  .content .title {
    display: block;
    color: #0c4a6e;
    font-size: 20px;
    font-weight: 700;
  }

  .content .text {
    display: block;
    color: rgba(12, 74, 110, 0.8);
    font-size: 15px;
    margin-top: 15px;
  }

  .bottom {
    padding: 10px 12px;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    transform: translate3d(0, 0, 26px);
    z-index: 50;
  }

  .view-more-button {
    background: #1e40af;
    border: none;
    color: #fff;
    font-size: 14px;
    padding: 6px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    z-index: 51;
    position: relative;
  }

  .view-more-button:hover {
    background: #2563eb;
  }

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    transform-style: preserve-3d;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    right: 0;
    background: rgba(96, 165, 250, 0.2);
    transition: all 0.5s ease-in-out;
  }

  .logo .circle1 { width: 150px; top: 8px; right: 8px; }
  .logo .circle2 { width: 120px; top: 12px; right: 12px; transition-delay: 0.4s; }
  .logo .circle3 { width: 90px; top: 18px; right: 18px; transition-delay: 0.8s; }
  .logo .circle4 { width: 60px; top: 24px; right: 24px; transition-delay: 1.2s; }
  .logo .circle5 { width: 40px; top: 30px; right: 30px; display: grid; place-content: center; transition-delay: 1.6s; }
  .logo .circle5 .svg { width: 20px; fill: white; }

  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 20deg);
    box-shadow: rgba(0, 64, 128, 0.35) 20px 30px 25px -20px;
  }
`;

export default Card;
