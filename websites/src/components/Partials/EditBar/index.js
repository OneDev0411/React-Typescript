import React, { Component } from 'react'
import S from 'shorti'
import Step from './Step'

class EditBar extends Component {
  getStep(step) {
    return <Step {...this.props}/>
  }
  render() {
    const data = this.props.data
    const main_style = S('fixed w-400 h-100p r-0 t-0 bg-263445 p-30 color-fff')
    return (
      <div style={ main_style }>
        { this.getStep(data.step) }
      </div>
    )
  }
}
export default EditBar
