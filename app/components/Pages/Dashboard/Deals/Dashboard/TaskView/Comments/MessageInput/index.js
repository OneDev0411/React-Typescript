import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'components/notification'

import { changeTaskStatus, changeNeedsAttention } from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { blue } from 'views/utils/colors'

import Message from '../../../../../Chatroom/Util/message'

import CommentActions from '../CommentActions'

import { Container, Actions, Textarea, Divider } from './styled'

class CommentInput extends React.Component {
  state = {
    isSaving: false,
    comment: '',
    rows: 2,
    height: 40
  }

  onHeightChangeHandler = height => {
    if (isNaN(height)) {
      return false
    }

    this.setState({ height: height + 5 })
  }

  /**
   * post comment,
   * also change attention_requested flag and change status of task if requests by BO
   */
  sendComment = async (attention_requested = null, task_status = null) => {
    const {
      deal,
      task,
      user,
      changeTaskStatus,
      changeNeedsAttention
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
    }

    try {
      if (attention_requested !== null) {
        await changeNeedsAttention(deal.id, task.id, attention_requested)

        if (deal.is_draft) {
          this.props.confirmation({
            description:
              'We have captured your Notify Office request. As soon as this deal goes live, we will forward it on to your back office.',
            confirmLabel: 'Got it. Thanks.',
            hideCancelButton: true
          })
        }
      }

      if (task_status !== null) {
        await changeTaskStatus(task.id, task_status)

        this.props.notify({
          message: `Task status has changed to ${task_status}`,
          status: 'success',
          dismissible: true
        })
      }
    } catch (e) {
      console.log(e)

      this.props.notify({
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
    const hasComment = this.state.comment.length > 0

    return (
      <Container>
        <Textarea
          autoFocus={this.props.autoFocus}
          dir="auto"
          placeholder="Write a comment ..."
          rows={this.state.rows}
          maxRows={3}
          style={{
            width: '100%',
            height: `${this.state.height}px`,
            border: hasComment ? `1px solid ${blue.A200}` : ''
          }}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          value={this.state.comment}
          onChange={e => this.setState({ comment: e.target.value })}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <Divider />

        <Actions>
          <CommentActions
            hasComment={hasComment}
            isSaving={this.state.isSaving}
            task={this.props.task}
            isBackOffice={this.props.isBackOffice}
            onSendComment={this.sendComment}
          />
        </Actions>
      </Container>
    )
  }
}

CommentInput.defaultProps = {
  autoFocus: true
}

export default connect(
  ({ user }) => ({
    user
  }),
  { changeTaskStatus, changeNeedsAttention, notify, confirmation }
)(CommentInput)
