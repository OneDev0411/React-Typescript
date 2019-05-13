import React from 'react'
import _ from 'underscore'

import { getField } from 'models/Deal/helpers/context/get-field'

import { getAnnotationsByType } from '../../../utils/get-annotations-by-type'
import { getGroupValues } from '../../../utils/get-group-values'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { ContextField } from './ContextField'

function Contexts(props) {
  const handleSaveValue = (inputProps, value, updateContext = true) => {
    let fields = {}
    const list = getAnnotationsByType(props.annotations, 'contexts')

    if (updateContext) {
      list.forEach(group => {
        fields = {
          ...fields,
          ...getGroupValues(group, value)
        }
      })
    } else {
      fields = getGroupValues(inputProps.group, value)
    }

    console.log(fields)
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].contexts}
      values={props.values}
      getValue={(name, annotation) =>
        !annotation.disableAutopopulate && getField(props.deal, name)
      }
      render={inputProps => (
        <ContextField
          key={inputProps.key}
          deal={props.deal}
          onSaveValue={handleSaveValue.bind(null, inputProps)}
          {...inputProps}
        />
      )}
    />
  )
}

export default Contexts
