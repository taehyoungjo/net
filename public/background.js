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
  //   let existing = localStorage.getItem("board");
  //   // If test is an empty array (or null?)
  //   // test = array w/ one element
  //   let parsed = JSON.parse(existing);

  chrome.storage.sync.get(["board"], function (result) {
    let parsed = result.board;
    if (Object.keys(parsed).length === 0 || parsed.columnOrder.length == 0) {
      parsed = {
        tasks: {},
        columns: {},
        columnOrder: [],
      };
    }

    function getNextTaskId() {
      let taskId;
      let i = 1;
      while (true) {
        taskId = "task-" + i;
        if (!parsed.tasks[taskId]) {
          return i;
        }
        i++;
      }
    }

    // Create tasks
    let newTasks = {};
    let taskIds = [];
    let tId = getNextTaskId();
    let tName;
    for (let i = 0; i < tabs.length; i++) {
      // Check if extension URL
      tName = "task-" + tId;
      newTasks[tName] = {
        id: tName,
        content: tabs[i].url,
        pageTitle: tabs[i].title,
      };

      // Add to taskIds array for column
      taskIds.unshift(tName);
      tId++;
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

    chrome.storage.sync.set({ board: newState }, function () {
      console.log(newState);
    });
  });

  // localStorage.setItem("board", JSON.stringify(newState));
}

function sendTab(tab) {
  let url = tab.url;
  let pageTitle = tab.title;
  //   let existing = localStorage.getItem("board");

  //   // If test is an empty array (or null?)
  //   // test = array w/ one element
  //   let parsed = JSON.parse(existing);

  chrome.storage.sync.get(["board"], function (result) {
    let parsed = result.board;

    if (Object.keys(parsed).length === 0 || parsed.columnOrder.length == 0) {
      localStorage.setItem(
        "board",
        JSON.stringify({
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
        })
      );
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
      // localStorage.setItem("board", JSON.stringify(newState));
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
