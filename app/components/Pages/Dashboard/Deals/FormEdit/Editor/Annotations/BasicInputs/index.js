import React, { Fragment } from 'react'

import _ from 'underscore'

import CheckboxAnnotation from './Checkbox'
import RadioAnnotation from './Radio'
import TextInputAnnotation from './TextInput'

import { getType, Types } from '../../../utils/types'

export const FormInputs = React.memo(
  props => (
    <Fragment>
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
          defaultValue: annotation.fieldValue,
          onChange: _.debounce(
            value =>
              props.onValueUpdate({
                [annotation.fieldName]: value
              }),
            1000
          )
        }

        if (type === Types.CHECKBOX_ANNOTATION) {
          return <CheckboxAnnotation key={index} {...sharedProps} />
        }

        if (type === Types.RADIO_ANNOTATION) {
          return <RadioAnnotation key={index} {...sharedProps} />
        }

        return <TextInputAnnotation key={index} {...sharedProps} />
      })}
    </Fragment>
  ),
  () => true
)
