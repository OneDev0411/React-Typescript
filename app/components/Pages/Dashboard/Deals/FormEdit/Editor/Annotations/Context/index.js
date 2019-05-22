import React from 'react'

import { getField } from 'models/Deal/helpers/context/get-field'

import { getAnnotationsByType } from 'deals/FormEdit/utils/get-annotations-by-type'
import { getGroupValues } from 'deals/FormEdit/utils/get-group-values'
import { normalizeContextValue } from 'deals/FormEdit/utils/normalize-context-value'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { ContextField } from './ContextField'

function Contexts(props) {
  const handleSaveValue = (
    inputProps,
    context,
    value,
    updateContext = true
  ) => {
    if (!updateContext) {
      return props.onValueUpdate(getGroupValues(inputProps.group, value))
    }

    let fields = {}
    const list = getAnnotationsByType(props.annotations, 'contexts')

    list.forEach(group => {
      if (group[0].context === inputProps.annotation.context) {
        fields = {
          ...fields,
          ...getGroupValues(group, value)
        }
      }
    })

    props.onValueUpdate(fields, {
      [inputProps.annotation.context]: normalizeContextValue(context, value)
    })
  }

  return (
    <AnnotationWrapper
      items={props.annotations[props.pageIndex].contexts}
      values={props.values}
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
