import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { Row, Col } from 'react-bootstrap'
import Message from '../../../../Chatroom/Util/message'
import Deal from '../../../../../../../models/Deal'

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

  async onSend(notify_admin = false) {
    const { task, user } = this.props
    const el = this.text_message
    const comment = el.value

    if (!comment) {
      return false
    }

    const message = {
      comment,
      author: user.id,
      room: task.room.id
    }

    // send message
    Message.send(task.room.id, message, user)
    .then(() => this.props.onCommentSaved())

    if (notify_admin) {
      await Deal.needsAttention(true)
    }

    // clear message box
    this.text_message.value = ''
    this.setState({ rows: 1})
  }

  render() {
    const { rows, height } = this.state

    return (
      <div className="deal-comment-create">
        <Textarea
          autoFocus
          dir="auto"
          placeholder="Write a comment ..."
          rows={rows}
          maxRows={5}
          style={{ width: '100%', height: `${height}px`}}
          inputRef={ref => this.setReference(ref)}
          onHeightChange={height => this.onHeightChangeHandler(height)}
        />

        <Row>
          <Col md={1} sm={1}>
            <button className="deal-button close-task">
              <i className="fa fa-2x fa-angle-right" />
            </button>
          </Col>

          <Col md={11} sm={11} style={{ textAlign: 'right'}}>
            <button
              className="deal-button add-comment"
              onClick={() => this.onSend()}
            >
              Add Comment
            </button>

            <button
              className="deal-button notify-admin"
              onClick={() => this.onSend(true)}
            >
              Notify Admin
            </button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({ data }) => ({
  user: data.user
}))(CommentCreate)
