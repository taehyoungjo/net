import React from "react";
import styled from "styled-components";

const SettingsContents = styled.form`
  padding: 8px;
`;

const OolLabel = styled.p`
  display: inline;
`;

const Ool = styled.input`
  margin-left: 5px;
`;

export default class Options extends React.Component {
  render() {
    return (
      <SettingsContents>
        <OolLabel>Open on Launch</OolLabel>
        <Ool
          id="openOnLaunch"
          type="checkbox"
          checked={this.props.openOnLaunch}
          onChange={() => this.props.toggleOpenOnLaunch()}
        ></Ool>
      </SettingsContents>
    );
  }
}
