import React from 'react'
import { connect } from 'react-redux'

import Message from '../Util/message'
import Mention from '../Util/mention'
import Socket from '../../../../../services/socket/chat'
import MessageInput from './input'
import { insertDraft } from '../../../../../store_actions/chatroom'

class ComposeMessage extends React.Component {
  constructor(props) {
    super(props)
    this.isTyping = false
  }

  async componentDidMount() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)
    const { Observable } = Rx

    // create handler for text keypress
    const handler = Observable.fromEvent(this.text_message, 'keypress')

    handler
      .filter(e => (e.key ? e.key !== 'Enter' : e.keyCode !== 13))
      .throttleTime(1000)
      .do(() => this.onTyping())
      .debounceTime(3500)
      .subscribe(() => this.onTypingEnded())

    handler
      .filter(e => !e.ctrlKey && (e.key ? e.key === 'Enter' : e.keyCode === 13))
      .subscribe(() => this.sendMessage())
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.draft &&
      this.props.draft !== nextProps.draft &&
      !this.text_message.value
    ) {
      this.text_message.value = nextProps.draft
    }
  }

  onTyping() {
    if (this.isTyping) {
      return false
    }

    const { roomId } = this.props

    this.isTyping = true

    // emit message
    Socket.userIsTyping(roomId)
  }

  onTypingEnded() {
    const { roomId } = this.props

    if (!this.isTyping) {
      return false
    }

    this.isTyping = false

    // emit message
    Socket.userTypingEnded(roomId)
  }

  async sendMessage() {
    const { user, members, roomId } = this.props
    const isLocked = this.text_message.getAttribute('locked')

    if (isLocked === 'true') {
      return false
    }

    const comment = this.text_message.value.trim()

    if (comment.length === 0) {
      return false
    }

    // get mentions
    const mentions = Mention.extractMentionsFromText(members, comment)

    // send TypingEnded signal
    this.onTypingEnded()

    const message = {
      comment,
      mentions,
      author: user.id,
      room: roomId
    }

    Message.send(roomId, message, user).then(() =>
      this.props.onComposeMessage()
    )

    // clear message box
    this.text_message.value = ''
  }

  render() {
    const { members, isInstantChat, user, draft } = this.props

    return (
      <MessageInput
        roomId={this.props.roomId}
        user={user}
        mentionsSource={Mention.getList(members, user)}
        isInstantChat={isInstantChat}
        inputRef={ref => (this.text_message = ref)}
        onHeightChange={this.props.onHeightChange}
        onBlur={message => {
          if (
            message ||
            // /clean drft
            (!message && draft)
          ) {
            this.props.insertDraft({
              roomId: this.props.roomId,
              message
            })
          }
        }}
      />
    )
  }
}

function mapStateToProps({ chatroom }, props) {
  const room = chatroom.rooms && chatroom.rooms[props.roomId]
  const draft = chatroom.drafts[props.roomId]

  return {
    members: room ? room.users : null,
    draft
  }
}

export default connect(mapStateToProps, { insertDraft })(ComposeMessage)
