// NoMatch.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

export default class NoMatch extends Component {

  render () {
    // Styles
    const headingStyle = S('font-60 color-3388ff')

    return (
      <div className="noMatch">
        <h1 className="logo">Rechat</h1>
        <div id="main-content" className="container text-center">
          <h1 className="tk-calluna-sans" >Oops. The page you were looking for doesn’t exist. Beautiful skyline, though.</h1>
          <Link to="/">Take me home</Link>
        </div>
      </div>
    )
  }
}
