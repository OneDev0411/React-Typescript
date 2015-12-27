// Dashboard/Contacts/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

export default class Contacts extends Component {

  render() {
    const data = this.props.data
    const main_style = S('absolute l-222 r-0')

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('ml-20') }>
              <h1>Contacts</h1>
              <p>This is contacts stuff</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Contacts.propTypes = {
  data: React.PropTypes.object
}