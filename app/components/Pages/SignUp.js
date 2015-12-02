// SignUp.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'

// AppStore
import AppStore from '../../stores/AppStore'

// Partials
import BigHeading from '../Partials/BigHeading'

export default class SignUp extends Component {

  componentWillMount(){
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.emitChange()
  }

  render(){
    
    // Data
    const data = this.props.data
    const signup_button_style = S('w-100p')
    const lightWeight = S('fw-100')
    let type;
    if(this.props.location.query.type){
      type = this.props.location.query.type
    }

    return (
      <div id="main-content" className="container">
        <div className="text-center center-block" style={ S('maxw-400') }>
          <BigHeading />
          <h1 style={ lightWeight }>Sign up as { type }</h1>
          <form action="/recents">
            <Input type="text" ref="input" placeholder="Email"/>
            <Input type="text" ref="input" placeholder="Password"/>
            <Input type="text" ref="input" placeholder="Confirm Password"/>
            <Link className="btn btn-primary" style={ signup_button_style } to="/dashboard">Start Rechatting</Link>
            <div style={ S('color-929292 font-13 mt-20') }>Already have an account?  <Link to="signin">Sign in</Link></div>
          </form>
        </div>
      </div>
    )
  }
}