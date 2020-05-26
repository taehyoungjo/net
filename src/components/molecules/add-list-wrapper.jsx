import React from "react";
import styled from "styled-components";
import { func } from "prop-types";

import FormAddList from "./form-add-list";
import PlaceholderAddAction from "./placeholder-add-action";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;
  height: 36px;

  display: flex;
  flex-direction: column;
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

  onSubmit = (title) => {
    const { onCreate } = this.props;
    onCreate(title);
    this.setFormState(false)();
  };

  getContainerRef = (node) => {
    this.container = node;
  };

  render() {
    return (
      <Container ref={this.getContainerRef}>
        <PlaceholderAddAction
          actionContent="Add another list"
          onClick={this.setFormState(true)}
        />
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
