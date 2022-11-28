// @ts-nocheck
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";
import ArrowIcon from "@assets/images/ArrowIcon.svg";
import LogoGradient from "@assets/images/LogoGradient.png";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";

import { displaySidebar } from "@src/store/SidebarState";
import { displayAddGoal, displayAddGoalOptions, displayGoalId, displayUpdateGoal, goalsHistory, popFromGoalsHistory } from "@src/store/GoalsState";
import Sidebar from "@components/Sidebar";
import SuggestionModal from "../SuggestionModal";

import "@translations/i18n";
import "@components/HeaderDashboard/HeaderDashboard.scss";

interface GoalsHeaderProps {
  displayTRIcon: string,
  addThisGoal: (e: React.SyntheticEvent, parentGoalId: number) => Promise<void>,
  updateThisGoal: (e: React.SyntheticEvent) => Promise<void>
}

export const GoalsHeader:React.FC<GoalsHeaderProps> = ({ displayTRIcon, addThisGoal, updateThisGoal }) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const subGoalsHistory = useRecoilValue(goalsHistory);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showAddGoal = useRecoilValue(displayAddGoal);
  const goalID = useRecoilValue(displayGoalId);
  const setShowSidebar = useSetRecoilState(displaySidebar);

  const setShowAddGoalOptions = useSetRecoilState(displayAddGoalOptions);

  const popFromHistory = useSetRecoilState(popFromGoalsHistory);

  return (
    <div className={darkModeStatus ? "positioning-dark" : "positioning-light"}>
      <Sidebar />
      <Navbar collapseOnSelect expand="lg">
        {
        !showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0 ? (
          <img
            role="presentation"
            src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
            alt="Back arrow"
            style={{ width: "50px" }}
            id="main-header-homeLogo"
            onClickCapture={() => setShowSidebar(true)}
          />
        )
          : (
            <img
              role="presentation"
              src={ArrowIcon}
              alt="Back arrow"
              id="main-header-homeLogo"
              onClick={() => {
                if (!showAddGoal && !showUpdateGoal && subGoalsHistory.length === 0) {
                  navigate(-1);
                } else popFromHistory(-1);
              }}
            />
          )
}
        {darkModeStatus ? (
          <img
            role="presentation"
            src={ZinZenTextDark}
            alt="ZinZen Text Logo"
            className="main-header-TextLogo"
            onClick={() => {
              navigate("/");
            }}
          />
        ) : (
          <img
            role="presentation"
            src={ZinZenTextLight}
            alt="ZinZen Text Logo"
            className="main-header-TextLogo"
            onClick={() => {
              navigate("/");
            }}
          />
        )}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbar-custom" />
        </Navbar.Collapse>

        <button
          type="button"
          id="goal-suggestion-btn"
          onClick={(e) => {
            if (displayTRIcon === "+") {
              setShowAddGoalOptions(true);
              // setShowAddGoal({ open: true, goalId: goalID });
            } else if (showAddGoal) {
              addThisGoal(e);
            } else if (showUpdateGoal) {
              updateThisGoal(e);
            }
          }}
        >
          <img alt="save changes" src={LogoGradient} />
          <div>{window.location.href.includes("AddGoals") || displayTRIcon === "✓" ? "✓" : "+"}</div>
        </button>

      </Navbar>
      <SuggestionModal
        goalID={goalID}
      />
    </div>
  );
};