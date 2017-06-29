import React from 'react'
import { compose,  withState, pure } from 'recompose'
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

const enhance = compose(
  pure,
  withState('creating', 'onCreating', false),
  connect(null, { createRoom })
)

const CreateRoom = ({
  createRoom,
  /* internal states */
  onCreating,
  creating
}) => (
  <Compose
    TriggerButton={Button}
    title="New Message"
    working={creating === true}
    buttonTitle={creating ? "Creating" : "Create"}
    onButtonClick={async recps => {
      // change state to creating
      onCreating(true)
      // create room
      await createNewRoom(recps, createRoom)
      // remove creating satet
      onCreating(false)
    }}
  />
)

export default enhance(CreateRoom)
