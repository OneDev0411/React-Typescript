// Verify/index.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import Email from './Partials/Email'
import Phone from './Partials/Phone'
import BigHeading from '../../Partials/BigHeading'

export default class Verify extends Component {

  handleSubmit(code, token){
    console.log(code, token)
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