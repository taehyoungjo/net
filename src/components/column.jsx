import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { string, func, bool, array } from "prop-types";

import Task from "./task";
import ListHeader from "./molecules/list-header";
import ListFooter from "./molecules/list-footer";
import FormAddCard from "./molecules/form-add-card";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar-button {
    display: none;
  }
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "lightgrey" : "white"};
  flex-grow: 1;
  min-height: 26px;
  width: 218px;
`;

const ScrollView = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100%;
  flex: 1;
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
      <Task
        key={task.id}
        onRemoveCard={this.props.onRemoveCard}
        task={task}
        index={index}
      />
    ));
  }
}

export default class Column extends React.Component {
  static propTypes = {
    listId: string,
    listType: string,
    onAddCard: func,
    onCloseForm: func,
    isFormShow: bool,
    getFormRef: func,
    cards: array,
  };

  state = {
    open: false,
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  setFormState = (open) => () => {
    this.setState({ open }, () => {
      if (open) {
        document.addEventListener("click", this.handleClickOutside);
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    });
  };

  handleClickOutside = (event) => {
    if (!this.state.open) {
      return;
    }
    if (this.form.contains(event.target)) {
      return;
    }
    this.setFormState(false)();
  };

  onAddCard = (title) => {
    const { onCreateCard } = this.props;
    onCreateCard(title);
  };

  onRemoveCard = (cardId) => {
    const { onRemoveCard } = this.props;
    onRemoveCard(cardId);
  };

  getFormRef = (node) => {
    this.form = node;
  };

  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            {/* <Title {...provided.dragHandleProps}>
              {this.props.column.title}
            </Title> */}
            <ScrollView>
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
                  ))} */}
                    <InnerList
                      tasks={this.props.tasks}
                      onRemoveCard={this.onRemoveCard}
                    />
                    {provided.placeholder}
                    {this.state.open && (
                      <FormAddCard
                        innerRef={this.getFormRef}
                        onClose={this.setFormState(false)}
                        onSubmit={this.onAddCard}
                      />
                    )}
                  </TaskList>
                )}
              </Droppable>
            </ScrollView>

            {!this.state.open && (
              <ListFooter onClick={this.setFormState(true)} />
            )}
          </Container>
        )}
      </Draggable>
    );
  }
}
