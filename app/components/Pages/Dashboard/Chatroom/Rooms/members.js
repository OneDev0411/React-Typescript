import React from 'react'

import { Tooltip, Grid } from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import cn from 'classnames'
import { connect } from 'react-redux'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import UserAvatar from 'components/UserAvatar'

import {
  addRecipients,
  removeMember
} from '../../../../../store_actions/chatroom'
import MembersIcon from '../../Partials/Svgs/MembersIcon'
import Compose from '../Shared/compose-wrapper'
import Chatroom from '../Util/chatroom'

import LastSeen from './components/last-seen'

const ManageMembers = ({
  addRecipients,
  removeMember,
  iconSize = 16,
  room,
  user,
  isFullScreen
}) => {
  // can user add member to this room
  const canAddMember = room.room_type !== 'Direct'

  const Button = ({ clickHandler }) => (
    <Tooltip placement={isFullScreen ? 'bottom' : 'top'} title="Members">
      <span className="icon members" onClick={() => clickHandler()}>
        <MembersIcon width={iconSize} height={iconSize} />
        <span className="bdg">{room.users && room.users.length}</span>
      </span>
    </Tooltip>
  )

  const RoomMembers = () => (
    <div className="chatroom-members u-scrollbar">
      <div className="members-list">
        {room.users.map(roomMember => {
          let hasDeleteMemberIcon =
            room.users.length > 2 && roomMember.id !== user.id

          return (
            <Grid
              container
              key={`MEMBER_${roomMember.id}`}
              className={cn('item', { 'group-members': hasDeleteMemberIcon })}
            >
              <Grid
                item
                sm={1}
                md={1}
                className="vcenter"
                style={{ padding: 0 }}
              >
                <UserAvatar
                  userId={roomMember.id}
                  name={roomMember.display_name}
                  image={roomMember.profile_image_url}
                  size={30}
                  color="#000000"
                />
              </Grid>
              <Grid
                item
                sm={10}
                md={10}
                className="vcenter"
                style={{ padding: 0 }}
              >
                <div className="title">{roomMember.display_name}</div>
                <LastSeen user={roomMember} />
              </Grid>
              {hasDeleteMemberIcon && (
                <Grid
                  item
                  sm={1}
                  md={1}
                  className="vcenter"
                  style={{ padding: 0 }}
                >
                  <SvgIcon
                    path={mdiClose}
                    onClick={() => {
                      removeMember(room.id, roomMember.id)
                    }}
                    className="delete-icon"
                  />
                </Grid>
              )}
            </Grid>
          )
        })}
      </div>
    </div>
  )

  return (
    <Compose
      roomUsers={room.users}
      TriggerButton={Button}
      InitialValues={RoomMembers}
      showOnly={canAddMember === false}
      dropDownBox
      inline
      title="Members"
      buttonTitle="Add Members"
      onButtonClick={async recipients => addRecipients(room.id, recipients)}
      OnLeaveClick={() => {
        Chatroom.leaveRoom(user.id, room)
      }}
      directRoom={room.room_type === 'Direct'}
    />
  )
}

export default connect(
  s => ({
    user: s.data.user
  }),
  {
    addRecipients,
    removeMember
  }
)(ManageMembers)
