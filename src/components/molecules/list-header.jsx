import React from "react";
import styled from "styled-components";
import { string, func, object } from "prop-types";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  flex: 0 0 auto;
  padding: 12px 68px 10px 8px;
  min-height: 22px;
  position: relative;
`;

const ClickTarget = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
`;

const TitleInput = styled.textarea`
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

  background: transparent;
  max-height: 256px;
  min-height: 20px;
  height: 26px;
  resize: none;
  border: 1px solid transparent;
  box-shadow: none;
  font-weight: 700;
  overflow: hidden;
  word-wrap: break-word;
  margin-top: -4px;
  padding: 4px 7px;
  &:focus {
    background: rgba(255, 255, 255, 0.85);
  }
`;

// const TitleInput = Textarea.extend`

// `;

const Button = styled.button``;

const ButtonClip = styled(Button)`
  position: absolute;
  top: 4px;
  right: 20px;
  background: transparent;
`;

const ButtonRemove = styled(Button)`
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
`;

class ListHeader extends React.PureComponent {
  static propTypes = {
    title: string.isRequired,
    onUpdateTitle: func,
    onRemove: func,
    dragHandleProps: object,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.title === state.prevTitle) {
      return null;
    }

    return {
      title: props.title,
      prevTitle: props.title,
    };
  }

  state = {
    title: this.props.title,
    prevTitle: this.props.title,
    showTarget: true,
  };

  input = null;

  getInputRef = (node) => {
    this.input = node;
    this.resizeInput();
  };

  onTargetClick = (event) => {
    if (event.target === event.currentTarget) {
      this.input.focus();
      this.input.select();
    }

    this.setState({ showTarget: false });
  };

  handleKeydown = (event) => {
    if (event.which === 13 || event.which === 27) {
      this.input.blur();
    }
  };

  onBlur = () => {
    if (this.state.title) {
      this.props.onUpdateTitle(this.state.title);
    } else {
      this.setState({ title: this.props.title });
    }
    this.setState({ showTarget: true }, this.resizeInput);
  };

  onChange = (event) => {
    this.setState({ title: event.target.value }, this.resizeInput);
  };

  resizeInput = () => {
    if (this.input) {
      this.input.style.height = "auto";
      this.input.style.height = `${this.input.scrollHeight}px`;
      this.input.style.height = `${
        this.input.scrollHeight < 40 ? 26 : this.input.scrollHeight
      }px`;
    }
  };

  render() {
    const { title, showTarget } = this.state;
    const { onRemove, onClipboard, dragHandleProps } = this.props;
    return (
      <Container {...dragHandleProps}>
        {showTarget && <ClickTarget onClick={this.onTargetClick} />}
        <TitleInput
          spellCheck={false}
          autoCorrect={"false"}
          maxLength={512}
          ref={this.getInputRef}
          value={title}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.handleKeydown}
        />
        <ButtonClip onClick={onClipboard} />
        <ButtonRemove onClick={onRemove} />
      </Container>
    );
  }
}

export default ListHeader;
