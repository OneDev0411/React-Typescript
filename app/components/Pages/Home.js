// Home.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'

export default class Home extends Component {

  render(){

    // Data
    const data = this.props.data

    // Styles
    const btnStyle = S('font-18 w-100p maxw-400 mb-20 bc-3388ff color-3388ff')
    const lightWeight = S('fw-100')
    const lightBtn = { ...btnStyle, ...lightWeight, ...S('p-10') }
    const tagStyle = S('font-46 mb-40')
    const bold = S('font-40 mb-20')

    return (
      <div id="main-content" className="container" style={ S('mb-40') }>
        <div className="text-center col-sm-12">
          <div style={ S('m-20') }>
            <img src="/static/images/home/family-1.png"/>
          </div>
          <p className="tempo" style={tagStyle}>
            real estate moves fast<br className="hidden-xs"/>
            move faster with <b className="text-primary">Rechat</b>
          </p>
          <div>
            <Link style={ lightBtn } className="btn btn-default" to="signup?type=agent">I'm an Agent</Link>
            <div className="clearfix"></div>
            <Link style={ lightBtn } className="btn btn-default" to="signup?type=client">I'm a Client</Link>
            <div className="clearfix"></div>
            <Link style={ S('font-18') } to="signin">Sign in</Link>
          </div>
        </div>
      </div>
    )
  }
}
