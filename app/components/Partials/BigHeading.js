// BigHeading.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

export default class BigHeading extends Component {
  render() {
    // Styles
    const headingStyle = S('font-60 color-3388ff')
    return (
      <Link style={ { 'textDecoration': 'none' } } to="/">
        <h1 className="tk-calluna-sans" style={ headingStyle }>Rechat</h1>
      </Link>
    )
  }
}