import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import getNeedsAttentions from '../utils/needs-attention'

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
    const filters = {}
    const arg = `/filter/${filter}`

    browserHistory.push(`/dashboard/deals${arg}`)

    // set inbox name
    filters.__inbox_name__ = filter

    // set filters
    this.props.onChangeFilter(filters)
  }

  getTabs() {
    return _
      .chain(this.props.checklists)
      .pluck('tab_name')
      .uniq()
      .filter(tab => tab !== null)
      .value()
  }

  getBadgeCounter(tabName) {
    const { deals } = this.props
    let counter = 0

    _.each(deals, deal => {
      if (getNeedsAttentions(deal, tabName).length > 0) {
        counter += 1
      }
    })

    return counter
  }

  render() {
    const { searchMode, active } = this.props
    const activeTab = !searchMode && active

    return (
      <ul className="filter">
        {
          this.getTabs()
            .map(tabName => {
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
                  <div className="title">
                    {tabName}
                  </div>

                  <div className="badge counter">
                    {counter}
                  </div>
                </li>
              )
            })
        }
      </ul>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  checklists: deals.checklists
}))(Filter)
