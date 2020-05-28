import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(50, 50, 93, 0.1);
  overflow-wrap: break-word;
  position: relative;

  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
`;

const Text = styled.p`
  margin: 0;
  padding-left: 24px;
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
    // for new tab
    // window.open(this.props.task.content, '_blank')
    window.location.href = this.props.task.content
  }

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
            onClick={this.linkHandler}
          >
            {/* <a href={this.props.task.content} target="_blank">
              {this.props.task.content}
            </a> */}
            <Icon
              height="16"
              width="16"
              src={
                "http://www.google.com/s2/favicons?domain=" +
                this.props.task.content
              }
            />
            <Text showButtons={showButtons}>{this.props.task.content}</Text>

            <ButtonRemove
              type="button"
              showButtons={showButtons}
              onClick={() => this.props.onRemoveCard(this.props.task.id)}
            >
              X
            </ButtonRemove>
            <ButtonClip
              type="button"
              showButtons={showButtons}
              onClick={() => {
                console.log(this.props.task.content);
                navigator.clipboard.writeText(this.props.task.content);
              }}
            >
              C
            </ButtonClip>
          </Container>
        )}
      </Draggable>
    );
  }
}
