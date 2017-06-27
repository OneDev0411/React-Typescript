import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Compose from '../Shared/compose-wrapper'
import UserAvatar from '../../../../Partials/UserAvatar'
import MembersIcon from '../../Partials/Svgs/MembersIcon'
import { addMembers } from '../../../../../store_actions/chatroom'
import LastSeen from './components/last-seen'

const ManageMembers = ({
  addMembers,
  iconSize = 16,
  room
}) => {

  // can user add member to this room
  const canAddMember = room.room_type !== 'Direct'

  const Button = ({
    clickHandler
  }) => (
    <span
      className="icon members"
      onClick={() => clickHandler()}
    >
      <MembersIcon width={iconSize} height={iconSize} />

      <span className="bdg">
        { room.users.length }
      </span>
    </span>
  )

  const RoomMembers = () => (
    <div className="chatroom-members">
      <div className="members-list">
        {
          room.users.map(user =>
            <Row
              key={`MEMBER_${user.id}`}
              className="item"
            >
              <Col sm={1} md={1} className="vcenter" style={{ padding: 0 }}>
                <UserAvatar
                  userId={user.id}
                  name={user.display_name}
                  image={user.profile_image_url}
                  size={30}
                />
              </Col>
              <Col sm={8} md={8} className="vcenter" style={{ padding: 0 }}>
                <div className="title">{ user.display_name }</div>
                <LastSeen user={user} />
              </Col>
            </Row>
          )
        }
      </div>
    </div>
  )

  return (
    <Compose
      TriggerButton={Button}
      InitialValues={RoomMembers}
      disabled={canAddMember === false}
      dropDownBox={true}
      inline={true}
      title="Members"
      buttonTitle="Add Members"
      onButtonClick={async recipients => await addMembers(room.id, recipients)}
    />
  )
}

export default connect(null, { addMembers })(ManageMembers)
