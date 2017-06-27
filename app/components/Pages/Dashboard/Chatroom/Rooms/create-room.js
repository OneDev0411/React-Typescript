import React from 'react'
import { connect } from 'react-redux'
import Compose from '../Shared/compose-wrapper'
import { createRoom } from '../../../../../store_actions/chatroom'
import Chatroom from '../Util/chatroom'

const Button = ({
  clickHandler
}) => (
  <div className="new-room" onClick={() => clickHandler()}>
    <i className="fa fa-edit"></i> New Message
  </div>
)

const CreateRoom = ({
  createRoom
}) => (
  <Compose
    TriggerButton={Button}
    title="New Message"
    buttonTitle="Create"
    onButtonClick={async recipients => {
      const roomId = await createRoom(recipients)
      Chatroom.openChat(roomId)
    }}
  />
)

export default connect(null, { createRoom })(CreateRoom)
