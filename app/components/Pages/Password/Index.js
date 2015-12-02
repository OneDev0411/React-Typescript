// Password/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import BigHeading from '../../Partials/BigHeading'
import Forgot from './Partials/Forgot'
import Reset from './Partials/Reset'

export default class Password extends Component {

  componentDidMount(){
    // Reset data store
    AppStore.data = {}
    AppStore.emitChange()
  }

  handleSubmit(action, form_data){
    
    let email = form_data.email
    if(action === 'forgot-password'){
      AppDispatcher.dispatch({
        action: 'forgot-password',
        email: email
      })
    }
  }

  render(){
    
    // Data
    const data = AppStore.data
    const pathname = this.props.location.pathname
    const slug = this.props.params.slug

    let main_content
    if(slug === 'forgot'){
      main_content = (
        <Forgot handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    if(slug === 'reset'){
      main_content = (
        <Reset handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }
    
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