// Verify/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import Email from './Partials/Email'
import Phone from './Partials/Phone'
import BigHeading from '../../Partials/BigHeading'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

export default class Verify extends Component {

  componentDidMount(){
    // Reset data store
    AppStore.data = {}
    AppStore.emitChange()
  }

  handleSubmit(code, token){
    AppDispatcher.dispatch({
      action: 'verify-phone',
      code: code,
      token: token
    })
  }

  render(){
    
    // Data
    const data = this.props.data
    const pathname = this.props.location.pathname
    const slug = this.props.params.slug

    let main_content
    if(slug === 'email'){
      main_content = (
        <Email data={ data }/>
      )
    }

    if(slug === 'phone'){
      main_content = (
        <Phone data={ data } handleSubmit={ this.handleSubmit }/>
      )
    }
    
    // Styles
    const headingStyle = S('font-60 color-3388ff')
    
    return (
      <div id="main-content" className="container">
        <div className="text-center">
          <BigHeading />
          { main_content }
        </div>
      </div>
    )
  }
}