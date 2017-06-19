import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
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
}) => (
  <span>
    <span
      className="members"
      onClick={() => onChangeComposeModal(!showComposeModal)}
    >
      <img
        className="members"
        src="/static/images/chatroom/members.svg"
        onClick={() => {}}
      />
      <span style={{ fontWeight: 'normal', fontSize: '14px' }}>
        { room.users.length }
      </span>
    </span>

    <Modal
      show={showComposeModal}
      dialogClassName="chatroom-members"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Members</Modal.Title>
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
                <Col sm={1} md={1}>
                  <UserAvatar
                    userId={user.id}
                    name={user.display_name}
                    image={user.profile_image_url}
                    size={30}
                  />
                </Col>
                <Col sm={8} md={8}>
                  { user.display_name }
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
            addMembers(recipients)
            onChangeComposeModal(false)
          }}
        >
          Add Members
        </Button>
      </Modal.Footer>

    </Modal>
  </span>
)

export default enhance(ManageMembers)
