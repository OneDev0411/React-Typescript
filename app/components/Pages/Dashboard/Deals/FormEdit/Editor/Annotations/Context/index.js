import React from 'react'

import { getField } from 'models/Deal/helpers/context/get-field'

import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'
import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { ContextField } from './ContextField'

function Contexts(props) {
  const handleSaveValue = (inputProps, value, updateContext = true) => {
    if (!updateContext) {
      return props.onValueUpdate(getGroupValues(inputProps.group, value))
    }

    let fields = {}
    const list = getAnnotationsByType(props.annotations, 'contexts')

    list.forEach(group => {
      fields = {
        ...fields,
        ...getGroupValues(group, value)
      }
    })

    props.onValueUpdate(fields, {
      [inputProps.annotation.context]: value
    })
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
