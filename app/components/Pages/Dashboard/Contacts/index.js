// Dashboard/Contacts/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import config from '../../../../../config/public'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

// Socket.io
import io from 'socket.io-client'

export default class Contacts extends Component {

  render(){

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
Contacts.proptypes = {
  data: React.PropTypes.object.isRequired
}