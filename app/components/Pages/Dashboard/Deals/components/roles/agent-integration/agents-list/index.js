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

import {
  RoleItem,
  RoleAvatar,
  RoleInfo,
  RoleTitle,
  RoleType
} from '../../styled'

import { Container, SearchInput, SearchOverlay, EmptyState } from './styled'

import './modalStyle.scss'

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

      this.setState({
        teamAgents,
        isLoading: false
      })

      // For primary agent if only one agent available automatically select them
      // issue: web#1148
      if (teamAgents && teamAgents.length === 1) {
        return this.handleSelectAgent(teamAgents[0])
      }
    } catch (e) {
      console.log(e)
      this.setState({ teamAgents: [], isLoading: false })
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

    let contacts = []

    try {
      const response = await searchContacts(user.email)

      contacts = normalizeContactAttribute(response).filter(
        contact => contact.summary.email === user.email
      )
    } catch (e) {}

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

        <Modal.Body className="u-scrollbar--thinner">
          <Container>
            {(isSearchingContacts || isLoading) && (
              <SearchOverlay>
                <Loading />
              </SearchOverlay>
            )}

            {!isLoading &&
              !isSearchingContacts &&
              (!teamAgents || teamAgents.length === 0) && (
                <EmptyState>
                  We cannot find any Primary Agent in your brand
                </EmptyState>
              )}

            {teamAgents && (
              <Fragment>
                {teamAgents.length > 5 && (
                  <SearchInput
                    type="text"
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
                    <RoleItem
                      key={user.id}
                      onClick={() => this.handleSelectAgent(user)}
                    >
                      <RoleAvatar>
                        <UserAvatar
                          name={user.display_name}
                          image={user.profile_image_url}
                          size={32}
                          color="#D4D4D4"
                          showStateIndicator={false}
                        />
                      </RoleAvatar>

                      <RoleInfo>
                        <RoleTitle>{user.display_name}</RoleTitle>
                        <RoleType>{roleName(user.role || '')}</RoleType>
                      </RoleInfo>
                    </RoleItem>
                  ))}
              </Fragment>
            )}
          </Container>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(({ user }) => ({ user }))(TeamAgents)
