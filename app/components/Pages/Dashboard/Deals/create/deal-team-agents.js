import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'

import UserAvatar from '../../../../Partials/UserAvatar'
import { roleName } from '../utils/roles'

import { searchContacts } from '../../../../../models/contacts/search-contacts'
import { normalizeContactAttribute } from '../../../../../store_actions/contacts/helpers/normalize-contacts'

import Loading from '../../../../Partials/Loading'

class TeamAgents extends React.Component {
  state = {
    isSearching: false
  }

  componentDidMount() {
    const { teamAgents } = this.props

    // For primary agent if only one agent available automatically select them
    // issue: web#1148
    if (teamAgents && teamAgents.length === 1) {
      return this.handleSelectAgent(teamAgents[0])
    }
  }

  handleSelectAgent = async user => {
    this.setState({
      isSearching: true
    })

    const response = await searchContacts(user.email)
    const contacts = normalizeContactAttribute(response).filter(
      contact => contact.summary.email === user.email
    )

    this.setState({
      isSearching: false
    })

    this.props.onSelectAgent(user, [contacts[0]])
  }

  render() {
    const { teamAgents, onHide } = this.props

    return (
      <Modal
        show
        dialogClassName="modal-deal-team-agents"
        backdrop="static"
        onHide={onHide}
      >
        <Modal.Header closeButton>Choose primary agent</Modal.Header>

        <Modal.Body>
          <div className="deal-roles">
            {this.state.isSearching && (
              <div className="search-overlay">
                <Loading />
              </div>
            )}

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
                  onClick={() => this.handleSelectAgent(user)}
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
