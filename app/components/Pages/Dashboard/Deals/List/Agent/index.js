import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { Menu, Content } from 'components/SlideMenu'

import Search from 'components/Grid/Search'

import { searchDeals, getDeals } from 'actions/deals'
import { viewAsEveryoneOnTeam, viewAs } from 'utils/user-teams'

import { PageContainer, GridContainer } from '../styles/page-container/styled'

import PageHeader from '../components/PageHeader'
import Grid from './Grid'
import AgentFilters from './Filters'

let persistentSearchInput = ''

class AgentTable extends React.Component {
  state = {
    isSideMenuOpen: true,
    searchCriteria: persistentSearchInput
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      this.fetch(nextProps.user, this.state.searchCriteria)
    }
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  fetch = (user, searchCriteria) => {
    if (searchCriteria.length === 0 && viewAsEveryoneOnTeam(user)) {
      this.props.getDeals(user)
    } else {
      this.props.searchDeals(user, searchCriteria)
    }
  }

  handleSearch = _.debounce(value => {
    if (this.props.isFetchingDeals) {
      return false
    }

    this.setState(
      {
        searchCriteria: value
      },
      () => {
        // set persistent search input
        persistentSearchInput = value

        this.fetch(this.props.user, value)
      }
    )
  }, 300)

  render() {
    const { isSideMenuOpen } = this.state
    const { params, isFetchingDeals } = this.props

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <Menu isOpen={isSideMenuOpen}>
          <AgentFilters
            activeFilter={params.filter}
            searchCriteria={this.state.searchCriteria}
          />
        </Menu>

        <Content isSideMenuOpen={isSideMenuOpen}>
          <PageHeader
            title={params.filter || 'All'}
            showBackButton={false}
            isSideMenuOpen={isSideMenuOpen}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <GridContainer>
            <Search
              disableOnSearch
              showLoadingOnSearch
              defaultValue={persistentSearchInput}
              isSearching={isFetchingDeals}
              placeholder="Search deals by address, MLS # or agent name…"
              onChange={this.handleSearch}
              onClearSearch={this.handleSearch}
              debounceTime={700}
              minimumLength={4}
            />

            <Grid activeFilter={params.filter} />
          </GridContainer>
        </Content>
      </PageContainer>
    )
  }
}

function mapStateToProps({ user, deals }) {
  return {
    user,
    isFetchingDeals: deals.properties.isFetchingDeals,
    viewAsUsers: viewAs(user)
  }
}

export default connect(
  mapStateToProps,
  { getDeals, searchDeals }
)(AgentTable)
