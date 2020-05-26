chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: "#3aa757" }, function () {
    console.log("The color is green.");
  });
  chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;

      let existing = localStorage.getItem("board");

      // If test is an empty array (or null?)
      // test = array w/ one element
      let parsed = JSON.parse(existing);
      if (existing === null || parsed.columnOder.length == 0) {
        localStorage.setItem(
          "board",
          JSON.stringify({
            tasks: {
              "task-1": { id: "task-1", content: url },
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
      }

      // Generating a popup that confirms save
      // Or changing the icon
    });
  });
});
