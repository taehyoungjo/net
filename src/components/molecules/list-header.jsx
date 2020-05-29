import React from "react";
import styled from "styled-components";
import { string, func, object } from "prop-types";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  flex: 0 0 auto;
  padding: 12px ${(props) => (props.showButtons ? "76px" : "8px")} 10px 8px;
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
  resize: none;
  border: 1px solid transparent;
  box-shadow: none;
  font-weight: 600;
  overflow: hidden;
  word-wrap: break-word;
  margin-top: -4px;
  padding: 0px 0px;

  color: ${({ theme }) => theme.ftPrimary};

  &:focus {
    background: ${({ theme }) => theme.bgCard};
  }
`;

const Button = styled.button`
  ${(props) => (props.showButtons ? "" : "display:none;")}
`;

const ButtonOpenAll = styled(Button)`
  position: absolute;
  top: 4px;
  right: 52px;
  background: none;
  border: none;
`;

const ButtonClip = styled(Button)`
  position: absolute;
  top: 4px;
  right: 28px;
  background: none;
  border: none;
`;

const ButtonRemove = styled(Button)`
  position: absolute;
  top: 4px;
  right: 4px;
  background: none;
  border: none;
`;

const Icon = styled.img`
  height: 1em;
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
    showButtons: false,
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

  hoverHandler = () => {
    this.setState({ showButtons: true });
  };

  outHandler = () => {
    this.setState({ showButtons: false });
  };

  render() {
    const { title, showTarget, showButtons } = this.state;
    const { onRemove, onClipboard, onOpenAll, dragHandleProps } = this.props;
    return (
      <Container
        onMouseEnter={this.hoverHandler}
        onMouseLeave={this.outHandler}
        showButtons={showButtons}
        {...dragHandleProps}
      >
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
        <ButtonOpenAll
          type="button"
          showButtons={showButtons}
          onClick={onOpenAll}
        >
          <Icon src={process.env.PUBLIC_URL + "/open.png"} />
        </ButtonOpenAll>
        <ButtonClip
          type="button"
          showButtons={showButtons}
          onClick={onClipboard}
        >
          <Icon src={process.env.PUBLIC_URL + "/icons8-copy-50.png"} />
        </ButtonClip>
        <ButtonRemove
          type="button"
          showButtons={showButtons}
          onClick={onRemove}
        >
          <Icon src={process.env.PUBLIC_URL + "/icons8-multiply-50.png"} />
        </ButtonRemove>
      </Container>
    );
  }
}

export default ListHeader;
