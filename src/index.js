import React from "react";
import ReactDOM from "react-dom";

import "@atlaskit/css-reset";

import { gray, dark } from "./themes";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
// import theme from "styled-theming";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Column from "./components/column";
import Header from "./components/header";
import AddListWrapper from "./components/molecules/add-list-wrapper";

// Keep this here for linter
/* global chrome */

const Container = styled.div`
  display: flex;
  padding: 25vh 15vw 0 10vw;
  width: max-content;
`;

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.bgBody};
    color: ${({ theme }) => theme.ftPrimary};
  }

  button {
    color: ${({ theme }) => theme.ftPrimary};
  }

  input, select, textarea{
    color: ${({ theme }) => theme.ftPrimary};
  }
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
      onOpenAll,
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
        onOpenAll={onOpenAll}
      />
    );
  }
}

class App extends React.Component {
  state = {
    tasks: {},
    columns: {},
    columnOrder: [],
  };

  componentDidMount = () => {
    //   const newState = JSON.parse(localStorage.getItem("board"));
    if (chrome.storage) {
      chrome.storage.sync.get(["board"], (result) => {
        let x = Object.keys(result).length;
        let newState =
          x === 0
            ? {
                tasks: {},
                columns: {},
                columnOrder: [],
              }
            : result;
        console.log(newState);
        this.setState(newState.board);
      });

      chrome.storage.onChanged.addListener(this.storageChange);
    } else {
      const newState = JSON.parse(localStorage.getItem("board"));
      if (newState === null) {
        this.setState({
          tasks: {},
          columns: {},
          columnOrder: [],
        });
      } else {
        this.setState(newState);
      }
    }
  };

  storageChange = (changes, namespace) => {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log(
        'Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue
      );
      if (key === "board") {
        console.log(storageChange.newValue);
        this.setState(storageChange.newValue);
      }
    }
  };

  componentDidUpdate = () => {
    console.log(this.state);
    if (chrome.storage) {
      chrome.storage.sync.set({ board: this.state }, function () {});
    } else {
      localStorage.setItem("board", JSON.stringify(this.state));
    }
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

  onCreateList = (title, imported) => {
    console.log(imported);
    if (Boolean(imported)) {
      // Parse imported
      let newlineSplit = imported
        .split("\n")
        .filter((e) => e !== "")
        .reverse();
      let importedArray = newlineSplit.map((e) => {
        let colonSplit = e.split(": ");
        let last = colonSplit[colonSplit.length - 1];

        function validURL(str) {
          var pattern = new RegExp(
            "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
              "(\\#[-a-z\\d_]*)?$",
            "i"
          ); // fragment locator
          return !!pattern.test(str);
        }

        let returnObj = {};
        // Check if last is URL
        if (validURL(last)) {
          // If it is, content = last, concatenate everything before
          // if length greater than 1 and set as pageTitle
          if (colonSplit.length > 1) {
            let pageTitle = "";
            let k = 0;
            for (k = 0; k < colonSplit.length - 2; k++) {
              pageTitle += colonSplit[k];
              pageTitle += ": ";
            }
            pageTitle += colonSplit[k];
            returnObj.pageTitle = pageTitle;
          } else {
            returnObj.pageTitle = "";
          }
          returnObj.content = last;
        } else {
          // If it isn't, concatenate everything if length greater
          // than 1 and set as pageTitle
          if (colonSplit.length > 0) {
            let pageTitle = "";
            let j = 0;
            for (j = 0; j < colonSplit.length - 1; j++) {
              pageTitle += colonSplit[j];
              pageTitle += ": ";
            }
            pageTitle += colonSplit[j];
            returnObj.pageTitle = pageTitle;
          } else {
            returnObj.pageTitle = "";
          }
          returnObj.content = "";
        }
        return returnObj;
      });

      console.log(importedArray);

      // Create tasks
      let tId;
      let t = 1;
      while (true) {
        tId = "task-" + t;
        if (!this.state.tasks[tId]) {
          break;
        }
        t++;
      }

      // Create tasks
      let newTasks = {};
      let taskIds = [];
      let tName;
      for (let i = 0; i < importedArray.length; i++) {
        // Check if extension URL
        tName = "task-" + t;
        newTasks[tName] = {
          id: tName,
          content: importedArray[i].content,
          pageTitle: importedArray[i].pageTitle,
        };

        // Add to taskIds array for column
        taskIds.unshift(tName);
        t++;
      }
      let newColId;
      let i = 1;
      while (true) {
        newColId = "column-" + i;
        if (!this.state.columns[newColId]) {
          break;
        }
        i++;
      }
      // Create column
      const newColumn = {
        id: newColId,
        title: Boolean(title) ? title : "untitled",
        taskIds: taskIds,
      };
      const newState = {
        tasks: { ...newTasks, ...this.state.tasks },
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
        columnOrder: [newColId, ...this.state.columnOrder],
      };
      console.log(newState);
      this.setState(newState);
    } else {
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
        title: Boolean(title) ? title : "untitled",
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
    }
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
      columnOrder: this.state.columnOrder.filter((e) => e !== listId),
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
    let out = "";
    let currTask;
    for (var i = 0; i < column.taskIds.length; i++) {
      out += "\n";
      currTask = this.state.tasks[column.taskIds[i]];
      if (currTask.pageTitle) {
        out += currTask.pageTitle;
      }
      if (currTask.content && currTask.pageTitle) {
        out += ": ";
      }
      if (currTask.content) {
        out += currTask.content;
      }
    }
    navigator.clipboard.writeText(out);

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

  onCreateCard = (colId) => (title, url) => {
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
      content: url,
      pageTitle: title,
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

  onOpenAll = (column) => () => {
    for (var i = 0; i < column.taskIds.length; i++) {
      window.open(this.state.tasks[column.taskIds[i]].content);
    }
  };

  render() {
    return (
      <div>
        <ThemeProvider theme={gray}>
          <GlobalStyles />
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
                        onOpenAll={this.onOpenAll(column)}
                      />
                    );
                  })}
                  {provided.placeholder}
                </Container>
              )}
            </Droppable>
          </DragDropContext>
          <ToastContainer />
        </ThemeProvider>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
