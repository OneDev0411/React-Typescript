import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import moment from 'moment'
import Compose from '../../../../Partials/Compose'
import UserAvatar from '../../../../Partials/UserAvatar'
import { addMembers } from '../../../../../store_actions/chatroom'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {}),
  connect(null, { addMembers })
)

const ManageMembers = ({
  room,
  showComposeModal,
  recipients,
  onChangeComposeModal,
  onChangeRecipients,
  addMembers
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
        className="members"
        onClick={() => onChangeComposeModal(!showComposeModal)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <g fill="#B2B2B2" fillRule="evenodd">
            <path d="M8 8c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4M8 9c-4.71 0-8 2.467-8 6v1h16v-1c0-3.533-3.29-6-8-6"/>
          </g>
        </svg>

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
