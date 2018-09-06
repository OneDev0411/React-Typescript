import React, { Fragment } from 'react'

import CheckboxAnnotation from './checkbox'
import RadioAnnotation from './radio'
import TextInputAnnotation from './text-input'

const TEXT_ANNOTATION = 1
const RADIO_ANNOTATION = 2
const CHECKBOX_ANNOTATION = 3
const UNKNOWN_ANNOTATION = 4

export default class FormInputs extends React.Component {
  getType(annotation) {
    if (annotation.fieldType === 'Tx') {
      return TEXT_ANNOTATION
    }

    if (annotation.fieldType === 'Btn') {
      if (annotation.fieldFlags & 32768) {
        return RADIO_ANNOTATION
      }

      return CHECKBOX_ANNOTATION
    }

    return UNKNOWN_ANNOTATION
  }

  createInput = (info, index) => {
    const { values } = this.props

    const { annotation } = info

    const type = this.getType(annotation)
    const value = values[annotation.fieldName]

    const props = {
      key: `${annotation.fieldName}-${index}`,
      annotation,
      value,
      onValueUpdate: this.props.onValueUpdate.bind(this, annotation.fieldName)
    }

    if (type === CHECKBOX_ANNOTATION) {
      return <CheckboxAnnotation {...props} />
    }

    if (type === RADIO_ANNOTATION) {
      return <RadioAnnotation {...props} />
    }

    return <TextInputAnnotation {...props} />
  }

  render() {
    return <Fragment>{this.props.inputs.map(this.createInput)}</Fragment>
  }
}
