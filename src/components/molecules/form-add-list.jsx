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
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  padding: 8px 8px;
  outline: none;
  overflow: hidden;
  border-width: 0px;
  height: ${ifProp("small", "32px", "48px")};
  font-size: ${ifProp("small", "14px", "16px")};

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

// const ButtonClose = styled(Button)`
//   color: ${getPaletteColor('shades', 400)};
//   background: transparent;
// `

const ButtonClose = styled(Button)`
  background: none;
  border: none;
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
  };

  onChangeTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { title } = this.state;
    if (this.props.onSubmit && Boolean(title)) {
      this.props.onSubmit(title);
    }
  };

  render() {
    const { children, actionContent, onClose, ...props } = this.props;
    return (
      <Form {...props} onSubmit={this.onSubmit}>
        <Input
          small
          autoFocus
          placeholder="Enter list title..."
          style={{ fontWeight: 700 }}
          value={this.state.title}
          onChange={this.onChangeTitle}
        />
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
