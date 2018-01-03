import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './agent-table'
import BackOfficeTable from './backoffice-table'
import cn from 'classnames'
import Header from './header'

class DealsDashboard extends React.Component {
  constructor(props) {
    super(props)

    const { isBackOffice } = props
    const activeFilters = {}

    // initial filters
    if (isBackOffice) {
      activeFilters.needs_attention = count => count > 0
    } else {
      activeFilters.status = (status, deal) => !deal.deleted_at
    }

    this.state = {
      activeFilters,
      searchBoxIsOpen: false,
      emptySearchPageIsOpen: false
    }
  }


  setSearchStatus = searchBoxIsOpen => this.setState({ searchBoxIsOpen })
  showEmptySearchPage = emptySearchPageIsOpen => this.setState({ emptySearchPageIsOpen })


  initialBOFilters = (filters) => {
    this.setState({
      activeFilters: {
        needs_attention: count => count > 0,
        ...filters
      }
    })
  }

  initialAgentFilters = (filters) => {
    this.setState({
      activeFilters: {
        status: (status, deal) => !deal.deleted_at,
        ...filters
      }
    })
  }

  searchBOFilters = () => {
    this.setState({
      activeFilters: { searchResult: true }
    })
  }

  /**
   *
   */
  setFilter(filters) {
    this.setState({
      activeFilters: {
        ...this.state.activeFilters,
        ...filters
      }
    })
  }

  render() {
    const {
      deals,
      isBackOffice,
      params,
      loadingDeals
    } = this.props
    const {
      activeFilters,
      searchBoxIsOpen,
      emptySearchPageIsOpen
    } = this.state

    return (
      <div className="deals-list">
        <Header
          activeFilterTab={params.filter}
          initialBOFilters={this.initialBOFilters}
          initialAgentFilters={this.initialAgentFilters}
          searchBOFilters={this.searchBOFilters}
          searchBoxIsOpen={searchBoxIsOpen}
          setSearchStatus={this.setSearchStatus}
          showEmptySearchPage={this.showEmptySearchPage}
          onFilterChange={filters => this.setFilter(filters)}
        />
        <i
          className={cn(
            'fa fa-spinner fa-pulse fa-fw fa-3x spinner__deals',
            { hide_spinner: !loadingDeals }
          )}
        />

        {
          !isBackOffice ?
            <AgentTable
              deals={deals}
              filters={activeFilters}
              isBackOffice={false}
            /> :
            <BackOfficeTable
              deals={deals}
              searchBoxIsOpen={searchBoxIsOpen}
              emptySearchPageIsOpen={emptySearchPageIsOpen || loadingDeals}
              filters={activeFilters}
              isBackOffice
            />
        }

      </div>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  isBackOffice: deals.backoffice,
  loadingDeals: deals.spinner
}))(DealsDashboard)
