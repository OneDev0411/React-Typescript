import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import ActionButton from 'components/Button/ActionButton'
import { setSelectedTask } from 'actions/deals'

class MessageAdmin extends React.Component {
  openGeneralTask = () =>
    this.props.setSelectedTask(this.props.tasks[this.GeneralTaskId])

  get Caption() {
    // todo: when there are some unread messages, we should show different message, that its ui isn't ready yet
    return 'Message Admin'
  }

  get GeneralTaskId() {
    return _.find(this.props.checklist.tasks, id =>
      this.props.tasks[id].title.includes('General Comments')
    )
  }

  render() {
    return (
      <ActionButton size="small" onClick={this.openGeneralTask}>
        {this.Caption}
      </ActionButton>
    )
  }
}

export default connect(
  null,
  { setSelectedTask }
)(MessageAdmin)
