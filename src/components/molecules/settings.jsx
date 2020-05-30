import React from "react";
import styled from "styled-components";
import { gray, dark, pastelPurple } from "../../themes";

const ColorPicker = styled.div``;

const Button = styled.button`
  border-radius: 4px;
  width: 24px;
  height: 24px;
  border: none;
  margin-bottom: 3px;
  margin-right: 4px;
`;

const PaletteDefault = styled(Button)`
  background-color: gainsboro;
`;

const PaletteDark = styled(Button)`
  background-color: black;
`;

const PaletteColorful = styled(Button)`
  background-color: pink;
`;

const PalettePastel = styled(Button)`
  background-color: #aa96da;
`;

const PaletteCool = styled(Button)`
  background-color: dodgerblue;
  margin-right: 0px;
`;

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
        <ColorPicker>
          <PaletteDefault
            type="button"
            onClick={this.props.themeHandler(gray)}
          />
          <PaletteDark type="button" onClick={this.props.themeHandler(dark)} />
          <PalettePastel
            type="button"
            onClick={this.props.themeHandler(pastelPurple)}
          />
          {/* <PaletteColorful />
          
          <PaletteCool /> */}
        </ColorPicker>
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
