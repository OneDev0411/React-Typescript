// Phone.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

export default class Phone extends Component {

  handleSubmit(e){

    e.preventDefault()
    const code = this.refs.code.refs.input.value
    const token = helpers.getParameterByName('token')
    this.props.handleSubmit(code, token)
  }

  render(){
    
    const data = this.props.data

    let main_content = (
      <div>
        <div style={ S('color-929292 mb-20') }>Confirm your phone</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input ref="code" placeholder="Enter 4 digit code" type="text" maxLength="4" />
          <Button type="submit" bsStyle="primary" style={ S('w-100p') }>Verify</Button>
        </form>
      </div>
    )

    return (
      <div className="center-block" style={ S('maxw-150') }>
        { main_content }
      </div>
    )
  }
}