import React from 'react'
import { connect } from 'react-redux'

import IconButton from 'components/Button/IconButton'
import IconDelete from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import {
  setSelectedTask,
  deleteTask,
  changeNeedsAttention
} from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import Tooltip from 'components/tooltip'

import Message from '../../../../Chatroom/Util/message'

class DeleteTask extends React.Component {
  notifyOffice = async comment => {
    const message = {
      comment,
      author: this.props.user.id,
      room: this.props.task.room.id
    }

    // send message
    Message.postTaskComment(this.props.task, message)

    await this.props.changeNeedsAttention(
      this.props.deal.id,
      this.props.task.id,
      true
    )
  }

  requestDeleteTask = () => {
    if (this.props.task.is_deletable === false && !this.props.isBackOffice) {
      return this.props.confirmation({
        message: 'Delete a required task?',
        description: 'Only your back office can delete this task.',
        confirmLabel: 'Notify Office',
        needsUserEntry: true,
        inputDefaultValue: 'Please remove from my folder.',
        onConfirm: this.notifyOffice
      })
    }

    this.props.confirmation({
      message: 'Delete this task?',
      description: 'You cannot undo this action',
      confirmLabel: 'Delete',
      confirmButtonColor: 'danger',
      onConfirm: this.deleteTask
    })
  }

  deleteTask = () => {
    this.props.deleteTask(this.props.task.checklist, this.props.task.id)
    this.props.setSelectedTask(null)
  }

  render() {
    return (
      <Tooltip caption="Delete Task">
        <IconButton
          style={{ position: 'absolute', bottom: '1.65rem' }}
          isFit
          inverse
          type="button"
          onClick={this.requestDeleteTask}
        >
          <IconDelete />
        </IconButton>
      </Tooltip>
    )
  }
}

export default connect(
  ({ user }) => ({ user }),
  {
    setSelectedTask,
    deleteTask,
    changeNeedsAttention,
    confirmation
  }
)(DeleteTask)
