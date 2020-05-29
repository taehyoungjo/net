import React from "react";
import styled from "styled-components";

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
  background-color: lavender;
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
          <PaletteDefault />
          <PaletteDark />
          <PaletteColorful />
          <PalettePastel />
          <PaletteCool />
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
