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

    if (active && active !== 'All') {
      this.setFilter(active)
    }
  }

  /**
   * set filter tab tooltip
   */
  setFilter(filter) {
    const filters = {}
    const arg = filter === 'All' ? '' : `/filter/${filter}`

    browserHistory.push(`/dashboard/deals${arg}`)

    // set inbox name
    filters.__inbox_name__ = filter

    // set filters
    this.props.onChangeFilter(filters)
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
    const {
      checklists,
      searchMode
    } = this.props
    const active = !searchMode && (this.props.active || 'All')

    const tabs = _
      .chain(checklists)
      .pluck('tab_name')
      .uniq()
      .filter(tab => tab !== null)
      .value()

    // add All tab
    tabs.unshift('All')

    return (
      <div>
        <ul className="filter">
          {
            tabs.map(tabName => {
              const counter = this.getBadgeCounter(tabName)

              if (counter === 0) {
                return false
              }

              return (
                <li
                  key={`FILTER_${tabName}`}
                  onClick={() => this.setFilter(tabName)}
                  className={tabName === active ? 'active' : ''}
                >
                  <span className="title">
                    {tabName}
                  </span>

                  <span className="badge counter">
                    {counter}
                  </span>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  checklists: deals.checklists
}))(Filter)
