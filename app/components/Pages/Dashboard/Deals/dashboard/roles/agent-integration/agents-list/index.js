import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'

import UserAvatar from '../../../../../../../Partials/UserAvatar'
import { roleName } from '../../../../utils/roles'

import { searchContacts } from '../../../../../../../../models/contacts/search-contacts'
import { normalizeContactAttribute } from '../../../../../../../../store_actions/contacts/helpers/normalize-contacts'

import { getActiveTeam } from '../../../../../../../../utils/user-teams'

import { getAgents } from '../../../../../../../../models/Deal/agent'
import Loading from '../../../../../../../Partials/Loading'

class TeamAgents extends React.Component {
  state = {
    isLoading: true,
    isSearchingContacts: false,
    teamAgents: null,
    searchFilter: ''
  }

  componentDidMount() {
    this.getTeamAgents()
  }

  async getTeamAgents() {
    const brandId = this.Brand

    try {
      const teamAgents = await getAgents(brandId)

      // For primary agent if only one agent available automatically select them
      // issue: web#1148
      if (teamAgents && teamAgents.length === 1) {
        return this.handleSelectAgent(teamAgents[0])
      }

      this.setState({
        teamAgents
      })
    } catch (e) {
      console.log(e)
      this.setState({ teamAgents: [] })
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  get Brand() {
    const { user, isPrimaryAgent } = this.props
    const team = getActiveTeam(user)

    if (isPrimaryAgent) {
      return team.brand.id
    }

    let brand = team.brand

    while (brand.parent !== null) {
      brand = brand.parent
    }

    return brand.id
  }

  handleSelectAgent = async user => {
    this.setState({
      isSearchingContacts: true
    })

    const response = await searchContacts(user.email)
    const contacts = normalizeContactAttribute(response).filter(
      contact => contact.summary.email === user.email
    )

    this.setState({
      isSearchingContacts: false
    })

    this.props.onSelectAgent(user, contacts)
  }

  render() {
    const { onHide } = this.props
    const {
      searchFilter,
      teamAgents,
      isLoading,
      isSearchingContacts
    } = this.state

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
            {(isSearchingContacts || isLoading) && (
              <div className="search-overlay">
                <Loading />
              </div>
            )}

            {!isLoading &&
              (!teamAgents || teamAgents.length === 0) && (
                <div className="deal-roles-empty-state">
                  We cannot find any Primary Agent in your brand
                </div>
              )}

            {teamAgents && (
              <Fragment>
                {teamAgents.length > 5 && (
                  <input
                    type="text"
                    className="search"
                    placeholder="Search Agent..."
                    value={searchFilter}
                    onChange={e =>
                      this.setState({
                        searchFilter: e.target.value
                      })
                    }
                  />
                )}

                {teamAgents
                  .filter(
                    user =>
                      user.display_name &&
                      user.display_name
                        .toLowerCase()
                        .includes(searchFilter.toLowerCase())
                  )
                  .map(user => (
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
              </Fragment>
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(({ user }) => ({ user }))(TeamAgents)
