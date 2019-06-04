import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'

import { searchContacts } from 'models/contacts/search-contacts'
import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { getActiveTeam } from 'utils/user-teams'

import Drawer from 'components/OverlayDrawer'
import { getAgents } from 'models/Deal/agent'
import Loading from 'components/LoadingContainer'

import { PrimaryAgent } from './PrimaryAgent'
import { CoAgent } from './CoAgent'

import { Container, EmptyState } from './styled'

const propTypes = {
  filter: PropTypes.func,
  onSelectAgent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isPrimaryAgent: PropTypes.bool
}

const defaultProps = {
  filter: () => true,
  isPrimaryAgent: false
}

class TeamAgents extends React.Component {
  state = {
    isLoading: true,
    isSearchingContacts: false,
    teamAgents: null,
    searchTerm: ''
  }

  componentDidMount() {
    this.getTeamAgents()
  }

  async getTeamAgents(criteria) {
    try {
      this.setState({
        teamAgents: await getAgents(this.brand, criteria),
        isLoading: false,
        searchTerm: criteria // todo: we need this for match highlighting
      })
    } catch (e) {
      console.log(e)
      this.setState({ teamAgents: [], isLoading: false })
    }
  }

  handleSearchCoAgents = debounce(
    searchTerm => this.getTeamAgents(searchTerm),
    500
  )

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

  get isEmptyState() {
    return (
      !this.state.isLoading &&
      !this.state.isSearchingContacts &&
      this.teamAgents.length === 0
    )
  }

  get isLoading() {
    return this.state.isSearchingContacts || this.state.isLoading
  }

  get teamAgents() {
    return this.state.teamAgents || []
  }

  get brand() {
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

  render() {
    const { props } = this

    return (
      <Drawer isOpen onClose={props.onClose} showFooter={false}>
        <Drawer.Header title={props.title || 'Team Agents'} />

        <Drawer.Body>
          <Container>
            {this.isEmptyState && (
              <EmptyState>We could not find any agent in your brand</EmptyState>
            )}

            {this.isLoading ? (
              <Loading />
            ) : (
              <Fragment>
                {this.props.isPrimaryAgent ? (
                  <PrimaryAgent
                    team={this.teamAgents[0]}
                    onSelectAgent={this.handleSelectAgent}
                  />
                ) : (
                  <CoAgent
                    teams={this.teamAgents}
                    searchTerm={this.state.searchTerm}
                    onSearch={this.handleSearchCoAgents}
                    onSelectAgent={this.handleSelectAgent}
                  />
                )}
              </Fragment>
            )}
          </Container>
        </Drawer.Body>
      </Drawer>
    )
  }
}

TeamAgents.defaultProps = defaultProps
TeamAgents.propTypes = propTypes

export default connect(({ user }) => ({ user }))(TeamAgents)
