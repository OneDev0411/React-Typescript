import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import SideNavSection from 'components/PageSideNav/SideNavSection'
import SideNavTitle from 'components/PageSideNav/SideNavTitle'
import SideNavItem from 'components/PageSideNav/SideNavItem'

import { getPathForFilter } from '../../utils'

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
    browserHistory.push(getPathForFilter(filter))
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
    const { searchCriteria } = this.props

    return (
      <SideNavSection>
        <SideNavTitle>Lists</SideNavTitle>

        {searchCriteria.length > 0 ? (
          <SideNavItem
            isSelected
            title="Search Results"
            badge={this.getBadgeCounter()}
          />
        ) : (
          <Fragment>
            {this.getTabs(this.props.deals).map(tabName => {
              const counter = this.getBadgeCounter(tabName)
              const linkUrl = getPathForFilter(tabName)

              if (counter === 0) {
                return false
              }

              return (
                <SideNavItem
                  key={`FILTER_${tabName}`}
                  link={linkUrl}
                  title={tabName}
                  badge={counter}
                />
              )
            })}
          </Fragment>
        )}
      </SideNavSection>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list
}))(BackofficeFilters)
