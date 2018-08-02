import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

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

class BackofficeFilters extends React.Component {
  componentDidMount() {
    const { deals, activeFilter } = this.props

    this.findActiveTab(deals, activeFilter)
  }

  componentWillReceiveProps({ deals, activeFilter }) {
    if (!this.props.activeFilter && !activeFilter) {
      this.findActiveTab(deals, null)
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

  getBadgeCounter(tabName) {
    const { deals } = this.props
    let counter = 0

    _.each(deals, deal => {
      if (
        deal.inboxes &&
        deal.inboxes.includes(tabName) &&
        deal.attention_requests > 0
      ) {
        counter += 1
      }
    })

    return counter
  }

  render() {
    const { deals, searchCriteria, activeFilter } = this.props

    if (searchCriteria) {
      return (
        <Container>
          <ListTitle>List</ListTitle>

          <ListItem isSelected>
            <ListItemName>Search Results</ListItemName>

            <ListIconContainer>
              <BadgeCounter>
                {deals ? Object.keys(deals).length : 0}
              </BadgeCounter>
            </ListIconContainer>
          </ListItem>
        </Container>
      )
    }

    return (
      <Container>
        <ListTitle>Lists</ListTitle>

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

              <ListIconContainer>
                <BadgeCounter>{counter}</BadgeCounter>
              </ListIconContainer>
            </ListItem>
          )
        })}
      </Container>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(BackofficeFilters)
