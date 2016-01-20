// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'

export default class Tasks extends Component {

  render() {
    const data = this.props.data
    const tasks = data.tasks
    let tasks_list = 'You have no tasks yet'
    if (tasks) {
      tasks_list = tasks.map(task => {
        return (
          <div className="task_row" style={ S('p-10 pointer') } key={ 'task-' + task.id }>
            <input style={ S('mr-15 pointer') } type="checkbox" />{ task.title }
          </div>
        )
      })
    }
    return (
      <div style={ S('minw-1000 pr-15') }>
       { tasks_list }
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object
}