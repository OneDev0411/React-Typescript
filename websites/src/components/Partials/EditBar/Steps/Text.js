import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
class Social extends Component {
  render() {
    const data = this.props.data
    return (
      <div>
        <div style={ S('w-100p h-4 bg-34475e mb-10 mt-20n br-3') }>
          <div style={ S('w-100p bg-6488b5 h-4 br-3') }></div>
        </div>
        <div style={ S('font-32 mb-20') }>Text</div>
        <div>
          <div style={ S('mb-20') }>Facebook</div>
          <div style={ S('mb-20') }>Twitter</div>
          <div style={ S('mb-20') }>Instagram</div>
          <div style={ S('mb-20') }>Blog</div>
        </div>
        <div style={ S('absolute b-20 w-340') }>
          <Button style={ S('bg-f67608 border-none color-fff w-45p h-40') } onClick={ this.props.goToStep.bind(this, data.step - 1) }>
            Done. Go to Domains.
          </Button>
        </div>
      </div>
    )
  }
}

export default Social