import React from 'react'
import { connect } from 'react-redux'

import { Menu } from '../../../../../../views/components/SlideMenu'
import Search from '../../../../../../views/components/Grid/Search'

import {
  PageContainer,
  PageContent,
  GridContainer,
  SearchContainer
} from '../styles/page-container/styled'

import Header from '../components/page-header'
import Grid from './grid'
import AgentFilters from './filters'
import { searchDeals, getDeals } from '../../../../../../store_actions/deals'

class AgentTable extends React.Component {
  state = {
    isSideMenuOpen: true
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

    if (value.length === 0) {
      return getDeals(user)
    }

    searchDeals(user, value)
  }

  render() {
    const { isSideMenuOpen } = this.state
    const { params, isFetchingDeals, isTrainingAccount } = this.props

    return (
      <PageContainer isTrainingAccount={isTrainingAccount}>
        <Menu
          width={160}
          isSideMenuOpen={isSideMenuOpen}
          isOpen={isSideMenuOpen}
        >
          <AgentFilters activeFilter={params.filter} />
        </Menu>

        <PageContent>
          <Header
            showBackButton={false}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <GridContainer isTrainingAccount={isTrainingAccount}>
            <SearchContainer>
              <Search
                disableOnSearch
                showLoadingOnSearch
                isSearching={isFetchingDeals}
                placeholder="Search deals by address, MLS # or agent name…"
                onChange={this.handleSearch}
                debounceTime={700}
                minimumLength={3}
              />
            </SearchContainer>

            <Grid activeFilter={params.filter} />
          </GridContainer>
        </PageContent>
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
