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

export { validate as default };
