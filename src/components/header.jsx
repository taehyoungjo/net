import React from "react";
import Settings from "./molecules/settings";
import styled from "styled-components";
import { gray, dark } from "../themes";

// Keep this here for linter
/* global chrome */

const Wrapper = styled.div`
  position: fixed;
  left: 10vw;
  top: 15vh;
`;

const Logo = styled.h1`
  display: inline;
  color: ${({ theme }) => theme.ftPrimary};
`;

const SettingsBox = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 24px;

  transition: background-color 0.2s ease;
  background-color: ${({ theme }) => theme.bgList};
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
`;

const SettingsContents = styled.h4`
  padding: 8px;
`;

const IconLogo = styled.img`
  height: 1em;
`;

const Icon = styled.img`
  height: 1em;
  filter: invert(${({ theme }) => theme.hueInv});
`;

export default class Header extends React.Component {
  state = {
    showSettings: false,
    openOnLaunch: true,
  };

  componentDidMount = () => {
    if (chrome.storage) {
      chrome.storage.sync.get(["options"], (result) => {
        console.log(result);

        const ooL = result.hasOwnProperty("options")
          ? result.options.hasOwnProperty("openOnLaunch")
            ? result.options.openOnLaunch
            : true
          : true;
        console.log(ooL);
        this.setState({
          showSettings: this.state.showSettings,
          openOnLaunch: ooL,
        });
      });
    } else {
      const options = JSON.parse(localStorage.getItem("options"));
      if (options === null) {
        this.setState({
          showSettings: this.state.showSettings,
          openOnLaunch: true,
        });
      } else {
        this.setState({
          showSettings: this.state.showSettings,
          openOnLaunch: options.hasOwnProperty("openOnLaunch")
            ? options.openOnLaunch
            : true,
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
    const newState = !this.state.openOnLaunch;
    this.setState({
      ...this.state,
      openOnLaunch: newState,
    });
    if (chrome.storage) {
      chrome.storage.sync.get(["options"], (result2) => {
        const theme = result2.options
          ? result2.options.theme
            ? result2.options.theme
            : gray
          : gray;

        chrome.storage.sync.set(
          { options: { openOnLaunch: newState, theme } },
          function () {}
        );
      });
    } else {
      const options = JSON.parse(localStorage.getItem("options"));
      const theme = options ? options.theme : gray;
      localStorage.setItem(
        "options",
        JSON.stringify({ openOnLaunch: newState, theme })
      );
    }
  };

  themeHandlerStorage = (value) => () => {
    this.props.themeHandler(value);
    console.log(this.state.openOnLaunch);
    if (chrome.storage) {
      chrome.storage.sync.set(
        {
          options: {
            openOnLaunch: this.state.openOnLaunch,
            theme: value,
          },
        },
        function () {}
      );
    } else {
      localStorage.setItem(
        "options",
        JSON.stringify({
          openOnLaunch: this.state.openOnLaunch,
          theme: value,
        })
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
          <IconLogo src={`${process.env.PUBLIC_URL}/icon48.png`} />
        </Logo>
        <SettingsBox
          onMouseEnter={this.hoverHandler}
          onMouseLeave={this.outHandler}
        >
          {this.state.showSettings ? (
            <Settings
              toggleOpenOnLaunch={this.toggleOpenOnLaunch}
              openOnLaunch={this.state.openOnLaunch}
              themeHandler={this.themeHandlerStorage}
            />
          ) : (
            <SettingsContents>
              <Icon src={`${process.env.PUBLIC_URL}/icons8-settings-50.png`} />
            </SettingsContents>
          )}
        </SettingsBox>
      </Wrapper>
    );
  }
}
