import React from 'react'
import { connect } from 'react-redux'

import PageSideNav from 'components/PageSideNav'
import { Content } from 'components/SlideMenu'
import Search from 'components/Grid/Search'
import { searchDeals, getDeals } from 'actions/deals'

import { PageContainer, GridContainer } from '../styles/page-container/styled'

import PageHeader from '../components/PageHeader'
import Grid from './Grid'
import BackofficeFilters from './Filters'

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
    if (this.props.isFetchingDeals) {
      return false
    }

    this.setState({
      searchCriteria: value
    })

    // set persistent search input
    persistentSearchInput = value

    if (value.length === 0) {
      return this.props.getDeals(this.props.user)
    }

    this.props.searchDeals(this.props.user, value)
  }

  render() {
    const { isSideMenuOpen } = this.state
    const { params, isFetchingDeals } = this.props

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <PageSideNav isOpen={isSideMenuOpen}>
          <BackofficeFilters
            activeFilter={params.filter}
            searchCriteria={this.state.searchCriteria}
          />
        </PageSideNav>

        <Content isSideMenuOpen={isSideMenuOpen}>
          <PageHeader
            title={params.filter}
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
