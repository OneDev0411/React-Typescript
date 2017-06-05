import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

const getUser = function (list, index = 0) {
  const key = Object.keys(list)[index]
  return list[key].abbreviated_display_name
}

const MessageTyping = ({
  roomId,
  rooms
}) => {

  if (!roomId)
    return false

  // get user typing
  const { typing } = rooms[roomId]

  // get count of typers
  const count = _.size(typing)

  let message = ''

  if (count === 0) {
    message = ''
  } else if (count === 1) {
    message = `${getUser(typing, 0)} is typing ...`
  } else if (count === 2) {
    message = `${getUser(typing, 0)} and ${getUser(typing, 1)} are typing ...`
  } else {
    message = 'Several people are typing ...'
  }

  return <div>{ message }</div>
}

export default connect(s => ({
  rooms: s.chatroom.rooms
}))(MessageTyping)
