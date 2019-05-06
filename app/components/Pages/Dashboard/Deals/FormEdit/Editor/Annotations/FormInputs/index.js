import React, { Fragment } from 'react'

import CheckboxAnnotation from './Checkbox'
import RadioAnnotation from './Radio'
import TextInputAnnotation from './TextInput'

import { getType, Types } from '../../../utils/types'

export function FormInputs(props) {
  return (
    <Fragment>
      {props.inputs.map((info, index) => {
        const { annotation } = info

        const type = getType(annotation)
        const value = props.values[annotation.fieldName]
        const key = `${annotation.fieldName}-${index}`

        const sharedProps = {
          annotation,
          value,
          onValueUpdate: props.onValueUpdate.bind(null, annotation.fieldName)
        }

        // Annotations like Signature which we dont support in here.
        // Please note that we do support Signatures through text boxes
        // Which have specific directions in their calculate field
        if (type === Types.UNKNOWN_ANNOTATION) {
          return null
        }

        if (type === Types.CHECKBOX_ANNOTATION) {
          return <CheckboxAnnotation key={key} {...sharedProps} />
        }

        if (type === Types.RADIO_ANNOTATION) {
          return <RadioAnnotation key={key} {...sharedProps} />
        }

        return <TextInputAnnotation key={key} {...sharedProps} />
      })}
    </Fragment>
  )
}
