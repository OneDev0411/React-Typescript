// Dashboard/Index.js
import React, { Component } from 'react'

// Partials
import SideBar from '../../Partials/SideBar'
import FilterBar from './Partials/FilterBar'
import Results from './Partials/Results'

export default class Dashboard extends Component {

  render() {
    // Data
    const data = this.props.data

    return (
      <div id="agents">
        <main>
          <SideBar data={ data }/>
          <FilterBar data={ data }/>
          <Results data={ data }/>
        </main>
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}