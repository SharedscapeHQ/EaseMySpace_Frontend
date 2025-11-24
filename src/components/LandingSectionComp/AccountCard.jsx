import React from "react";
import styled from "styled-components";
import { FiHome, FiMessageSquare, FiCreditCard, FiPhoneCall, FiClock } from "react-icons/fi";

const tabs = [
  { label: "My Properties", value: "MyProperties", icon: <FiHome /> },
  { label: "My Queries", value: "MyQueries", icon: <FiMessageSquare /> },
  { label: "My Plan", value: "MyPlan", icon: <FiCreditCard /> },
  { label: "Unlocked Contacts", value: "UnlockedContacts", icon: <FiPhoneCall /> },
  { label: "Recently Viewed", value: "RecentlyViewed", icon: <FiClock /> },
];

export default function AccountCard({ onRegister, onLogin }) {
  return (
    <StyledWrapper>
      <div className="parent">
        <div className="a tl" />
        <div className="a t" />
        <div className="a tr" />
        <div className="a l" />
        <div className="a c" />
        <div className="a r" />
        <div className="a bl" />
        <div className="a b" />
        <div className="a br" />
        <div className="card">
          <div className="inner-blur-thing" />
          <div className="inner">
            <div className="inner-bg" />
          </div>

          <div className="txt welcome">
            Welcome! <br />
            Create an account or login to access your dashboard
          </div>

          <div className="buttons">
            <button className="register" onClick={onRegister}>Register</button>
            <button className="login" onClick={onLogin}>Login</button>
          </div>

          <div className="tabs-section">
            {tabs.map((tab, idx) => (
              <div key={idx} className="tab">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
.parent {
  width: 280px;
  height: 280px;
  perspective: 3000px;
}

.card {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 30px;
  transform-style: preserve-3d;
  background: #212121;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.inner {
  position: absolute;
  inset: 0;
  border-radius: 29px;
  background: #212121;
  overflow: hidden;
  transform-style: preserve-3d;

  .inner-bg {
    position: absolute;
    inset: -1000%;
    filter: blur(40px);
    opacity: 0.3;
    transform: translateZ(-10px);
    background: conic-gradient(
      from 45deg,
      #fff 5%,
      #fff0 10% 40%,
      #fff 45% 55%,
      #fff0 60% 90%,
      #fff 95%
    );
    animation: speen 24s linear infinite;
  }
}

@keyframes speen {
  to { rotate: 360deg; }
}

.txt.welcome {
  font-family: monospace;
  font-size: 16px;
  color: #ccc;
  z-index: 10;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
  z-index: 10;

  button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: 0.3s;

    &.register {
      background: linear-gradient(90deg, #3eea8e, #0fa2ff);
      color: #fff;
    }

    &.login {
      background: linear-gradient(90deg, #ff8c42, #ff3d6b);
      color: #fff;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
}

.tabs-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  z-index: 10;

  .tab {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: monospace;
    color: #ccc;
    font-size: 14px;

    svg {
      width: 18px;
      height: 18px;
      fill: #ccc;
    }

    &:hover {
      color: #0fa2ff;
      svg { fill: #0fa2ff; }
    }
  }
}
`;
