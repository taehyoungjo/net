import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./task";
import ListHeader from "./molecules/list-header";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "lightgrey" : "white"};
  flex-grow: 1;
  min-height: 100px;
  width: 218px;
`;

class InnerList extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.tasks === this.props.tasks) {
      return false;
    }
    return true;
  }
  render() {
    return this.props.tasks.map((task, index) => (
      <Task key={task.id} task={task} index={index} />
    ));
  }
}

export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            {/* <Title {...provided.dragHandleProps}>
              {this.props.column.title}
            </Title> */}
            <ListHeader
              title={this.props.column.title}
              onUpdateTitle={this.props.onUpdateListTitle}
              onRemove={this.props.onRemoveList}
              dragHandleProps={provided.dragHandleProps}
              onClipboard={this.props.onClipboard(this.props.column)}
            />
            <Droppable droppableId={this.props.column.id} type="task">
              {(provided, snapshot) => (
                <TaskList
                  //   innerRef={provided.innerRef}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {/* {this.props.tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))} */}{" "}
                  <InnerList tasks={this.props.tasks} />
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    );
  }
}
