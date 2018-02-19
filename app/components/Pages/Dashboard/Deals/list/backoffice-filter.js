import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { browserHistory } from 'react-router'

class Filter extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { active } = this.props

    const tabs = this.getTabs()

    // get active tab
    const activeTab = active || (tabs && tabs[0])

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

    // set filters
    this.props.onChangeFilter({
      __inbox__: deal => deal.inboxes && deal.inboxes.indexOf(filter) > -1
    })
  }

  getTabs() {
    return _.chain(this.props.deals)
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
        (!deal.searchResult || deal.duplicateDeal) &&
        deal.inboxes &&
        deal.inboxes.indexOf(tabName) > -1 &&
        deal.attention_requested_count > 0
      ) {
        counter += 1
      }
    })

    return counter
  }

  componentWillReceiveProps(nextProps) {
    const { active } = nextProps

    if (!active) {
      const tabs = this.getTabs()

      // get active tab
      const activeTab = tabs && tabs[0]

      if (activeTab) {
        this.setFilter(activeTab)
      }
    }
  }

  render() {
    const { searchMode, active } = this.props
    const activeTab = !searchMode && active

    return (
      <ul className="filter">
        {this.getTabs().map(tabName => {
          const counter = this.getBadgeCounter(tabName)

          if (counter === 0) {
            return false
          }

          return (
            <li
              key={`FILTER_${tabName}`}
              onClick={() => this.setFilter(tabName)}
              className={tabName === activeTab ? 'active' : ''}
            >
              <div className="title">{tabName}</div>

              <div className="badge counter">{counter}</div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  checklists: deals.checklists
}))(Filter)
