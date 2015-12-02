// NoMatch.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

export default class NoMatch extends Component {

  render(){
    
    // Data
    let data = this.props.data

    // Styles
    const headingStyle = S('font-60 color-3388ff')

    return (
      <div>
        <div id="main-content" className="container text-center">
          <h1 className="tk-calluna-sans" style={ headingStyle }>404 Error</h1>
          You look lost.  Need some help?
          <br/>
          <br/>
          <img src="/dist/images/goats/tongue.gif"/>
          <br/>
          <br/>
          <Link to="/">Take me home</Link>
        </div>
      </div>
    )
  }
}