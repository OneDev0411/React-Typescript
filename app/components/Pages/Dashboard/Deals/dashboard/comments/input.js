import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { addNotification as notify } from 'reapop'

import Message from '../../../Chatroom/Util/message'
import {
  changeTaskStatus,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'

import ActionButtons from './cta'

class CommentCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSaving: false,
      comment: '',
      rows: 2,
      height: 40
    }
  }

  onHeightChangeHandler(height) {
    this.setState({ height: height + 5 })
  }

  onCommentSaved() {
    // scroll to the end
    const el = document.getElementById('deals-task-scrollable')

    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  /**
   * post comment,
   * also change attention_requested flag and change status of task if requests by BO
   */
  async sendComment(attention_requested = null, task_status = null) {
    const {
      deal,
      task,
      user,
      changeTaskStatus,
      changeNeedsAttention,
      notify
    } = this.props

    const { comment } = this.state

    // clear message box
    this.setState({
      comment: '',
      rows: 1,
      isSaving: true
    })

    if (comment) {
      const message = {
        comment,
        author: user.id,
        room: task.room.id
      }

      // send message
      await Message.postTaskComment(task, message)
      this.onCommentSaved()
    }

    try {
      if (attention_requested !== null) {
        await changeNeedsAttention(deal.id, task.id, attention_requested)

        if (deal.is_draft) {
          this.props.confirmation({
            description:
              "We've captured your Notify Office request. As soon as this deal goes live, we'll forward it on to your back office.",
            confirmLabel: 'Got it. Thanks.',
            hideCancelButton: true
          })
        }
      }

      if (task_status !== null) {
        await changeTaskStatus(task.id, task_status)
        notify({
          message: `Task status has changed to ${task_status}`,
          status: 'success',
          dismissible: true
        })
      }
    } catch (e) {
      console.log(e)

      notify({
        message: 'Can not complete this action. try again',
        status: 'error',
        dismissible: true
      })
    }

    this.setState({
      isSaving: false
    })
  }

  render() {
    const { comment, rows, height, isSaving } = this.state
    const { task, autoFocus, onFocus, onBlur } = this.props
    const hasComment = comment.length > 0

    return (
      <div className="deal-comment-create">
        <Textarea
          autoFocus={autoFocus}
          dir="auto"
          placeholder="Write a comment ..."
          rows={rows}
          maxRows={3}
          style={{
            width: '100%',
            height: `${height}px`,
            transition: '0.2s ease-in all',
            border: hasComment ? '2px solid #2196f3' : ''
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          value={comment}
          onChange={e => this.setState({ comment: e.target.value })}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <div className="cta-container">
          <ActionButtons
            hasComment={hasComment}
            isSaving={isSaving}
            task={task}
            onSendComment={(notify, status) => this.sendComment(notify, status)}
          />
        </div>
      </div>
    )
  }
}

CommentCreate.defaultProps = {
  autoFocus: true
}

export default connect(
  ({ data }) => ({
    user: data.user
  }),
  { changeTaskStatus, changeNeedsAttention, notify, confirmation }
)(CommentCreate)
