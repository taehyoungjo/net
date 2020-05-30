const validateTasks = (object) => {
  // let taskNames = []
  let tasksArray = Object.keys(object)
    .map((key) => [key, object[key]])
    .filter((task) => {
      // Check tasks (obj): Check that each task name is valid (unique, and taking the form task-i)
      let taskName = task[0];
      let result = /^task-\d+$/.test(taskName);
      if (!result) {
        return true;
      }

      // Check that each task has a valid id (matches task name), and one of content or pageTitle
      let taskObj = task[1];
      if (
        !Boolean(taskObj) ||
        !(
          Boolean(taskObj.id) &&
          (Boolean(taskObj.content) || Boolean(taskObj.pageTitle))
        ) ||
        taskObj.id !== taskName
      ) {
        return true;
      }
    });

  return tasksArray;
};

const validateColumns = (object, tasks) => {
  let taskNames = [];
  let colsArray = Object.keys(object)
    .map((key) => [key, object[key]])
    .filter((col) => {
      // Check tasks (obj): Check that each task name is valid (unique, and taking the form task-i)
      let colName = col[0];
      let result = /^column-\d+$/.test(colName);
      if (!result) {
        return true;
      }

      let colObj = col[1];
      if (
        !Boolean(colObj) ||
        !(Boolean(colObj.id) && Boolean(colObj.title)) ||
        colObj.id !== colName
      ) {
        return true;
      }

      // For each task in taskIds, check if unique and if exists in tasks
      for (let i = 0; i < colObj.taskIds.length; i++) {
        if (!Boolean(tasks[colObj.taskIds[i]])) {
          return true;
        }
        for (let j = 0; j < taskNames.length; j++) {
          if (taskNames[j] === colObj.taskIds[i]) {
            return true;
          }
        }
        taskNames.unshift(colObj.taskIds[i]);
      }
    });

  return colsArray;
};

const validateColorder = (colOrder, columns) => {
  if (!Array.isArray(colOrder)) {
    return ["columnOrder is not an array"];
  }
  let colNames = [];
  for (let i = 0; i < colOrder.length; i++) {
    if (!Boolean(columns[colOrder[i]])) {
      return ["column in columnOrder not in columns"];
    }
    for (let j = 0; j < colNames.length; j++) {
      if (colNames[j] === colOrder[i]) {
        return ["columns in columnOrder not unique"];
      }
    }
    colNames.unshift(colOrder[i]);
  }

  return [];
};

const validate = (object) => {
  if (!Boolean(object)) {
    return ["Object not provided"];
  }

  // Check that obj has three keys tasks, columns, columnOrder
  if (Boolean(object.tasks)) {
    let tasksValidated = validateTasks(object.tasks);
    if (tasksValidated.length !== 0) {
      return tasksValidated;
    }
  }

  if (Boolean(object.columns)) {
    // Check columns (obj): Check that each column name is valid (unique, and taking the form column-i)
    // Check that each column has a valid id (matches column name)
    // has title, and each taskId in the taskIds array exists in tasks and is unique
    let colsValidated = validateColumns(object.columns, object.tasks);
    if (colsValidated.length !== 0) {
      return colsValidated;
    }

    // Check columnOrder (array): Check that each column is in columns and that elements are unique
    let colOrderVal = validateColorder(object.columnOrder, object.columns);
    if (colOrderVal.length !== 0) {
      return colOrderVal;
    }
  }
  return [];
};

chrome.runtime.onInstalled.addListener(function () {
  const menu = {
    net: "Go to your net",
    current: "Send current tab",
    sendall: "Send all tabs",
    sendallclose: "Send and close all tabs",
    // sendleft: "Send tabs to left",
    // sendright: "Send tabs to right",
  };

  for (let key of Object.keys(menu)) {
    chrome.contextMenus.create({
      id: key,
      title: menu[key],
      type: "normal",
      contexts: ["all"],
    });
  }
});

function sendTabs(tabs) {
  chrome.storage.sync.get(["board"], function (result) {
    let parsed = result.board;
    if (Object.keys(parsed).length === 0 || parsed.columnOrder.length == 0) {
      parsed = {
        tasks: {},
        columns: {},
        columnOrder: [],
      };
    }

    // Create tasks
    let newTasks = {};
    let taskIds = [];
    let tId;
    let t = 0;
    let tName;
    for (let i = 0; i < tabs.length; i++) {
      while (true) {
        t++;
        tId = "task-" + t;
        if (!parsed.tasks[tId]) {
          break;
        }
      }

      // Check if extension URL
      tName = "task-" + t;
      newTasks[tName] = {
        id: tName,
        content: tabs[i].url,
        pageTitle: tabs[i].title,
      };

      // Add to taskIds array for column
      taskIds.unshift(tName);
    }

    // Get next ColId
    function getNextColId() {
      let colId;
      let i = 1;
      while (true) {
        colId = "column-" + i;
        if (!parsed.columns[colId]) {
          return i;
        }
        i++;
      }
    }

    let newColId = getNextColId();
    let newColName = "column-" + newColId;
    // Create columns
    let newCol = {
      id: newColName,
      title: "untitled",
      taskIds: taskIds,
    };

    // Create columnOrder
    let newState = {
      tasks: { ...newTasks, ...parsed.tasks },
      columns: {
        ...parsed.columns,
        [newCol.id]: newCol,
      },
      columnOrder: [newColName, ...parsed.columnOrder],
    };

    let r = validate(newState);
    if (r.length !== 0) {
      console.log("VALIDATION FAIL", r);
      return;
    }

    chrome.storage.sync.set({ board: newState }, function () {
      console.log(newState);
    });
  });
}

function sendTab(tab) {
  let url = tab.url;
  let pageTitle = tab.title;

  chrome.storage.sync.get(["board"], function (result) {
    let parsed = result.board;

    if (Object.keys(parsed).length === 0 || parsed.columnOrder.length == 0) {
      let newState = {
        tasks: {
          "task-1": { id: "task-1", content: url, pageTitle: pageTitle },
        },
        columns: {
          "column-1": {
            id: "column-1",
            title: "untitled",
            taskIds: ["task-1"],
          },
        },
        columnOrder: ["column-1"],
      };

      let r = validate(newState);
      if (r.length !== 0) {
        console.log("VALIDATION FAIL", r);
        return;
      }
      chrome.storage.sync.set({ board: newState }, function () {});
    } else {
      // find next available #
      let taskId;
      let i = 1;
      while (true) {
        taskId = "task-" + i;
        if (!parsed.tasks[taskId]) {
          break;
        }
        i++;
      }

      // update tasks obj
      let newTask = {
        id: taskId,
        content: url,
        pageTitle: pageTitle,
      };

      let newTasks = {
        [taskId]: newTask,
        ...parsed.tasks,
      };

      let firstColId = parsed.columnOrder[0];

      // update columns
      parsed.columns[firstColId].taskIds.unshift(taskId);

      // set state
      let newState = {
        tasks: newTasks,
        columns: parsed.columns,
        columnOrder: parsed.columnOrder,
      };

      let r = validate(newState);
      if (r.length !== 0) {
        console.log("VALIDATION FAIL", r);
        return;
      }
      chrome.storage.sync.set({ board: newState }, function () {
        console.log(newState);
      });
    }

    // Generating a popup that confirms save
    chrome.tabs.executeScript({
      file: "saveConfirmation.js",
    });
  });

  // Changing the icon
}

chrome.contextMenus.onClicked.addListener(function (info, tabs) {
  //   info = {
  //     editable: false
  //     menuItemId: "current"
  //   }
  //   tabs = {
  //     active: true
  //     audible: false
  //     autoDiscardable: true
  //     discarded: false
  //     favIconUrl: ""
  //     height: 756
  //     highlighted: true
  //     id: 35
  //     incognito: false
  //     index: 6
  //     mutedInfo: {muted: false}
  //     pinned: false
  //     selected: true
  //     status: "complete"
  //     title: "Extensions"
  //     url: "chrome://extensions/"
  //     width: 759
  //     windowId: 1
  //   }

  switch (info.menuItemId) {
    case "net":
      chrome.runtime.openOptionsPage();
      break;
    case "current":
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let tab = tabs[0];
        sendTab(tab);
      });

      break;
    case "sendall":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        sendTabs(tabs);
      });
      // chrome.runtime.openOptionsPage();
      break;
    case "sendallclose":
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        sendTabs(tabs);
        chrome.runtime.openOptionsPage(() => {
          let tids = tabs.map((t) => t.id);
          chrome.tabs.remove(tids, () => {});
        });
      });
      break;
    case "sendleft":
      break;
    case "sendright":
      break;
    default:
      break;
  }
});

chrome.runtime.onStartup.addListener(function () {
  chrome.storage.sync.get(["options"], function (result) {
    let options = result.options;
    if (!options || options.openOnLaunch) {
      chrome.runtime.openOptionsPage();
    }
  });
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let tab = tabs[0];
    sendTab(tab);
  });
});
