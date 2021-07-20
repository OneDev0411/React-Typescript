import React from 'react'

import { mdiMessagePlusOutline } from '@mdi/js'
import { connect } from 'react-redux'
import { compose, withState, pure } from 'recompose'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  createRoom,
  toggleChatbar
} from '../../../../../store_actions/chatroom'
import Compose from '../Shared/compose-wrapper'
import Chatroom from '../Util/chatroom'

async function createNewRoom(recipients, createRoom, toggleChatbar) {
  // create room
  const roomId = await createRoom(recipients)

  // hide chatbar
  toggleChatbar(false)

  // open chat popup
  Chatroom.openChat(roomId)
}

const Button = ({ clickHandler }) => (
  <div className="new-room" onClick={() => clickHandler()}>
    <span className="compose-icon">
      <SvgIcon path={mdiMessagePlusOutline} />
    </span>
    New Message
  </div>
)

const enhance = compose(
  pure,
  withState('creating', 'onCreating', false),
  connect(null, { createRoom, toggleChatbar })
)

const CreateRoom = ({
  createRoom,
  toggleChatbar,
  /* internal states */
  onCreating,
  creating
}) => (
  <Compose
    TriggerButton={Button}
    title="New Message"
    working={creating === true}
    buttonTitle={creating ? 'Creating' : 'Create'}
    onButtonClick={async recps => {
      // change state to creating
      onCreating(true)
      // create room
      await createNewRoom(recps, createRoom, toggleChatbar)
      // remove creating satet
      onCreating(false)
    }}
  />
)

export default enhance(CreateRoom)
