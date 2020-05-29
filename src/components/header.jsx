import React from "react";
import Settings from "./molecules/settings";
import styled from "styled-components";

// Keep this here for linter
/* global chrome */

const Wrapper = styled.div`
  position: fixed;
  left: 10vw;
  top: 15vh;
`;

const Logo = styled.h1`
  display: inline;
  color: black;
`;

const SettingsBox = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 24px;

  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
`;

const SettingsContents = styled.h4`
  padding: 8px;
`;

const Icon = styled.img`
  height: 1em;
`;

export default class Header extends React.Component {
  state = {
    showSettings: false,
    openOnLaunch: true,
  };

  componentDidMount = () => {
    if (chrome.storage) {
      chrome.storage.sync.get(["options"], (result) => {
        let x = Object.keys(result).length;
        let newState =
          x === 0
            ? {
                openOnLaunch: true,
              }
            : result;
        this.setState({
          showSettings: this.state.showSettings,
          ...newState.options,
        });
      });
    } else {
      const newState = JSON.parse(localStorage.getItem("options"));
      if (newState === null) {
        this.setState({
          showSettings: this.state.showSettings,
          openOnLaunch: true,
        });
      } else {
        this.setState({
          showSettings: this.state.showSettings,
          ...newState,
        });
      }
    }
  };

  hoverHandler = () => {
    this.setState({ showSettings: true });
  };

  outHandler = () => {
    this.setState({ showSettings: false });
  };

  toggleOpenOnLaunch = () => {
    let newState = !this.state.openOnLaunch;
    this.setState({
      ...this.state,
      openOnLaunch: newState,
    });
    if (chrome.storage) {
      chrome.storage.sync.set(
        { options: { openOnLaunch: newState } },
        function () {}
      );
    } else {
      localStorage.setItem(
        "options",
        JSON.stringify({ openOnLaunch: newState })
      );
    }
  };

  render() {
    return (
      <Wrapper>
        <Logo>
          net{" "}
          {/* <span role="img" aria-label="net">
            🥅
          </span> */}
          <Icon src={process.env.PUBLIC_URL + '/icons8-sport-net-50.png'}/>
        </Logo>
        <SettingsBox
          onMouseEnter={this.hoverHandler}
          onMouseLeave={this.outHandler}
        >
          {this.state.showSettings ? (
            <Settings
              toggleOpenOnLaunch={this.toggleOpenOnLaunch}
              openOnLaunch={this.state.openOnLaunch}
            />
          ) : (
            <SettingsContents>
              <Icon src={process.env.PUBLIC_URL + '/icons8-settings-50.png'}/>
            </SettingsContents>
          )}
        </SettingsBox>
      </Wrapper>
    );
  }
}
