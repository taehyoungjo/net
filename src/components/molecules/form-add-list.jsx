import React from "react";
import styled from "styled-components";
import { string, func, node } from "prop-types";
import { ifProp } from "styled-tools";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 7px;
  width: 300px;
`;

const Input = styled.input`
  border-radius: 0px;
  outline: none;
  overflow: hidden;
  border-width: 0px;
  background: transparent;
  height: ${ifProp("small", "32px", "48px")};
  font-size: ${ifProp("small", "14px", "16px")};

  width: 264px;
  padding: 0px 0px 3px 0px;
  margin: 0px 0px 3px 0px;
  border-bottom: solid 2px lightgrey;

  &::placeholder {
  }

  &:focus {
  }
`;

const Button = styled.button`
  background: none;
  border: none;
`;

const Action = styled.div`
  margin-top: 4px;
  display: grid;
  grid-auto-flow: column;
  gap: 4px;
  grid-gap: 4px;
  justify-items: start;
  justify-content: start;
  align-items: center;
`;

const ButtonClose = styled(Button)`
  background: none;
  border: none;
`;

const Textarea = styled.textarea`
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
  padding: 6px 8px;
  display: block;
  border-radius: 3px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
  }
`;

const Paper = styled.div`
  transition: background-color 0.2s ease;

  background: ${({ theme }) => theme.bgCard};
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  padding: 8px;
  overflow: hidden;
  position: relative;
`;

const PaperInput = styled(Paper)`
  margin-bottom: 4px;
  height: auto;
`;

const ImportInput = styled(Textarea)`
  border: none;
  background: transparent;
  box-shadow: none;
  resize: none;
  max-height: 200px;
  min-height: 125px;
  word-wrap: break-word;
  padding: 0;
  &:hover,
  &:focus {
    border: none;
    background: transparent;
    box-shadow: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    transition: background-color 0.2s ease;

    background: white;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    transition: background-color 0.2s ease;

    background: #f1f1f1;
    border-radius: 4px;
  }
`;

class FormAddInline extends React.PureComponent {
  static propTypes = {
    children: node,
    actionContent: string,
    onSubmit: func,
    onClose: func,
  };

  state = {
    title: "",
    imported: "",
  };

  onChangeTitle = (event) => {
    this.setState({ ...this.state, title: event.target.value });
  };

  onChangedImported = (event) => {
    this.setState({ ...this.state, imported: event.target.value });
    this.resizeInput();
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { title, imported } = this.state;
    console.log(imported);
    if (this.props.onSubmit) {
      this.props.onSubmit(title, imported);
    }
  };

  getInputRef = (node) => {
    this.input = node;
  };

  resizeInput = () => {
    this.input.style.height = "auto";
    this.input.style.height = `${this.input.scrollHeight}px`;
  };

  render() {
    const { children, actionContent, onClose, ...props } = this.props;
    return (
      <Form {...props} onSubmit={this.onSubmit}>
        <PaperInput>
          <Input
            small
            autoFocus
            placeholder="Enter list title..."
            style={{ fontWeight: 700 }}
            value={this.state.title}
            onChange={this.onChangeTitle}
          />
          <ImportInput
            value={this.state.imported}
            ref={this.getInputRef}
            onChange={this.onChangedImported}
            placeholder="Paste to import.                                                        ––                                                                                      Ex:                                                                                Google: https://www.google.com/             Some useful text! https://www.youtube.com/"
          ></ImportInput>
        </PaperInput>

        <Action>
          <Button type="submit" variant="Green">
            {actionContent}
          </Button>
          <ButtonClose type="button" icon="Close" onClick={onClose}>
            Close
          </ButtonClose>
        </Action>
      </Form>
    );
  }
}

export default FormAddInline;
