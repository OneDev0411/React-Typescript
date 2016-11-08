import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
import CoverPhoto from './Steps/CoverPhoto'
import Social from './Steps/Social'

class EditBar extends Component {
  getStep() {
    const data = this.props.data
    return <CoverPhoto data={ data }/>
  }
  render() {
    const main_style = S('fixed w-400 h-100p r-0 t-0 bg-263445 p-30 color-fff')
    return (
      <div style={ main_style }>
        { this.getStep() }
      </div>
    )
  }
}

export default EditBar
