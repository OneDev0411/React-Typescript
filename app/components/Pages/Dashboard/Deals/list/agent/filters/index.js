import React from 'react'
import { connect } from 'react-redux'

import Deal from '../../../../../../../models/Deal'

import { browserHistory } from 'react-router'
import _ from 'underscore'
import ToolTip from '../../../../../../../views/components/tooltip'

import {
  Container,
  ListTitle,
  ListItem
} from '../../../../../../../views/components/Grid/SavedSegments/List/styled'

import {
  ListItemName,
  ListIconContainer,
  BadgeCounter
} from '../../styles/filters/styled'

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
  All: deal =>
    FilterNames.Archive.includes(Deal.get.status(deal)) === false &&
    !deal.is_draft &&
    !deal.deleted_at,
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
  getBadgeCounter = filterName =>
    _.filter(this.props.deals, deal => Filters[filterName](deal)).length

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
      <Container>
        <ListTitle>Lists</ListTitle>

        {_.map(Filters, (fn, filterName) => (
          <ListItem
            key={`FILTER_${filterName}`}
            isSelected={filterName === activeFilter}
            onClick={() => this.setFilter(filterName)}
          >
            <ListItemName>
              <ToolTip
                multiline
                caption={this.getTooltipCaption(filterName)}
                placement="right"
              >
                <span>{filterName}</span>
              </ToolTip>
            </ListItemName>

            <ListIconContainer>
              <BadgeCounter>{this.getBadgeCounter(filterName)}</BadgeCounter>
            </ListIconContainer>
          </ListItem>
        ))}
      </Container>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(AgentFilters)
