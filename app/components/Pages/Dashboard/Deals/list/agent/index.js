import React from 'react'
import { connect } from 'react-redux'

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
import { searchDeals, getDeals } from '../../../../../../store_actions/deals'

let persistentSearchInput = ''

class AgentTable extends React.Component {
  state = {
    isSideMenuOpen: true,
    searchCriteria: persistentSearchInput
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleSearch = value => {
    const { user, isFetchingDeals, getDeals, searchDeals } = this.props

    if (isFetchingDeals) {
      return false
    }

    this.setState({
      searchCriteria: value
    })

    // set persistent search input
    persistentSearchInput = value

    if (value.length === 0) {
      return getDeals(user)
    }

    searchDeals(user, value)
  }

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

        <Content>
          <Header
            title={params.filter || 'All'}
            showBackButton={false}
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
  return { user, isFetchingDeals: deals.properties.isFetchingDeals }
}

export default connect(
  mapStateToProps,
  { searchDeals, getDeals }
)(AgentTable)
