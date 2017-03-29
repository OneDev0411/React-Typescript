// Agents/Index.js
import React, { Component } from 'react'

// Partials
import SideBar from '../../Partials/SideBar'
import FilterBar from './Partials/FilterBar'
import Results from './Partials/Results'
import Header from './Partials/Header'

// AppStore
import AppStore from '../../../../../stores/AppStore'

export default class Agents extends Component {

  componentWillMount() {
    const data = AppStore.data

    data.agents = {
      filters: new Set(),
      agents: undefined,
      rows: undefined,
      searching: false,
      sort: {
        column: 'name',
        direction: 'ASC'
      }
    }
  }

  render() {
    // Data
    const data = this.props.data

    return (
      <div id="agents">
        <main>
          <Header data={data} />
          <SideBar data={data} />
          <FilterBar data={data} />
          <Results data={data} />
        </main>
      </div>
    )
  }
}

// PropTypes
Agents.propTypes = {
  data: React.PropTypes.object
}