import React from 'react'

import debounce from 'debounce'

import { getType, Types } from 'deals/FormEdit/utils/types'

import CheckboxAnnotation from './Checkbox'
import RadioAnnotation from './Radio'
import TextInputAnnotation from './TextInput'

export const FormInputs = React.memo(
  props => (
    <>
      {props.annotations[props.pageIndex].inputs.map((info, index) => {
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
          defaultValue: annotation.fieldValue,
          onChange: debounce(props.onValueUpdate, 1000)
        }

        if (type === Types.CHECKBOX_ANNOTATION) {
          return <CheckboxAnnotation key={index} {...sharedProps} />
        }

        if (type === Types.RADIO_ANNOTATION) {
          return (
            <RadioAnnotation
              key={index}
              {...sharedProps}
              values={props.values}
            />
          )
        }

        return <TextInputAnnotation key={index} {...sharedProps} />
      })}
    </>
  ),
  () => true
)
