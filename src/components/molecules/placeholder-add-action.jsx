import React from "react";
import { string } from "prop-types";
import styled from "styled-components";

const ActionPlaceholder = styled.div`
  display: flex;
  align-items: center;
  padding: 7px;
  width: 300px;
`;

const PlaceholderAddAction = ({ actionContent, ...props }) => {
  return <ActionPlaceholder {...props}>+ {actionContent}</ActionPlaceholder>;
};

PlaceholderAddAction.propTypes = {
  actionContent: string,
};

export default PlaceholderAddAction;
