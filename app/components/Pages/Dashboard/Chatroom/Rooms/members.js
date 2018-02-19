import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import cn from 'classnames'
import Compose from '../Shared/compose-wrapper'
import UserAvatar from '../../../../Partials/UserAvatar'
import MembersIcon from '../../Partials/Svgs/MembersIcon'
import { addRecipients, removeMember } from '../../../../../store_actions/chatroom'
import LastSeen from './components/last-seen'
import Chatroom from '../Util/chatroom'

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

  const Button = ({
    clickHandler
  }) =>
    (
      <OverlayTrigger
        placement={isFullScreen ? 'bottom' : 'top'}
        overlay={<Tooltip id="popover-leave">Members</Tooltip>}
      >
        <span
          className="icon members"
          onClick={() => clickHandler()}
        >
          <MembersIcon width={iconSize} height={iconSize} />
          <span className="bdg">
            {room.users && room.users.length}
          </span>
        </span>
      </OverlayTrigger>
    )

  const RoomMembers = () => (
    <div className="chatroom-members">
      <div className="members-list">
        {
          room.users.map(roomMember => {
            let hasDeleteMemberIcon
              = room.users.length > 2 && roomMember.id !== user.id

            return <Row
              key={`MEMBER_${roomMember.id}`}
              className={cn('item', { 'group-members': hasDeleteMemberIcon })}
            >
              <Col sm={1} md={1} className="vcenter" style={{ padding: 0 }}>
                <UserAvatar
                  userId={roomMember.id}
                  name={roomMember.display_name}
                  image={roomMember.profile_image_url}
                  size={30}
                />
              </Col>
              <Col sm={10} md={10} className="vcenter" style={{ padding: 0 }}>
                <div className="title">{roomMember.display_name}</div>
                <LastSeen user={roomMember} />
              </Col>
              {
                hasDeleteMemberIcon &&
                  <Col sm={1} md={1} className="vcenter" style={{ padding: 0 }}>
                    <i
                      onClick={() => {
                        removeMember(room.id, roomMember.id)
                      }}
                      className="fa fa-times delete-icon"
                      aria-hidden="true"
                    />
                  </Col>
              }
            </Row>
          }
          )
        }
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

export default connect(s => ({
  user: s.data.user
}), {
  addRecipients,
  removeMember
})(ManageMembers)
