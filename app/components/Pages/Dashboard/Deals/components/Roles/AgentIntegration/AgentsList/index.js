import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Flex from 'styled-flex-component'

import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { getActiveTeam } from 'utils/user-teams'

import Drawer from 'components/OverlayDrawer'
import { getAgents } from 'models/Deal/agent'
import Loading from 'components/Spinner'

import Avatar from 'components/Avatar'

import { roleName } from '../../../../utils/roles'

import {
  RoleItem,
  RoleAvatar,
  RoleInfo,
  RoleTitle,
  RoleType
} from '../../styled'

import { Container, SearchInput, EmptyState } from './styled'

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
    } catch (e) {
      console.log(e)
      this.setState({ teamAgents: [], isLoading: false })
    }
  }

  get Brand() {
    const team = getActiveTeam(this.props.user)

    if (this.props.isPrimaryAgent) {
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

    await this.props.onSelectAgent(user, contacts)

    this.setState({
      isSearchingContacts: false
    })
  }

  handleChangeSearchFilter = e =>
    this.setState({
      searchFilter: e.target.value
    })

  get ShowEmptyState() {
    return (
      this.TeamAgents.length === 0 &&
      !this.state.isLoading &&
      !this.state.isSearchingContacts
    )
  }

  get ShowLoading() {
    return this.state.isSearchingContacts || this.state.isLoading
  }

  get TeamAgents() {
    return this.state.teamAgents || []
  }

  render() {
    const { state, props } = this

    return (
      <Drawer isOpen onClose={props.onClose} showFooter={false}>
        <Drawer.Header title={props.title || 'Team Agents'} />

        <Drawer.Body>
          <Container>
            {this.ShowEmptyState && (
              <EmptyState>
                We cannot find any Primary Agent in your brand
              </EmptyState>
            )}

            {this.ShowLoading === false && this.TeamAgents.length >= 6 && (
              <SearchInput
                type="text"
                placeholder="Search Agent..."
                value={state.searchFilter}
                onChange={this.handleChangeSearchFilter}
              />
            )}

            {this.ShowLoading && <Loading />}

            {this.ShowLoading === false &&
              this.TeamAgents.filter(
                user =>
                  this.props.filter(user) &&
                  user.display_name &&
                  user.display_name
                    .toLowerCase()
                    .includes(state.searchFilter.toLowerCase())
              ).map(user => (
                <Flex key={user.id}>
                  <RoleItem
                    onClick={() => this.handleSelectAgent(user)}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      height: '3.5rem',
                      marginBottom: 0,
                      padding: 0
                    }}
                  >
                    <RoleAvatar>
                      <Avatar
                        title={user.display_name}
                        image={user.profile_image_url}
                        size={40}
                      />
                    </RoleAvatar>

                    <RoleInfo>
                      <RoleTitle
                        style={{
                          fontSize: '1rem',
                          fontWeight: 500
                        }}
                      >
                        {user.display_name}
                      </RoleTitle>
                      <RoleType>{roleName(user.role || '')}</RoleType>
                    </RoleInfo>
                  </RoleItem>
                </Flex>
              ))}
          </Container>
        </Drawer.Body>
      </Drawer>
    )
  }
}

TeamAgents.propTypes = {
  filter: PropTypes.func,
  onSelectAgent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isPrimaryAgent: PropTypes.bool
}

TeamAgents.defaultProps = {
  filter: () => true,
  isPrimaryAgent: false
}

export default connect(({ user }) => ({ user }))(TeamAgents)
