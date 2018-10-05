import React, { Fragment } from 'react'

import CheckboxAnnotation from './checkbox'
import RadioAnnotation from './radio'
import TextInputAnnotation from './text-input'

import { getType, getValue, Types } from '../../../utils/types'

export default class FormInputs extends React.Component {
  state = {
    isLoaded: false
  }

  componentDidMount() {
    this.setDefaultValues()
  }

  setDefaultValues() {
    const values = {}

    this.props.annotations.forEach(annotation => {
      const { fieldName } = annotation

      values[fieldName] = getValue(annotation)
    })

    this.props.onSetValues(values, true)

    this.setState({ isLoaded: true })
  }

  createInput = (info, index) => {
    const { values } = this.props

    const { annotation } = info

    const type = getType(annotation)
    const value = values[annotation.fieldName]

    const props = {
      key: `${annotation.fieldName}-${index}`,
      annotation,
      value,
      onValueUpdate: this.props.onValueUpdate.bind(null, annotation.fieldName)
    }

    // Annotations like Signature which we dont support in here.
    // Please note that we do support Signatures through text boxes
    // Which have specific directions in their calculate field
    if (type === Types.UNKNOWN_ANNOTATION)
      return null

    if (type === Types.CHECKBOX_ANNOTATION) {
      return <CheckboxAnnotation {...props} />
    }

    if (type === Types.RADIO_ANNOTATION) {
      return <RadioAnnotation {...props} />
    }

    return <TextInputAnnotation {...props} />
  }

  render() {
    if (!this.state.isLoaded) {
      return null
    }

    return <Fragment>{this.props.inputs.map(this.createInput)}</Fragment>
  }
}
