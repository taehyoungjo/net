import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "@atlaskit/css-reset";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import initialData from "./initial-data";
import Column from "./components/column";
import Header from "./components/header";
import AddListWrapper from "./components/molecules/add-list-wrapper";

const Container = styled.div`
  display: flex;
  padding: 25vh 15vh 0;
`;

class InnerList extends React.PureComponent {
  render() {
    const {
      column,
      taskMap,
      index,
      onCreateCard,
      onRemoveCard,
      onRemoveList,
      onUpdateListTitle,
      onClipboard,
    } = this.props;
    const tasks = column.taskIds.map((taskId) => taskMap[taskId]);
    return (
      <Column
        column={column}
        tasks={tasks}
        index={index}
        onCreateCard={onCreateCard}
        onRemoveCard={onRemoveCard}
        onRemoveList={onRemoveList}
        onUpdateListTitle={onUpdateListTitle}
        onClipboard={onClipboard}
      />
    );
  }
}

class App extends React.Component {
  state = initialData;

  //   componentDidMount = () => {
  //     const newState = JSON.parse(localStorage.getItem("board"));
  //     this.setState(newState);
  //     console.log(localStorage.getItem("board"));
  //   };

  componentDidUpdate = () => {
    localStorage.setItem("board", JSON.stringify(this.state));
  };

  onDragStart = () => {
    // document.body.style.color = 'orange'
    // document.body.style.transition = 'background-color 0.2s ease
  };

  onDragUpdate = (update) => {
    //   const {destination} = update;
    //   const opacity = destination ? destination.index / Object.keys(this.state.tasks).length : 0;
    //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`
  };

  onDragEnd = (result) => {
    // document.body.style.color = 'inherit'

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(this.state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state,
        columnOrder: newColumnOrder,
      };
      this.setState(newState);
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    this.setState(newState);
  };

  onCreateList = (title) => {
    let newColId;
    let i = 1;
    while (true) {
      newColId = "column-" + i;
      if (!this.state.columns[newColId]) {
        break;
      }
      i++;
    }
    const newColumn = {
      id: newColId,
      title: title,
      taskIds: [],
    };
    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [newColId, ...this.state.columnOrder],
    };
    console.log(newState);
    this.setState(newState);
  };

  onRemoveList = (listId) => () => {
    const newColumns = this.state.columns;
    const deletedColsTasks = newColumns[listId].taskIds;
    // Remove tasks of list
    var newtasks = this.state.tasks;
    var taskId;
    for (var i = 0; i < deletedColsTasks.length; i++) {
      taskId = deletedColsTasks[i];
      delete newtasks[taskId];
    }

    delete newColumns[listId];
    const newState = {
      tasks: newtasks,
      columns: newColumns,
      columnOrder: this.state.columnOrder.filter((e) => e != listId),
    };
    console.log(newState);
    this.setState(newState);
  };

  onUpdateList = (list) => (title) => {
    const newColumn = {
      ...list,
      title: title,
    };

    const columnsWo = this.state.columns;
    delete columnsWo[list.id];

    const newState = {
      ...this.state,
      columns: {
        ...columnsWo,
        [newColumn.id]: newColumn,
      },
    };
    console.log(newState);
    this.setState(newState);
  };

  onClipboard = (column) => () => {
    var out = "";
    out += column.title;
    for (var i = 0; i < column.taskIds.length; i++) {
      out += "\n";
      out += this.state.tasks[column.taskIds[i]].content;
    }
    console.log(out);
    navigator.clipboard.writeText(out);
  };

  onCreateCard = (colId) => (title) => {
    console.log(colId, title);

    // Update tasks
    let newTaskId;
    let i = 1;
    while (true) {
      newTaskId = "task-" + i;
      if (!this.state.tasks[newTaskId]) {
        break;
      }
      i++;
    }
    const newTask = {
      id: newTaskId,
      content: title,
    };
    const newTasks = {
      ...this.state.tasks,
      [newTask.id]: newTask,
    };

    // Update column
    let newColumn = this.state.columns[colId];
    newColumn.taskIds.push(newTaskId);

    const newColumns = {
      ...this.state.columns,
      [newColumn.id]: newColumn,
    };

    const newState = {
      tasks: newTasks,
      columns: newColumns,
      columnOrder: this.state.columnOrder,
    };

    console.log(newState);
    this.setState(newState);
  };

  onRemoveCard = (colId) => (cardId) => {
    console.log(colId, cardId);

    // Remove task
    let newtasks = this.state.tasks;
    delete newtasks[cardId];

    const oldCol = this.state.columns[colId];

    // Moving from one list to another
    const newTaskIds = Array.from(oldCol.taskIds);
    const ind = newTaskIds.indexOf(cardId);
    newTaskIds.splice(ind, 1);
    const newCol = {
      ...oldCol,
      taskIds: newTaskIds,
    };

    const newState = {
      tasks: newtasks,
      columns: {
        ...this.state.columns,
        [newCol.id]: newCol,
      },
      columnOrder: this.state.columnOrder,
    };
    console.log(newState);
    this.setState(newState);
  };

  render() {
    return (
      <div>
        <Header />
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                <AddListWrapper onCreate={this.onCreateList} />
                {this.state.columnOrder.map((columnId, index) => {
                  const column = this.state.columns[columnId];
                  // const tasks = column.taskIds.map(
                  //   (taskId) => this.state.tasks[taskId]
                  // );

                  // return (
                  //   <Column
                  //     key={column.id}
                  //     column={column}
                  //     tasks={tasks}
                  //     index={index}
                  //   />
                  // );
                  return (
                    <InnerList
                      key={column.id}
                      column={column}
                      taskMap={this.state.tasks}
                      index={index}
                      onCreateCard={this.onCreateCard(column.id)}
                      onRemoveCard={this.onRemoveCard(column.id)}
                      onRemoveList={this.onRemoveList(column.id)}
                      onUpdateListTitle={this.onUpdateList(column)}
                      onClipboard={this.onClipboard}
                    />
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
