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

    if (active && active !== 'All') {
      this.setFilter(active)
    }
  }

  /**
   * set filter tab tooltip
   */
  setFilter(filter) {
    const filters = {}
    const arg = filter === 'All' ? '' : `/${filter}`
    browserHistory.push(`/dashboard/deals${arg}`)

    // set inbox name
    filters['__inbox_name__'] = filter

    // set filters
    this.props.onChangeFilter(filters)
  }

  render() {
    const { checklists } = this.props
    const active = this.props.active || 'All'

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
            tabs.map(tabName =>
              <li
                key={`FILTER_${tabName}`}
                onClick={() => this.setFilter(tabName)}
                className={tabName === active ? 'active' : ''}
              >
                { tabName }
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

export default connect (({ deals }) => ({
  checklists: deals.checklists
}))(Filter)
