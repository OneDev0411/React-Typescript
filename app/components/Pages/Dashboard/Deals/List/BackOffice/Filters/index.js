import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import {
  Container,
  ListTitle,
  ListItem
} from 'components/Grid/SavedSegments/List/styled'

import { BadgeCounter } from '../../styles/filters/styled'
import { ListItemName } from 'components/Grid/SavedSegments/List/styled'

class BackofficeFilters extends React.Component {
  componentDidMount() {
    const { deals, activeFilter } = this.props

    this.findActiveTab(deals, activeFilter)
  }

  componentWillReceiveProps({ deals, activeFilter }) {
    if (!activeFilter) {
      this.findActiveTab(deals, this.props.activeFilter)
    }
  }

  findActiveTab = (deals, activeFilter) => {
    const tabs = this.getTabs(deals)

    // get active tab
    const activeTab = activeFilter || (tabs && tabs[0])

    if (activeTab) {
      this.setFilter(activeTab)
    }
  }

  /**
   * set filter tab tooltip
   */
  setFilter(filter) {
    const arg = `/filter/${filter}`

    browserHistory.push(`/dashboard/deals${arg}`)
  }

  getTabs(deals = {}) {
    return _.chain(deals)
      .pluck('inboxes')
      .flatten()
      .uniq()
      .filter(tab => tab !== null)
      .value()
  }

  getBadgeCounter(tabName = '') {
    const { deals, searchCriteria } = this.props
    let counter = 0

    if (searchCriteria.length > 0) {
      return Object.values(deals).filter(deal => !deal.is_draft).length
    }

    _.each(deals, deal => {
      if (
        deal.inboxes &&
        deal.inboxes.includes(tabName) &&
        deal.attention_requests > 0 &&
        deal.is_draft === false
      ) {
        counter += 1
      }
    })

    return counter
  }

  render() {
    const { searchCriteria, activeFilter } = this.props

    return (
      <Container>
        <ListTitle>Lists</ListTitle>

        {searchCriteria.length > 0 ? (
          <ListItem isSelected>
            <ListItemName>Search Results</ListItemName>

            <BadgeCounter>{this.getBadgeCounter()}</BadgeCounter>
          </ListItem>
        ) : (
          <Fragment>
            {this.getTabs(this.props.deals).map(tabName => {
              const counter = this.getBadgeCounter(tabName)

              if (counter === 0) {
                return false
              }

              return (
                <ListItem
                  key={`FILTER_${tabName}`}
                  isSelected={tabName === activeFilter}
                  onClick={() => this.setFilter(tabName)}
                >
                  <ListItemName>{tabName}</ListItemName>

                  <BadgeCounter>{counter}</BadgeCounter>
                </ListItem>
              )
            })}
          </Fragment>
        )}
      </Container>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(BackofficeFilters)
