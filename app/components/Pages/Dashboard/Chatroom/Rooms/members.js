import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import moment from 'moment'
import Compose from '../../../../Partials/Compose'
import MembersIcon from '../../Partials/Svgs/MembersIcon'
import UserAvatar from '../../../../Partials/UserAvatar'
import { addMembers } from '../../../../../store_actions/chatroom'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {}),
  connect(null, { addMembers })
)

function hasRecipients(recipients) {
  const recps = []
    .concat(recipients.users, recipients.emails, recipients.phone_numbers)
    .filter(recp => recp !== undefined)

  return recps.length > 0
}

const ManageMembers = ({
  room,
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients,
  addMembers,
  iconSize = 16
}) => {

  function getLastSeen(user) {
    const { last_seen_at } = user

    if (!last_seen_at)
      return 'Offline'

    return moment.unix(last_seen_at).fromNow()
  }

  return (
    <span>
      <span
        className="icon members"
        onClick={() => onChangeComposeModal(!showComposeModal)}
      >
        <MembersIcon width={iconSize} height={iconSize} />

        <span className="bdg">
          { room.users.length }
        </span>
      </span>

      <Modal
        show={showComposeModal}
        dialogClassName="chatroom-members"
        onHide={() => onChangeComposeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Members</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Compose
            dropDownBox
            onHide={() => onChangeComposeModal(false)}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
          />

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
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={!hasRecipients(recipients)}
            onClick={() => {
              addMembers(room.id, recipients)
              onChangeComposeModal(false)
            }}
          >
            Add Members
          </Button>
        </Modal.Footer>
      </Modal>
    </span>
  )
}
export default enhance(ManageMembers)
