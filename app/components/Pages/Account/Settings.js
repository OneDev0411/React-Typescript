// Settings.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

// AppStore
import AppStore from '../../../stores/AppStore'

export default class Settings extends Component {

  render(){
    
    // Data
    const data = AppStore.data
    
    return (
      <div id="main-content" className="container">
        <div className="text-center col-sm-12">
          <h1>Settings</h1>
          <p>{ data.user.id }</p>
        </div>
      </div>
    )
  }
}