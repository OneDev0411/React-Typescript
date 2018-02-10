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
    if (!isBackOffice) {
      activeFilters.status = (status, deal) => !deal.deleted_at
    }

    this.state = {
      activeFilters,
      emptySearchPageIsOpen: false
    }
  }

  showEmptySearchPage(emptySearchPageIsOpen) {
    return this.setState({ emptySearchPageIsOpen })
  }

  initialFilters(filters) {
    const { isBackOffice, params } = this.props

    if (isBackOffice) {
      this.setState({
        activeFilters: {
          __inbox__: deal =>
            deal.inboxes && deal.inboxes.indexOf(params.filter) > -1,
          ..._.omit(filters, 'searchResult')
        }
      })
    } else {
      this.setState({
        activeFilters: {
          status: (status, deal) => !deal.deleted_at,
          ..._.omit(filters, 'searchResult')
        }
      })
    }
  }

  removeSearchFilter() {
    const { isBackOffice, params } = this.props
    const { activeFilters } = this.state

    if (isBackOffice) {
      this.setState({
        activeFilters: {
          __inbox__: deal =>
            deal.inboxes && deal.inboxes.indexOf(params.filter) > -1,
          ..._.omit(activeFilters, 'searchResult')
        }
      })
    } else {
      this.setState({
        activeFilters: {
          status: (status, deal) => !deal.deleted_at,
          ..._.omit(activeFilters, 'searchResult')
        }
      })
    }
  }

  searchBOFilters() {
    return this.setState({
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
    const { deals, isBackOffice, params, loadingDeals } = this.props
    const { activeFilters, emptySearchPageIsOpen } = this.state
    const isWebkit = 'WebkitAppearance' in document.documentElement.style

    return (
      <div className="deals-list" data-simplebar={!isWebkit || null}>
        <Header
          activeFilterTab={params.filter}
          initialFilters={filters => this.initialFilters(filters)}
          removeSearchFilter={() => this.removeSearchFilter()}
          searchBOFilters={() => this.searchBOFilters()}
          showEmptySearchPage={emptySearchPageIsOpen =>
            this.showEmptySearchPage(emptySearchPageIsOpen)
          }
          onFilterChange={filters => this.setFilter(filters)}
          filters={activeFilters}
        />
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading', {
            hide_spinner: !loadingDeals
          })}
        />

        {!isBackOffice ? (
          <AgentTable
            deals={deals}
            tabName={params.filter || 'All'}
            emptySearchPageIsOpen={emptySearchPageIsOpen || loadingDeals}
            filters={activeFilters}
            isBackOffice={false}
          />
        ) : (
          <BackOfficeTable
            deals={deals}
            emptySearchPageIsOpen={emptySearchPageIsOpen || loadingDeals}
            filters={activeFilters}
            isBackOffice
          />
        )}
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  isBackOffice: deals.backoffice,
  loadingDeals: deals.spinner
}))(DealsDashboard)
