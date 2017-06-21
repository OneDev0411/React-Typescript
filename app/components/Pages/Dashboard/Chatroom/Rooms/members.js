import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col } from 'react-bootstrap'
import Compose from '../Shared/compose-wrapper'
import UserAvatar from '../../../../Partials/UserAvatar'
import MembersIcon from '../../Partials/Svgs/MembersIcon'
import { addMembers } from '../../../../../store_actions/chatroom'

function getLastSeen(user) {
  const { last_seen_at } = user

  if (!last_seen_at)
    return 'Offline'

  return moment.unix(last_seen_at).fromNow()
}

const ManageMembers = ({
  addMembers,
  iconSize = 16,
  room
}) => {

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
                <div className="status">{ getLastSeen(user) }</div>
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
      dropDownBox={true}
      inline={true}
      title="Members"
      buttonTitle="Add Members"
      onButtonClick={async recipients => await addMembers(room.id, recipients)}
    />
  )
}

export default connect(null, { addMembers })(ManageMembers)
