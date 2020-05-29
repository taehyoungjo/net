import React from "react";
import styled from "styled-components";
import { func } from "prop-types";

import FormAddList from "./form-add-list";
import PlaceholderAddAction from "./placeholder-add-action";

const Container = styled.div`
  margin: 8px;
  background-color: #f2f2f2;
  border-radius: 5px;
  width: 300px;
  display: table;
  flex-direction: column;

  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
`;

const PlaceholderWrapper = styled.div`
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 5px;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

class AddListWrapper extends React.Component {
  static propTypes = {
    onCreate: func,
  };

  state = {
    isOpen: false,
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (!this.state.isOpen) {
      return;
    }

    if (this.container.contains(event.target)) {
      return;
    }

    this.setFormState(false)();
  };

  setFormState = (isOpen) => () => {
    this.setState({ isOpen }, () => {
      if (isOpen) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    });
  };

  onSubmit = (title, imported) => {
    const { onCreate } = this.props;
    onCreate(title, imported);
    this.setFormState(false)();
  };

  getContainerRef = (node) => {
    this.container = node;
  };

  render() {
    return (
      <Container ref={this.getContainerRef}>
        {!this.state.isOpen && (
          <PlaceholderWrapper>
            <PlaceholderAddAction
              actionContent="Add another list"
              onClick={this.setFormState(true)}
            />
          </PlaceholderWrapper>
        )}
        {this.state.isOpen && (
          <FormAddList
            actionContent="Add List"
            onClose={this.setFormState(false)}
            onSubmit={this.onSubmit}
          />
        )}
      </Container>
    );
  }
}

export default AddListWrapper;
