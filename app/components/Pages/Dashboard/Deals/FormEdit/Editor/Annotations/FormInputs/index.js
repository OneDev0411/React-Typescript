import React, { Fragment } from 'react'

import CheckboxAnnotation from './Checkbox'
import RadioAnnotation from './Radio'
import TextInputAnnotation from './TextInput'

import { getType, Types } from '../../../utils/types'

export default class FormInputs extends React.Component {
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
    if (type === Types.UNKNOWN_ANNOTATION) {
      return null
    }

    if (type === Types.CHECKBOX_ANNOTATION) {
      return <CheckboxAnnotation {...props} />
    }

    if (type === Types.RADIO_ANNOTATION) {
      return <RadioAnnotation {...props} />
    }

    return <TextInputAnnotation {...props} />
  }

  render() {
    return <Fragment>{this.props.inputs.map(this.createInput)}</Fragment>
  }
}
