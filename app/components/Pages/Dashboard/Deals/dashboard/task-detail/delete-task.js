import React from 'react'
import { connect } from 'react-redux'
import { confirmation } from '../../../../../../store_actions/confirmation'
import Message from '../../../Chatroom/Util/message'
import {
  setSelectedTask,
  deleteTask,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'
import { isBackOffice } from '../../../../../../utils/user-teams'
import DeleteIcon from 'views/components/SvgIcons/DeleteOutline/IconDeleteOutline'
import IconButton from 'components/Button/IconButton'

class DeleteTask extends React.Component {
  constructor(props) {
    super(props)
  }

  async notifyOffice(comment) {
    const { deal, user, task, changeNeedsAttention } = this.props
    const message = {
      comment,
      author: user.id,
      room: task.room.id
    }

    // send message
    Message.postTaskComment(task, message).then(() => this.onCommentSaved())

    await changeNeedsAttention(deal.id, task.id, true)
  }

  onCommentSaved() {
    // scroll to the end
    const el = document.getElementById('deals-task-scrollable')

    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  requestDeleteTask = () => {
    const { isBackOffice, task } = this.props

    if (task.is_deletable === false && !isBackOffice) {
      return this.props.confirmation({
        message: 'Delete a required task?',
        description: 'Only your back office can delete this task.',
        confirmLabel: 'Notify Office',
        needsUserEntry: true,
        inputDefaultValue: 'Please remove from my folder.',
        onConfirm: comment => this.notifyOffice(comment)
      })
    }

    this.props.confirmation({
      message: 'Delete this task?',
      description: 'You cannot undo this action',
      confirmLabel: 'Delete',
      confirmButtonColor: 'danger',
      onConfirm: () => this.deleteTask(task)
    })
  }

  deleteTask(task) {
    const { setSelectedTask, deleteTask } = this.props

    deleteTask(task.checklist, task.id)
    setSelectedTask(null)
  }

  render() {
    return (
      <IconButton
        appearance="icon"
        inverse
        iconSize="large"
        onClick={this.requestDeleteTask}
      >
        <DeleteIcon />
      </IconButton>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    user,
    checklists: deals.checklists,
    isBackOffice: isBackOffice(user)
  }),
  {
    setSelectedTask,
    deleteTask,
    changeNeedsAttention,
    confirmation
  }
)(DeleteTask)
