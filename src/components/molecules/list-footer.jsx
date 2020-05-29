import React from "react";
import styled from "styled-components";

import PlaceholderAddAction from "./placeholder-add-action";

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 0 5px 5px;

  &:hover {
    background: ${({ theme }) => theme.bgDark};
  }
`;

const ListFooter = (props) => {
  return (
    <Container {...props}>
      <PlaceholderAddAction actionContent="Add another card" />
    </Container>
  );
};

export default ListFooter;
