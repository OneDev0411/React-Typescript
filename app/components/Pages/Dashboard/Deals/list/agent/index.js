import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { searchDeals, getDeals } from '../../../../../../store_actions/deals'
import {
  viewAsEveryoneOnTeam,
  viewAs
} from '../../../../../../utils/user-teams'

import { Menu, Content } from '../../../../../../views/components/SlideMenu'
import Search from '../../../../../../views/components/Grid/Search'

import {
  PageContainer,
  GridContainer,
  SearchContainer
} from '../styles/page-container/styled'

import Header from '../components/page-header'
import Grid from './grid'
import AgentFilters from './filters'

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
    const { dispatch } = this.props

    if (searchCriteria.length === 0 && viewAsEveryoneOnTeam(user)) {
      dispatch(getDeals(user))
    } else {
      dispatch(searchDeals(user, searchCriteria))
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
    const { params, isFetchingDeals, isTrainingAccount } = this.props

    return (
      <PageContainer
        isOpen={isSideMenuOpen}
        isTrainingAccount={isTrainingAccount}
      >
        <Menu isOpen={isSideMenuOpen}>
          <AgentFilters
            activeFilter={params.filter}
            searchCriteria={this.state.searchCriteria}
          />
        </Menu>

        <Content isSideMenuOpen={isSideMenuOpen}>
          <Header
            title={params.filter || 'All'}
            showBackButton={false}
            isSideMenuOpen={isSideMenuOpen}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <GridContainer isTrainingAccount={isTrainingAccount}>
            <SearchContainer>
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
            </SearchContainer>

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

export default connect(mapStateToProps)(AgentTable)
