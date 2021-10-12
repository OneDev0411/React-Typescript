import React from 'react'

import debounce from 'debounce'

import { getType, Types } from 'deals/FormEdit/utils/types'

import CheckboxAnnotation from './Checkbox'
import ComboboxAnnotation from './Combobox'
import RadioAnnotation from './Radio'
import TextInputAnnotation from './TextInput'

export const FormInputs = props => (
  <>
    {props.annotations[props.pageIndex].inputs.map(info => {
      const { annotation } = info

      const type = getType(annotation)

      // Annotations like Signature which we dont support in here.
      // Please note that we do support Signatures through text boxes
      // Which have specific directions in their calculate field
      if (type === Types.UNKNOWN_ANNOTATION) {
        return null
      }

      const sharedProps = {
        annotation,
        type: info.type,
        format: info.format,
        defaultValue:
          props.values[annotation.fieldName] ?? annotation.fieldValue,
        onChange: debounce(props.onValueUpdate, 1000)
      }

      if (type === Types.CHECKBOX_ANNOTATION) {
        return (
          <CheckboxAnnotation key={annotation.fieldName} {...sharedProps} />
        )
      }

      if (type === Types.RADIO_ANNOTATION) {
        return (
          <RadioAnnotation
            key={annotation.fieldName}
            {...sharedProps}
            values={props.values}
          />
        )
      }

      if (type === Types.COMBOBOX_ANNOTATION) {
        return (
          <ComboboxAnnotation key={annotation.fieldName} {...sharedProps} />
        )
      }

      return <TextInputAnnotation key={annotation.fieldName} {...sharedProps} />
    })}
  </>
)
