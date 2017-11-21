import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

const getUser = function (list, index = 0) {
  const key = Object.keys(list)[index]

  return list[key].abbreviated_display_name
}

const MessageTyping = ({
  typing = {}
}) => {
  // get count of typers
  const count = _.size(typing)

  let message = ''

  if (count === 0) {
    return false
  } else if (count === 1) {
    message = `${getUser(typing, 0)} is typing`
  } else if (count === 2) {
    message = `${getUser(typing, 0)} and ${getUser(typing, 1)} are typing`
  } else {
    message = 'Several people are typing'
  }

  return (
    <div className="message-typing">
      <span className="message">{message}</span>
      <img
        alt="loading"
        src="/static/images/loading-states/three-dots-blue.svg"
      />
    </div>
  )
}

function mapStateToProps({ chatroom }, ownProps) {
  const { roomId } = ownProps
  const { rooms } = chatroom

  if (!roomId || !rooms || !rooms[roomId]) {
    return { typing: {} }
  }

  return {
    typing: rooms[roomId].typing
  }
}

export default connect(mapStateToProps)(MessageTyping)
