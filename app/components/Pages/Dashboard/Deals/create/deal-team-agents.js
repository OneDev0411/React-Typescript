import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import UserAvatar from '../../../../Partials/UserAvatar'
import { roleName } from '../utils/roles'

class TeamAgents extends React.Component {
  render() {
    const { isOpen, teamAgents, onHide, onSelectAgent } = this.props

    return (
      <Modal
        dialogClassName="modal-deal-team-agents"
        backdrop="static"
        show={isOpen}
        onHide={onHide}
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
                  onClick={() => onSelectAgent(user)}
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

function mapStateToProps({ deals }) {
  return { teamAgents: deals.agents }
}

export default connect(mapStateToProps, null)(TeamAgents)
