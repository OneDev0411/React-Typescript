import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import AgentTable from './agent-table'
import BackOfficeTable from './backoffice-table'
import Header from './header'

class DealsDashboard extends React.Component {
  constructor(props) {
    super(props)

    const { isBackOffice } = props
    const activeFilters = {}

    if (isBackOffice) {
      activeFilters['needs_attention'] = c => c > 0
    }

    this.state = {
      activeFilters
    }
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
    const { deals, isBackOffice, params } = this.props
    const { activeFilters } = this.state

    return (
      <div className="deals-list">

        <Header
          activeFilterTab={params.filter}
          onFilterChange={(name, filter) => this.setFilter(name, filter)}
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
            isBackOffice={true}
          />
        }

      </div>
    )
  }
}

export default connect(({ deals }) => ({
  isBackOffice: deals.backoffice
}))(DealsDashboard)
