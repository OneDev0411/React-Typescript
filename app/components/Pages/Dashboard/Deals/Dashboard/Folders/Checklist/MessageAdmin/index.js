import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { setSelectedTask } from 'actions/deals'

import Notification from '../Notification'

class MessageAdmin extends React.Component {
  getGeneralTaskId() {
    const taskId = _.find(
      this.props.checklist.tasks,
      id => this.props.tasks[id].task_type === 'GeneralComments'
    )

    return taskId ? this.props.tasks[taskId] : null
  }

  render() {
    const task = this.getGeneralTaskId()

    if (!task) {
      return false
    }

    return (
      <Notification
        task={task}
        tooltip="Message Admin"
        tooltipPlacement="left"
        style={{ marginRight: 0 }}
        onClick={this.props.setSelectedTask}
      />
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    tasks: deals.tasks
  }
}

export default connect(
  mapStateToProps,
  { setSelectedTask }
)(MessageAdmin)
