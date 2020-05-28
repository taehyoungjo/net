// const initialData = {
//   tasks: {
//     "task-1": { id: "task-1", content: "task 1" },
//     "task-2": { id: "task-2", content: "task 2" },
//     "task-3": { id: "task-3", content: "task 3" },
//     "task-4": { id: "task-4", content: "task 4" },
//   },
//   columns: {
//     "column-1": {
//       id: "column-1",
//       title: "To do",
//       taskIds: ["task-1", "task-2", "task-3", "task-4"],
//     },
//     "column-2": {
//       id: "column-2",
//       title: "In progress",
//       taskIds: [],
//     },
//     "column-3": {
//       id: "column-3",
//       title: "Done",
//       taskIds: [],
//     },
//   },
//   // Faciliate reordering of columns
//   columnOrder: ["column-1", "column-2", "column-3"],
// };

// const lS = JSON.parse(localStorage.getItem("board"));
// const initialData = lS
//   ? lS
//   : {
//       tasks: {},
//       columns: {},
//       // Faciliate reordering of columns
//       columnOrder: [],
//     };

/* global chrome */

// function readLocalStorage(key) {
//   return Promise((resolve, reject) => {
//     chrome.storage.sync.get([key], function (result) {
//       if (result) {
//         console.log("here");
//         resolve(1);
//       } else {
//         reject();
//       }
//     });
//   });
// }

// async function getFromLocal(key) {
//   let test = await readLocalStorage(key);
//   return test;
// }

// let test = getFromLocal("test");
// console.log(test);

let initialData;

function callback(lS) {
  let x = Object.keys(lS).length;
  initialData =
    x === 0
      ? {
          tasks: {},
          columns: {},
          // Faciliate reordering of columns
          columnOrder: [],
        }
      : lS;
}

chrome.storage.sync.get(["board"], callback);
//const lS = JSON.parse(localStorage.getItem("board"));
console.log("test", initialData);
export default initialData;
