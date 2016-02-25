// Dashboard/Index.js
import React, { Component } from 'react'
import Avatar from 'react-avatar'
import S from 'shorti'
import helpers from '../../../../../../utils/helpers'
import Loading from '../../../../../Partials/Loading'

// AppStore
import AppStore from '../../../../../../stores/AppStore'

if (process.env.WEBPACK_PROCESS === 'build')
  require('../../../../../../src/sass/components/pages/agent-report.scss')

export default class Dashboard extends Component {
  componentWillReceiveProps(next) {
    if (!AppStore.data.agents.rows && next.data.agents.agents) {
      this.setRows(next.data.agents.agents)
      this.sort()
    }
  }

  setRows(rows) {
    const normalize = v => {
      if (parseInt(v, 10))
        return parseInt(v, 10)

      return 0
    }

    const transform = agent => {
      const row = {
        avatar: {
          name: agent.first_name + ' ' + agent.last_name,
          email: agent.email
        },
        name: agent.first_name + ' ' + agent.last_name,
        total_volume: normalize(agent.data.selling_volume) + normalize(agent.data.listed_volume),
        total_value: normalize(agent.data.selling_value) + normalize(agent.data.listed_value),
        listed_volume: normalize(agent.data.listed_volume),
        listed_value: normalize(agent.data.listed_value),
        selling_volume: normalize(agent.data.selling_volume),
        selling_value: normalize(agent.data.selling_value),
        active_volume: normalize(agent.data.active_volume),
        active_value: normalize(agent.data.active_value),
        total_active_volume: normalize(agent.data.total_active_volume),
        total_active_value: normalize(agent.data.total_active_value)
      }

      return row
    }

    const transformed = rows.map(transform)
    AppStore.data.agents.rows = transformed
  }

  setSort(column) {
    AppStore.data.agents.sort.column = column
    AppStore.data.agents.sort.direction = AppStore.data.agents.sort.direction === 'ASC' ? 'DESC' : 'ASC'
    this.sort()
    AppStore.emitChange()
  }

  sort() {
    const direction = this.props.data.agents.sort.direction
    const column = this.props.data.agents.sort.column

    const comparer = (a, b) => {
      if (direction === 'ASC')
        return (a[column] > b[column]) ? 1 : -1
      else if (direction === 'DESC')
        return (a[column] < b[column]) ? 1 : -1
    }

    AppStore.data.agents.rows.sort(comparer)
  }

  sortIcon(column) {
    if (this.props.data.agents.sort.column !== column)
      return ''

    if (this.props.data.agents.sort.direction === 'ASC') {
      return (
        <i className="fa fa-sort-asc" />
      )
    }

    return (
      <i className="fa fa-sort-desc" />
    )
  }

  render() {
    if (this.props.data.agents.searching) {
      const s = {
        ...S('pl-25p m-0'),
        ...{
          display: 'inline-block'
        }
      }
      return (
        <div style={ s }>
          <Loading />
        </div>
      )
    }

    const rows = this.props.data.agents.rows
    if (!rows) {
      return (
        <div></div>
      )
    }

    return (
      <div id="results">
        <table>
          <thead>
            <tr>
              <th onClick={this.setSort.bind(this, 'name')}>
                Agent {this.sortIcon('name')}
              </th>

              <th onClick={this.setSort.bind(this, 'listed_volume')}>
                List Volume {this.sortIcon('listed_volume')}
              </th>

              <th onClick={this.setSort.bind(this, 'listed_value')}>
                List Value {this.sortIcon('listed_value')}
              </th>

              <th onClick={this.setSort.bind(this, 'selling_volume')}>
                Sell Volume {this.sortIcon('selling_volume')}
              </th>

              <th onClick={this.setSort.bind(this, 'selling_value')}>
                Sell Value {this.sortIcon('selling_value')}
              </th>

              <th onClick={this.setSort.bind(this, 'active_volume')}>
                Active Volume {this.sortIcon('active_volume')}
              </th>

              <th onClick={this.setSort.bind(this, 'active_value')}>
                Active Value {this.sortIcon('active_value')}
              </th>

              <th onClick={this.setSort.bind(this, 'total_active_volume')}>
                Total Active Volume {this.sortIcon('total_active_volume')}
              </th>

              <th onClick={this.setSort.bind(this, 'total_active_value')}>
                Total Active Value {this.sortIcon('total_active_value')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(agent => (
              <tr>
                <td>
                    <Avatar name={agent.name} email={agent.email} size={28} round color="#DDDFE0" fgCol="#ffffff" />
                    <span>
                      {agent.name}
                    </span>
                </td>

                <td>
                  {helpers.numberWithCommas(agent.listed_volume)}
                </td>

                <td>
                  ${helpers.numberWithCommas(agent.listed_value)}
                </td>

                <td>
                  {helpers.numberWithCommas(agent.selling_volume)}
                </td>

                <td>
                  ${helpers.numberWithCommas(agent.selling_value)}
                </td>

                <td>
                  {helpers.numberWithCommas(agent.active_volume)}
                </td>

                <td>
                  ${helpers.numberWithCommas(agent.active_value)}
                </td>

                <td>
                  {helpers.numberWithCommas(agent.total_active_volume)}
                </td>

                <td>
                  ${helpers.numberWithCommas(agent.total_active_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}