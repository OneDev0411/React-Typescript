import React from 'react'
import { connect } from 'react-redux'
import Compose from '../Shared/compose-wrapper'
import { createRoom } from '../../../../../store_actions/chatroom'
import Chatroom from '../Util/chatroom'

async function createNewRoom(recipients, createRoom) {
  const roomId = await createRoom(recipients)
  Chatroom.openChat(roomId)
}

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
    onButtonClick={async recps => await createNewRoom(recps, createRoom)}
  />
)

export default connect(null, { createRoom })(CreateRoom)
