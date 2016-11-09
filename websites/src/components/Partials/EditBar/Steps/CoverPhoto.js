import React, { Component } from 'react'
import S from 'shorti'
import { Button } from 'react-bootstrap'
import upload_photo from '../images/upload.png'
class CoverPhoto extends Component {
  render() {
    const data = this.props.data
    return (
      <div>
        <div style={ S('w-100p h-4 bg-34475e mb-10 mt-20n br-3') }>
          <div style={ S('w-20p bg-6488b5 h-4 br-3') }></div>
        </div>
        <div style={ S('font-32 mb-20') }>Cover Photo</div>
        <div style={ S('mb-20') }>
          <img role="presentation" src={ upload_photo } style={ S('w-100p') }/>
        </div>
        <div>
          <div style={ S('mb-20 op-.5') }>The cover photo is an extension of you, your brand, and your personality. Cover photo should be clean and balanced with focus on you.</div>
          <div style={ S('mb-20') }>
            <div style={ S('mb-20 op-.5') }>Good examples of cover photos:</div>
            <div style={ S('pull-left mb-20') }>
              <img role="presentation" src={ require('../images/examples/1.png') } style={ S('w-160 mr-20') }/>
              <img role="presentation" src={ require('../images/examples/2.png') } style={ S('w-160') }/>
            </div>
            <div style={ S('pull-left mb-20') }>
              <img role="presentation" src={ require('../images/examples/3.png') } style={ S('w-160 mr-20') }/>
              <img role="presentation" src={ require('../images/examples/4.png') } style={ S('w-160') }/>
            </div>
          </div>
        </div>
        <div style={ S('absolute b-20 w-340') }>
          <Button style={ S('bg-f67608 border-none color-fff w-100p h-40') } onClick={ this.props.goToStep.bind(this, data.step + 1) }>
            Looks Good! <i className="fa fa-chevron-right"></i>
          </Button>
        </div>
      </div>
    )
  }
}

export default CoverPhoto