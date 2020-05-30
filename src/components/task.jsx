import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";

const Container = styled.div`
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  overflow-wrap: break-word;
  position: relative;

  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) =>
    props.isDragging ? props.theme.bgHovering : props.theme.bgCard};
`;

const Text = styled.p`
  margin: 0;
  padding-left: ${(props) => (props.icon ? "24px" : "4px")};
  padding-right: ${(props) => (props.showButtons ? "48px" : "4px")};
`;

const Icon = styled.img`
  position: absolute;
  top: 10px;
  left: 6px;
`;

const Button = styled.button`
  ${(props) => (props.showButtons ? "" : "display:none;")}
`;

const ButtonClip = styled(Button)`
  background: none;
  border: none;
  position: absolute;
  top: 4px;
  right: 28px;
`;

const ButtonRemove = styled(Button)`
  background: none;
  border: none;
  float: right;
  position: absolute;
  top: 4px;
  right: 4px;
`;

const IconButton = styled.img`
  height: 1em;
  filter: invert(${({ theme }) => theme.hueInv});
`;

export default class Task extends React.Component {
  state = {
    showButtons: false,
  };

  hoverHandler = () => {
    this.setState({ showButtons: true });
  };

  outHandler = () => {
    this.setState({ showButtons: false });
  };

  linkHandler = () => {
    // window.location.href = this.props.task.content;
    window.open(this.props.task.content);
  };

  newTabHandler = (e) => {
    if (e.button === 1) {
      // middle mouse button click
      console.log("middle mouse click");
      window.open(this.props.task.content, "_blank");
    }
  };

  removeHandler = (e) => {
    e.stopPropagation();
    this.props.onRemoveCard(this.props.task.id);
  };

  clipHandler = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(this.props.task.content);
    const options = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: true,
      progress: undefined,
      draggable: true,
    };
    toast("📋 Copied to clipboard!", options);
  };

  render() {
    const { showButtons } = this.state;

    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            onMouseEnter={this.hoverHandler}
            onMouseLeave={this.outHandler}
            onClick={this.props.task.content ? this.linkHandler : null}
            onMouseDown={this.newTabHandler}
          >
            {this.props.task.content ? (
              <Icon
                height="16"
                width="16"
                src={
                  "http://www.google.com/s2/favicons?domain=" +
                  this.props.task.content
                }
              />
            ) : null}

            <Text showButtons={showButtons} icon={this.props.task.content}>
              {this.props.task.pageTitle
                ? this.props.task.pageTitle
                : this.props.task.content}
            </Text>

            <ButtonRemove
              type="button"
              showButtons={showButtons}
              onClick={this.removeHandler}
            >
              <IconButton
                src={process.env.PUBLIC_URL + "/icons8-multiply-50.png"}
              />
            </ButtonRemove>
            <ButtonClip
              type="button"
              showButtons={showButtons}
              onClick={this.clipHandler}
            >
              <IconButton
                src={process.env.PUBLIC_URL + "/icons8-copy-50.png"}
              />
            </ButtonClip>
          </Container>
        )}
      </Draggable>
    );
  }
}
