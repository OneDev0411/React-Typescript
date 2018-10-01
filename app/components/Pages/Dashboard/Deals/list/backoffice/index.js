import React from 'react'
import { connect } from 'react-redux'

import Search from 'components/Grid/Search'
import { Menu, Content } from 'components/SlideMenu'

import {
  PageContainer,
  GridContainer,
  SearchContainer
} from '../styles/page-container/styled'

import Header from '../components/PageHeader'
import Grid from './Grid'
import BackofficeFilters from './Filters'
import { searchDeals, getDeals } from 'actions/deals'

let persistentSearchInput = ''

class BackofficeTable extends React.Component {
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
        <Menu width={180} isOpen={isSideMenuOpen}>
          <BackofficeFilters
            activeFilter={params.filter}
            searchCriteria={this.state.searchCriteria}
          />
        </Menu>

        <Content>
          <Header
            title={params.filter}
            isSideMenuOpen={isSideMenuOpen}
            onMenuTriggerChange={this.toggleSideMenu}
            showCreateDeal={false}
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

            <Grid
              activeFilter={params.filter}
              searchCriteria={this.state.searchCriteria}
            />
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
)(BackofficeTable)
