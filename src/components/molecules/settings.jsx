import React from "react";
import styled from "styled-components";
import { gray, dark, pastelPurple, coolPastel, blueGray } from "../../themes";

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

const PalettePastel = styled(Button)`
  background-color: #aa96da;
`;

const PaletteCool = styled(Button)`
  background-color: #b9cced;
`;

const PaletteBlue = styled(Button)`
  background-color: #2b2d42;
`;

const PaletteColorful = styled(Button)`
  background-color: #b9cced;
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

const Options = (props) => {
  return (
    <SettingsContents>
      <ColorPicker>
        <PaletteDefault type="button" onClick={props.themeHandler(gray)} />
        <PaletteDark type="button" onClick={props.themeHandler(dark)} />
        <PalettePastel
          type="button"
          onClick={props.themeHandler(pastelPurple)}
        />
        <PaletteCool type="button" onClick={props.themeHandler(coolPastel)} />
        <PaletteBlue type="button" onClick={props.themeHandler(blueGray)} />
      </ColorPicker>
      <OolLabel>Open on Launch</OolLabel>
      <Ool
        id="openOnLaunch"
        type="checkbox"
        checked={props.openOnLaunch}
        onChange={() => props.toggleOpenOnLaunch()}
      />
    </SettingsContents>
  );
};

export default Options;
