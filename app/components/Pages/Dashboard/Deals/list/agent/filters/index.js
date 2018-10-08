import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import Deal from '../../../../../../../models/Deal'
import ToolTip from '../../../../../../../views/components/tooltip'

import {
  ListTitle,
  ListItem
} from '../../../../../../../views/components/Grid/SavedSegments/List/styled'

import { BadgeCounter } from '../../styles/filters/styled'
import { ListItemName } from '../../../../../../../views/components/Grid/SavedSegments/List/styled'

const FilterNames = {
  Active: ['Active', 'Lease'],
  Drafts: ['Drafts'],
  Pending: [
    'Active Contingent',
    'Active Kick Out',
    'Active Option Contract',
    'Lease Contract',
    'Pending'
  ],
  Archive: [
    'Sold',
    'Temp Off Market',
    'Expired',
    'Cancelled',
    'Withdrawn',
    'Leased',
    'Contract Terminated'
  ]
}

export const Filters = {
  All: deal => !deal.deleted_at,
  Drafts: deal => deal.is_draft === true,
  Listings: deal =>
    FilterNames.Active.includes(Deal.get.status(deal)) &&
    !deal.is_draft &&
    !deal.deleted_at,
  Pending: deal =>
    FilterNames.Pending.includes(Deal.get.status(deal)) &&
    !deal.is_draft &&
    !deal.deleted_at,
  Archive: deal =>
    FilterNames.Archive.includes(Deal.get.status(deal)) || !!deal.deleted_at
}

class AgentFilters extends React.Component {
  componentDidMount() {
    const { active = 'All' } = this.props

    if (!_.find(Filters, (fn, name) => name === active)) {
      return browserHistory.push('/dashboard/deals')
    }

    if (active) {
      this.setFilter(active)
    }
  }

  /**
   * set filter tab tooltip
   */
  setFilter(filterName) {
    const argument = filterName === 'All' ? '' : `/filter/${filterName}`

    browserHistory.push(`/dashboard/deals${argument}`)
  }

  /**
   * get badge counter
   */
  getBadgeCounter = filterName => {
    const { deals } = this.props

    if (this.props.searchCriteria.length === 0) {
      return _.filter(deals, deal => Filters[filterName](deal)).length
    }

    return Object.values(deals).length
  }
  /**
   * get filter tab tooltip
   */
  getTooltipCaption(filterName) {
    let tooltip = []

    switch (filterName) {
      case 'Pending':
        tooltip = FilterNames.Pending
        break

      case 'Archive':
        tooltip = FilterNames.Archive
        break

      case 'Listings':
        tooltip = FilterNames.Active
        break

      case 'Drafts':
        tooltip = FilterNames.Drafts
        break

      default:
        tooltip = ['All']
    }

    return tooltip.join('<br />')
  }

  render() {
    const activeFilter = this.props.activeFilter || 'All'

    return (
      <React.Fragment>
        <ListTitle>Lists</ListTitle>
        {this.props.searchCriteria.length > 0 ? (
          <ListItem isSelected>
            <ListItemName>Search Results</ListItemName>

            <BadgeCounter>{this.getBadgeCounter()}</BadgeCounter>
          </ListItem>
        ) : (
          _.map(Filters, (fn, filterName) => (
            <ToolTip
              key={`FILTER_${filterName}`}
              multiline
              caption={this.getTooltipCaption(filterName)}
              placement="right"
            >
              <ListItem
                isSelected={filterName === activeFilter}
                onClick={() => this.setFilter(filterName)}
              >
                <ListItemName>{filterName}</ListItemName>

                <BadgeCounter>{this.getBadgeCounter(filterName)}</BadgeCounter>
              </ListItem>
            </ToolTip>
          ))
        )}
      </React.Fragment>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(AgentFilters)
