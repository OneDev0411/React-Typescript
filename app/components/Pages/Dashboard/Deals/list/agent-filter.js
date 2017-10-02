import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import ReactTooltip from 'react-tooltip'
import Deal from '../../../../../models/Deal'

const FILTER_ACTIVE = [
  'Active',
  'Coming Soon'
]

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
  'Withdrawn'
]

const filters = {
  All: () => true,
  Active: status => FILTER_ACTIVE.indexOf(status) > -1,
  Pending: status => FILTER_PENDING.indexOf(status) > -1,
  Archive: status => FILTER_ARCHIVE.indexOf(status) > -1
}

class Filter extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { active } = this.props

    if (active && active !== 'All') {
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
      case 'Active':
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

    if (filter === 'All') {
      return _.size(deals)
    }

    const matched = _.filter(deals, deal => {
      const status = Deal.get.field(deal, 'listing_status')
      return filters[filter](status)
    })

    return matched.length
  }

  render() {
    const active = this.props.active || 'All'

    return (
      <div>
        <ReactTooltip
          place="top"
          className="deal-filter--tooltip"
          multiline
        />

        <ul className="filter">
          {
            _.map(filters, (fn, filter) =>
              <li
                key={`FILTER_${filter}`}
                className={filter === active ? 'active' : ''}
                onClick={() => this.setFilter(filter)}
                data-tip={this.getFilterTabTooltip(filter)}
              >
                <span className="title">
                  { filter }
                </span>

                <span className="badge counter">
                  { this.getBadgeCounter(filter) }
                </span>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(Filter)
