import React from "react";
import { func } from "prop-types";
import styled from "styled-components";
// import debounce from "lodash.debounce";

//import getPaletteColor from "../../../services/getPaletteColor";
// import { Button, Paper, Textarea } from "../atoms";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
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

const Button = styled.button`
  background: none;
  border: none;
`;

const ButtonClose = styled(Button)`
  background: none;
  border: none;
`;

const Paper = styled.div`
  background: white;
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

const TitleInput = styled(Textarea)`
  border: none;
  background: transparent;
  box-shadow: none;
  resize: none;
  max-height: 162px;
  min-height: 54px;
  word-wrap: break-word;
  padding: 0;
  &:hover,
  &:focus {
    border: none;
    background: transparent;
    box-shadow: none;
  }
`;

class FormAddCard extends React.PureComponent {
  static propTypes = {
    onSubmit: func,
    onClose: func,
  };

  state = {
    title: "",
  };

  componentDidMount() {
    this.setState({ title: "" }, () => {});
    this.input.focus();
  }

  onChange = (event) => {
    const title = event.target.value;
    // this.setState(
    //   { title },
    //   debounce(
    //     () => {
    //       window.sessionStorage.setItem("title", title);
    //     },
    //     50,
    //     { leading: false, trailing: true }
    //   )
    // );
    this.setState({ title });
    this.resizeInput();
  };

  onClose = () => {
    this.clearValue();
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleKeydown = (event) => {
    if (event.which === 27 && this.props.onClose) {
      this.onClose();
    }

    if (event.which === 13) {
      event.preventDefault();
      if (this.props.onSubmit && Boolean(this.state.title)) {
        this.props.onSubmit(this.state.title);
        this.clearValue();
      }
    }
  };

  getInputRef = (node) => {
    this.input = node;
  };

  resizeInput = () => {
    this.input.style.height = "auto";
    this.input.style.height = `${this.input.scrollHeight}px`;
  };

  clearValue = () => {
    this.setState({ title: "" }, () => {
      this.input.scrollIntoView();
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.onSubmit && Boolean(this.state.title)) {
      this.props.onSubmit(this.state.title);
      this.clearValue();
    }
  };

  onFocus = () => {
    this.input.scrollIntoView();
  };

  render() {
    return (
      <Form ref={this.props.innerRef} onSubmit={this.onSubmit}>
        <PaperInput>
          <TitleInput
            ref={this.getInputRef}
            placeholder="Enter a title for this card..."
            value={this.state.title}
            onChange={this.onChange}
            onBlur={this.resizeInput}
            onKeyDown={this.handleKeydown}
            onFocus={this.onFocus}
          />
        </PaperInput>
        <Action>
          <Button type="submit">Add Card</Button>
          <ButtonClose type="button" onClick={this.onClose}>
            Close
          </ButtonClose>
        </Action>
      </Form>
    );
  }
}

export default FormAddCard;
