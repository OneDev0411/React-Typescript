import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './agent-table'
import BackOfficeTable from './backoffice-table'
import cn from 'classnames'
import Header from './header'
import { getDeals, searchAllDeals } from '../../../../../store_actions/deals'
import { hasUserAccess } from '../../../../../utils/user-acl'

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
      activeFilters
    }
  }


  refetchDeals = () => {
    const { getDeals, user } = this.props

    getDeals(user, hasUserAccess(user, 'BackOffice'), false)
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
    const { deals, isBackOffice, params, searchAllDeals, spinner } = this.props
    const { activeFilters } = this.state

    return (
      <div className="deals-list">
        <Header
          activeFilterTab={params.filter}
          onFilterChange={(name, filter) => this.setFilter(name, filter)}
          searchAllDeals={searchAllDeals}
          refetchDeals={this.refetchDeals}
        />
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__deals', { hide_spinner: !spinner })}
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
              filters={activeFilters}
              isBackOffice
            />
        }

      </div>
    )
  }
}

export default connect(({ deals, user }) => ({
  deals: deals.list,
  isBackOffice: deals.backoffice,
  user,
  spinner: deals.spinner
}), { getDeals, searchAllDeals })(DealsDashboard)
