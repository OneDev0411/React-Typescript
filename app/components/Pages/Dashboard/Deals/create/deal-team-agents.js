import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import UserAvatar from '../../../../Partials/UserAvatar'
import { roleName } from '../utils/roles'

class TeamAgents extends React.Component {
  render() {
    const { show, teamAgents, handleOnClose, handleSelectAgent } = this.props

    return (
      <Modal
        backdrop="static"
        show={show}
        dialogClassName="modal-deal-team-agents"
        onHide={handleOnClose}
      >
        <Modal.Header closeButton>Choose primary agent</Modal.Header>

        <Modal.Body>
          <div className="deal-roles">
            {(!teamAgents || teamAgents.length === 0) && (
              <div className="deal-roles-empty-state">
                We cannot find any Primary Agent in your brand
              </div>
            )}

            {teamAgents &&
              teamAgents.map(user => (
                <div
                  key={user.id}
                  className="item"
                  onClick={() => handleSelectAgent(user)}
                >
                  <div className="role-avatar">
                    <UserAvatar
                      name={user.display_name}
                      image={user.profile_image_url}
                      size={32}
                      showStateIndicator={false}
                    />
                  </div>

                  <div className="name">
                    <div>{user.display_name}</div>
                    <div className="role">{roleName(user.role || '')}</div>
                  </div>
                </div>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

function mapToProps({ deals }) {
  return { teamAgents: deals.agents }
}

export default connect(mapToProps, null)(TeamAgents)
