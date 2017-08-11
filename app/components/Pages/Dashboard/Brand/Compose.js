import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Compose from '../Chatroom/Shared/compose-wrapper'
import UserAvatar from '../../../Partials/UserAvatar'
import MembersIcon from '../Partials/Svgs/MembersIcon'
import { addRecipients } from '../../../../store_actions/chatroom'
import LastSeen from '../Chatroom/Rooms/components/last-seen'
import { Button } from 'react-bootstrap'

const ManageMembers = ({
                         addRecipients,
                         iconSize = 16,
                         room
                       }) => {
  // can user add member to this room
  const canAddMember = room.room_type !== 'Direct'

  const AddButton = ({
                       clickHandler
                     }) => (
    <Button
      className="addMember"
      onClick={() => clickHandler()}

    >
      Add Member
    </Button>
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
                <LastSeen user={user}/>
              </Col>
            </Row>
          )
        }
      </div>
    </div>
  )

  return (
    <Compose
      TriggerButton={AddButton}
      InitialValues={RoomMembers}
      showOnly={canAddMember === false}
      dropDownBox
      inline
      title="Members"
      buttonTitle="Add Members"
      onButtonClick={async recipients => await addRecipients(room.id, recipients)}
    />
  )
}

export default connect(null, { addRecipients })(ManageMembers)
