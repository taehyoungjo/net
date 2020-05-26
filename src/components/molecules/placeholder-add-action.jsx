import React from "react";
import { string } from "prop-types";
import styled from "styled-components";

const ActionPlaceholder = styled.div`
  display: flex;
  align-items: center;
  padding: 7px;
  width: 220px;
`;

const PlaceholderAddAction = ({ actionContent, ...props }) => {
  return <ActionPlaceholder {...props}>+ Add a list</ActionPlaceholder>;
};

PlaceholderAddAction.propTypes = {
  actionContent: string,
};

export default PlaceholderAddAction;
