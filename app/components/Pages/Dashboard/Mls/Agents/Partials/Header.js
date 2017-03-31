// Agents/Header.js
import React, { Component } from 'react'
import helpers from '../../../../../../utils/helpers'

export default class Header extends Component {
  render() {
    const data = this.props.data
    const count = data.agents.agents ? data.agents.agents.length : 0

    return (
      <div id="header">
        <div id="separator">
          Filters
        </div>
        <div id="info">
          <div id="arrow" />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { helpers.numberWithCommas(count) } Agent Matches
        </div>
      </div>
    )
  }
}

// PropTypes
Header.propTypes = {
  data: React.PropTypes.object.isRequired
}