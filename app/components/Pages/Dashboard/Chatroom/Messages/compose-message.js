import React from 'react'
import Rx from 'rxjs/Rx'
import Socket from '../../../../../services/socket'

export default class ComposeMessage extends React.Component {
  constructor(props) {
    super(props)
    this.isTyping = false
  }

  componentDidMount() {
    const { Observable } = Rx

    // create handler for text keypress
    const handler = Observable
      .fromEvent(this.text_message, 'keypress')

    handler
    .filter(e => e.key !== 'Enter')
    .throttleTime(1000)
    .do(() => this.onTyping())
    .debounceTime(3500)
    .subscribe(() => this.onTypingEnded())

    handler
    .filter(e => e.key === 'Enter')
    .subscribe(() => this.sendMessage())
  }

  componentWillReceiveProps(nextProps) {
    this.text_message.focus()
  }

  onTyping() {
    if (this.isTyping)
      return false

    const { roomId } = this.props
    this.isTyping = true

    // emit message
    Socket.userIsTyping(roomId)
  }

  onTypingEnded() {
    const { roomId } = this.props

    if (!this.isTyping)
      return false

    this.isTyping = false

    // emit message
    Socket.userTypingEnded(roomId)
  }

  async sendMessage() {
    const { user, roomId } = this.props

    const comment = this.text_message.value.trim()

    if (comment.length === 0)
      return false

    // send TypingEnded signal
    this.onTypingEnded()

    const message = {
      comment,
      author: user.id,
      room: roomId,
      message_type: 'TopLevel',
      // image_url: "http://rechat.com/image_url/image_url.png",
      // document_url: "http://rechat.com/document_url/document_url.png",
      // video_url: "http://rechat.com/video_url/video_url.png",
      // image_thumbnail_url: "http://rechat.com/image_thumbnail_url/image_thumbnail_url.png",
      // recommendation: "edac34f8-2c28-11e7-af80-0242ac110003",
    }

    Socket.sendMessage(roomId, message, user)
    .then(() => this.props.onComposeMessage())

    // clear message box
    this.text_message.value = ''
  }

  render() {
    return (
      <div>
        <input
          autoFocus
          dir="auto"
          placeholder="Write a message ..."
          ref={ref => this.text_message = ref}
        />
      </div>
    )
  }
}
