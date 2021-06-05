import React from "react";

import Task from "./task";

export class InnerList extends React.Component {
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
