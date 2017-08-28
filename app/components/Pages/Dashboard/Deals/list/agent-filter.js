import React from 'react'
import { browserHistory } from 'react-router'
import ReactTooltip from 'react-tooltip'

const FILTER_ACTIVE = ['Active']
const FILTER_PENDING = [
  'Active Contingent',
  'Active Kick out',
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

export default class Filter extends React.Component {
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
    const arg = filter === 'All' ? '' : `/${filter}`
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

  render() {
    const active = this.props.active || 'All'

    return (
      <div>
        <ReactTooltip
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
              >
                <span data-tip={ this.getFilterTabTooltip(filter) }>
                  { filter }
                </span>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}
