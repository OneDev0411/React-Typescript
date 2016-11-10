import React, { Component } from 'react'
import S from 'shorti'
import { Button, FormControl } from 'react-bootstrap'
import style from './style'
import Dropzone from 'react-dropzone'
class Step extends Component {
  onDrop(key, accepted_files, rejected_files) {
    this.props.uploadMedia(key, accepted_files)
  }
  handleChange(key, e) {
    this.props.editText(key, e.target.value)
  }
  getInput(attribute) {
    switch (attribute.type) {
      case 'Media':
        return (
          <div style={ S('mb-20') }>
            <Dropzone style={ S('w-250 h-250 border-3-dashed-ccc') } onDrop={this.onDrop.bind(this, attribute.key)} multiple={false}>
              <div style={ S(`text-center pt-100 bg-url(${attribute.value ? attribute.value : ''}) bg-cover w-250 h-250 absolute`) }>
                <Button bsStyle="primary">Upload</Button>
              </div>
            </Dropzone>
          </div>
        )
      case 'text':
        return (
          <div>
            <div style={ S('mb-10') }>{ attribute.title }</div>
            <FormControl key={`key-${attribute.key}`} style={ style.input } type="text" onChange={this.handleChange.bind(this, attribute.key)} defaultValue={ attribute.value }></FormControl>
          </div>
        )
      case 'textarea':
        return (
          <div>
            <div style={ S('mb-10') }>{ attribute.title }</div>
            <FormControl key={`key-${attribute.key}`} style={ { ...style.input, ...S('h-100'), resize: 'none' } } componentClass="textarea" onChange={this.handleChange.bind(this, attribute.key)} defaultValue={ attribute.value }></FormControl>
          </div>
        )
      default:
        return
    }
  }
  getButtons() {
    const data = this.props.data
    const steps = data.steps
    const next_step = steps[data.step]
    let back_button
    if (data.step !== 1) {
      back_button = (
        <Button style={ S(`bg-f67608 border-none color-fff w-${!next_step ? '30' : '45'}p h-40`) } onClick={ this.props.goToStep.bind(this, data.step - 1) }>
          Back
        </Button>
      )
    }
    let next_button
    if (next_step) {
      next_button = (
        <Button style={ S(`bg-f67608 border-none color-fff w-${!back_button ? '100' : '45'}p h-40 pull-right`) } onClick={ this.props.goToStep.bind(this, data.step + 1) }>
          Looks Good! <i className="fa fa-chevron-right"></i>
        </Button>
      )
    }
    let domains_button
    if (!next_step) {
      domains_button = (
        <Button style={ S('bg-f67608 border-none color-fff w-65p h-40 pull-right') }>
          Done. Go to Domains. <i className="fa fa-chevron-right"></i>
        </Button>
      )
    }
    return (
      <div>
        { back_button }
        { next_button }
        { domains_button }
      </div>
    )
  }
  render() {
    const data = this.props.data
    const steps = data.steps
    const step = steps[data.step - 1]
    const attributes = step.attributes
    return (
      <div>
        <div style={ S('w-100p h-4 bg-34475e mb-10 mt-20n br-3') }>
          <div style={ S(`w-${Math.floor((data.step / steps.length) * 100)}p bg-6488b5 h-4 br-3`) }></div>
        </div>
        <div style={ S('font-32 mb-20') }>{ step.title }</div>
        {
          attributes.map((attribute, i) => {
            return (
              <div key={`attr${i}`}>
                { this.getInput(attribute) }
                <div>
                  <div style={ S('mb-20 op-.5') }>{ attribute.description }</div>
                </div>
                <div style={ S('absolute b-20 w-340') }>
                  { this.getButtons() }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
export default Step