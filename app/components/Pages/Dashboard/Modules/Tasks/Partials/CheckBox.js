// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'

export default class Tasks extends Component {

  render() {
    const task = this.props.task
    let checkbox_style = S('w-18 h-18 bc-bfc2c3 bw-1 solid mr-10 bg-fff relative pointer pull-left br-2')
    let status_action = 'Done'
    let check_mark
    // If Done
    if (task && task.status === 'Done') {
      check_mark = (
        <img style={ S('absolute t-3 l-2 w-12') } src="/static/images/dashboard/icons/check-green.svg"/>
      )
      status_action = 'New'
      checkbox_style = {
        ...checkbox_style,
        ...S('bc-35b863')
      }
    }
    return (
      <div style={ checkbox_style } onClick={ this.props.editTaskStatus.bind(this, task, status_action) } >
        { check_mark }
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  task: React.PropTypes.object,
  editTaskStatus: React.PropTypes.func
}
