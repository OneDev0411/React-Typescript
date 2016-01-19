// Dashboard/Tasks/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'

export default class Tasks extends Component {

  render() {
    const data = this.props.data
    const main_style = S('absolute l-183 r-0')

    return (
      <div style={ S('minw-1000') }>
        <Header data={ data }/>
        <main style={ S('pt-20') }>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('ml-20') }>
              <p>This is tasks stuff</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Tasks.propTypes = {
  data: React.PropTypes.object
}