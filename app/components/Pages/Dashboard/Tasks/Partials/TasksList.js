// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'

export default class Tasks extends Component {

  render() {
    const data = this.props.data
    const tasks = data.tasks
    let tasks_list = 'You have no tasks yet'
    if (tasks) {
      tasks_list = tasks.map(task => {
        let checkbox_style = {
          ...S('w-18 h-18 bc-bfc2c3 bw-1 solid mr-10 bg-fff relative')
        }
        let status_action = 'Done'
        let check_mark
        let text_style = S('fw-500')
        // If Done
        if (task.status === 'Done') {
          check_mark = (
            <img style={ S('absolute t-3 l-2 w-12') } src="/images/dashboard/icons/check-green.svg"/>
          )
          status_action = 'New'
          text_style = {
            ...text_style,
            textDecoration: 'line-through'
          }
          checkbox_style = {
            ...checkbox_style,
            ...S('bc-35b863')
          }
        }
        let delete_class = ''
        let delete_text = 'Delete'
        if (data.deleting_task && data.deleting_task.id === task.id) {
          delete_class = ' disabled'
          delete_text = 'Deleting...'
        }
        return (
          <div className="task_row" style={ S('p-15 pointer h-50 relative') } key={ 'task-' + task.id }>
            <Button onClick={ this.props.deleteTask.bind(this, task) } style={ S('absolute r-5 t-5') } bsStyle="danger" className={ 'delete' + delete_class }>
              { delete_text }
            </Button>
            <div className="pull-left" style={ checkbox_style } onClick={ this.props.editTaskStatus.bind(this, task, status_action) } >
              { check_mark }
            </div>
            <span style={ text_style }>
              { task.title }
            </span>
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
  data: React.PropTypes.object,
  editTaskStatus: React.PropTypes.func,
  deleteTask: React.PropTypes.func
}