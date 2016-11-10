import React, { Component } from 'react'
import S from 'shorti'
import { Button, FormControl } from 'react-bootstrap'
import style from './style'
class Social extends Component {
  render() {
    const data = this.props.data
    return (
      <div>
        <div style={ S('w-100p h-4 bg-34475e mb-10 mt-20n br-3') }>
          <div style={ S('w-60p bg-6488b5 h-4 br-3') }></div>
        </div>
        <div style={ S('font-32 mb-20') }>Quick Highlights</div>
        <div>
          <div style={ S('mb-10') }>Highlight 1</div>
          <FormControl style={ style.input } type="text"></FormControl>
          <div style={ S('mb-10') }>Highlight 2</div>
          <FormControl style={ style.input } type="text"></FormControl>
          <div style={ S('mb-10') }>Highlight 3</div>
          <FormControl style={ style.input } type="text"></FormControl>
          <div style={ S('mb-10') }>Highlight 4</div>
          <FormControl style={ style.input } type="text"></FormControl>
          <div style={ S('mb-10') }>Highlight 5</div>
          <FormControl style={ style.input } type="text"></FormControl>
          <div>
            These are all sample highlights. Highlights are important to let clients know your experience at a glance.
          </div>
        </div>
        <div style={ S('absolute b-20 w-340') }>
          <Button style={ S('bg-f67608 border-none color-fff w-45p h-40') } onClick={ this.props.goToStep.bind(this, data.step - 1) }>
            Back
          </Button>
          <Button style={ S('bg-f67608 border-none color-fff w-45p h-40 pull-right') } onClick={ this.props.goToStep.bind(this, data.step + 1) }>
            Next <i className="fa fa-chevron-right"></i>
          </Button>
        </div>
      </div>
    )
  }
}

export default Social