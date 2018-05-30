import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import ToolTip from '../../../../../../views/components/tooltip/index'
import Deal from '../../../../../../models/Deal'

const FILTER_ACTIVE = ['Active']

const FILTER_PENDING = [
  'Active Contingent',
  'Active Kick Out',
  'Active Option Contract',
  'Pending'
]

const FILTER_ARCHIVE = [
  'Sold',
  'Temp Off Market',
  'Expired',
  'Cancelled',
  'Withdrawn',
  'Leased',
  'Contract Terminated'
]

const filters = {
  All: (status, deal) =>
    FILTER_ARCHIVE.indexOf(status) === -1 && !deal.deleted_at,
  Listings: (status, deal) =>
    FILTER_ACTIVE.indexOf(status) > -1 && !deal.deleted_at,
  Pending: (status, deal) =>
    FILTER_PENDING.indexOf(status) > -1 && !deal.deleted_at,
  Archive: (status, deal) =>
    FILTER_ARCHIVE.indexOf(status) > -1 || !!deal.deleted_at
}

export class AgentFilter extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { active = 'All' } = this.props

    if (!_.find(filters, (fn, name) => name === active)) {
      return browserHistory.push('/dashboard/deals')
    }

    if (active) {
      this.setFilter(active)
    }
  }

  /**
   * set filter tab tooltip
   */
  setFilter(filter) {
    const arg = filter === 'All' ? '' : `/filter/${filter}`

    browserHistory.push(`/dashboard/deals${arg}`)

    this.props.onChangeFilter({
      status: filters[filter]
    })
  }

  /**
   * get filter tab tooltip
   */
  getFilterTabTooltip(tab) {
    let tooltip = []

    switch (tab) {
      case 'Pending':
        tooltip = FILTER_PENDING
        break
      case 'Archive':
        tooltip = FILTER_ARCHIVE
        break
      case 'Listings':
        tooltip = FILTER_ACTIVE
        break
      default:
        tooltip = ['All']
    }

    return tooltip.join('<br />')
  }

  /**
   * get badge counter
   */
  getBadgeCounter(filter) {
    const { deals } = this.props

    return _.filter(deals, deal => {
      const status = Deal.get.status(deal)

      return (
        (!deal.searchResult || deal.duplicateDeal) &&
        filters[filter](status, deal)
      )
    }).length
  }

  render() {
    const active = this.props.active || 'All'

    return (
      <ul className="filter" data-test="filter">
        {_.map(filters, (fn, filter) => (
          <ToolTip
            key={`FILTER_${filter}`}
            multiline
            caption={this.getFilterTabTooltip(filter)}
            placement="bottom"
          >
            <li
              className={filter === active ? 'active' : ''}
              data-test="filter-item"
              onClick={() => this.setFilter(filter)}
            >
              <span className="title" data-test="title">
                {filter}
              </span>

              <span className="badge counter" data-test="badge">
                {this.getBadgeCounter(filter)}
              </span>
            </li>
          </ToolTip>
        ))}
      </ul>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(AgentFilter)
