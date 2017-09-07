import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { addNotification as notify } from 'reapop'
import { Row, Col } from 'react-bootstrap'
import Message from '../../../Chatroom/Util/message'
import Deal from '../../../../../../models/Deal'
import { changeTaskStatus, changeNeedsAttention } from '../../../../../../store_actions/deals'
import ActionButtons from './cta'

class CommentCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: 2,
      height: 40,
    }
  }

  onHeightChangeHandler(height) {
    this.setState({ height: height + 5 })
  }

  setReference(ref) {
    this.text_message = ref
  }

  onCommentSaved() {
    const { notify } = this.props

    // scroll to the end
    const el = document.getElementById('deals-task-scrollable')
    el.scrollTop = el.scrollHeight

    notify({
      title: 'Message Sent',
      message: 'The message has been sent!',
      status: 'success',
      dismissible: false,
      dismissAfter: 3000
    })

    console.log(notification)
  }

  /**
   * post comment,
   * also change needs_attention flag and change status of task if requests by BO
   */
  async sendComment(needs_attention = null, task_status = null) {
    const { task, user, changeTaskStatus, changeNeedsAttention } = this.props
    const el = this.text_message
    const comment = el.value

    if (comment) {
      const message = {
        comment,
        author: user.id,
        room: task.room.id
      }

      // send message
      Message.postTaskComment(task, message)
      .then(() => this.onCommentSaved())
    }

    if (needs_attention !== null) {
      await changeNeedsAttention(task.id, needs_attention)
    }

    if (task_status !== null) {
      await changeTaskStatus(task.id, task_status)
    }

    // clear message box
    this.text_message.value = ''
    this.setState({ rows: 1 })
  }

  render() {
    const { rows, height } = this.state
    const { task, noCloseButton, onCloseTask } = this.props

    return (
      <div className="deal-comment-create">
        <Textarea
          autoFocus
          dir="auto"
          placeholder="Write a comment ..."
          rows={rows}
          maxRows={3}
          style={{ width: '100%', height: `${height}px`}}
          inputRef={ref => this.setReference(ref)}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <Row>
          <Col md={1} sm={1}>
            {
              noCloseButton !== true &&
              <button
                className="deal-button close-task"
                onClick={() => onCloseTask()}
              >
                <i className="fa fa-2x fa-angle-right" />
              </button>
            }
          </Col>

          <Col
            md={noCloseButton ? 12 : 11}
            sm={noCloseButton ? 12 : 11}
            style={{ textAlign: 'right'}}
          >
            <ActionButtons
              task={task}
              onSendComment={(notify, status) => this.sendComment(notify, status)}
            />
          </Col>
        </Row>

      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  user: data.user
}), { changeTaskStatus, changeNeedsAttention, notify })(CommentCreate)
