import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Compose from '../../Chatroom/Shared/compose-wrapper'
import UserAvatar from '../../../../Partials/UserAvatar/index'
import LastSeen from '../../Chatroom/Rooms/components/last-seen'
import { Button } from 'react-bootstrap'

const ManageMembers = ({
  addMembers,
  members
}) => {
  const AddButton = ({
    clickHandler
  }) =>
    (
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
          members.map(user =>
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
      TriggerButton={AddButton}
      InitialValues={RoomMembers}
      showOnly={false}
      dropDownBox
      inline
      title="Members"
      buttonTitle="Add Members"
      onButtonClick={recipients => addMembers(recipients)}
    />
  )
}

export default ManageMembers
