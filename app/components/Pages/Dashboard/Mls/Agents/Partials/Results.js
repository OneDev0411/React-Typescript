// Dashboard/Index.js
import React, { Component } from 'react'
import Avatar from 'react-avatar'

if (process.env.WEBPACK_PROCESS === 'build')
  require('../../../../../../src/sass/components/pages/agent-report.scss')

export default class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rows: [],
      sort: {
        column: null,
        direction: null
      }
    }
  }

  componentWillReceiveProps(props) {
    this.setRows(props.data.agent_report || [])
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
    this.setState({ rows: transformed })
  }

  sort(column) {
    const direction = this.state.sort.direction === 'ASC' ? 'DESC' : 'ASC'

    const comparer = (a, b) => {
      if (direction === 'ASC')
        return (a[column] > b[column]) ? 1 : -1
      else if (direction === 'DESC')
        return (a[column] < b[column]) ? 1 : -1
    }

    this.setState({
      rows: this.state.rows.sort(comparer),
      sort: {
        column,
        direction
      }
    })
  }

  sortIcon(column) {
    if (this.state.sort.column !== column)
      return ''

    if (this.state.sort.direction === 'ASC') {
      return (
        <i className="fa fa-sort-asc" />
      )
    }

    return (
      <i className="fa fa-sort-desc" />
    )
  }

  render() {
    const rows = this.state.rows

    return (
      <div>
        <table id="agents" border="1" width="70%">
          <thead>
            <tr>
              <th>
                Agent
              </th>

              <th onClick={this.sort.bind(this, 'listed_volume')}>
                List Volume {this.sortIcon('listed_volume')}
              </th>

              <th onClick={this.sort.bind(this, 'listed_value')}>
                List Value {this.sortIcon('listed_value')}
              </th>

              <th onClick={this.sort.bind(this, 'selling_volume')}>
                Sell Volume {this.sortIcon('selling_volume')}
              </th>

              <th onClick={this.sort.bind(this, 'selling_value')}>
                Sell Value {this.sortIcon('selling_value')}
              </th>

              <th onClick={this.sort.bind(this, 'active_volume')}>
                Active Volume {this.sortIcon('active_volume')}
              </th>

              <th onClick={this.sort.bind(this, 'active_value')}>
                Active Value {this.sortIcon('active_value')}
              </th>

              <th onClick={this.sort.bind(this, 'total_active_volume')}>
                Total Active Volume {this.sortIcon('total_active_volume')}
              </th>

              <th onClick={this.sort.bind(this, 'total_active_value')}>
                Total Active Value {this.sortIcon('total_active_value')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(agent => (
              <tr>
                <td>
                    <Avatar name={agent.name} email={agent.email} size={28} round color="#DDDFE0" fgCol="#ffffff" />
                    &nbsp;
                    {agent.name}
                </td>

                <td>
                  {agent.listed_volume}
                </td>

                <td>
                  {agent.listed_value}
                </td>

                <td>
                  {agent.selling_volume}
                </td>

                <td>
                  {agent.selling_value}
                </td>

                <td>
                  {agent.active_volume}
                </td>

                <td>
                  {agent.active_value}
                </td>

                <td>
                  {agent.total_active_volume}
                </td>

                <td>
                  {agent.total_active_value}
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