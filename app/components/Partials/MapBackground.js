// MapBackground.js
import React, { Component } from 'react'
import S from 'shorti'

export default class MapBackground extends Component {
  render() {
    const bg_style = {
      ...S('absolute t-0 l-0 w-100p h-100p bg-url(/images/signup/mapblur.jpg)'),
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat'
    }
    return (
      <div style={ bg_style }></div>
    )
  }
}