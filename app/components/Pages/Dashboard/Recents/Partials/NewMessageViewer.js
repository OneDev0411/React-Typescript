// NewMessageViewer.js
import React, { Component } from 'react'
import { Input } from 'react-bootstrap'
import S from 'shorti'
import Select from 'react-select'
export default class NewMessageViewer extends Component {
  handleKeyUp() {
    console.log('test')
  }
  render() {
    // Data
    const data = this.props.data
    return (
      <div>
        <div style={ S('h-60 border-bottom-1-solid-e2e6ea') }>
          <h3 style={ S('w-80p mt-0 ml-20 mr-50 pt-15') }>New Message</h3>
        </div>
        <div style={ S('relative w-100p h-50 border-bottom-1-solid-e2e6ea p-10') }>
          <div style={ S('absolute l-10 t-15') }>To:</div>
          <div style={ S('absolute l-35 t-5 w-100p') }>
            <Input onKeyUp={ this.handleKeyUp.bind(this) } type="text" placeholder="Enter name, email or phone" style={ S('border-none w-100p') }/>
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
NewMessageViewer.propTypes = {
  data: React.PropTypes.object
}