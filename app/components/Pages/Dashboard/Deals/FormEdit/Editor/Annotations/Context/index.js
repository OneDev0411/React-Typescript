import React from 'react'

import { getField } from 'models/Deal/helpers/context/get-field'

import { calculateWordWrap } from '../../../utils/word-wrap'

import { AnnotationWrapper } from '../components/AnnotationWrapper'
import { ContextField } from './ContextField'

function Contexts(props) {
  const handleSaveValue = (inputProps, value, updateContext = true) => {
    const annotations = inputProps.group.map(item => item.annotation)
    const valuesList = {}

    const { values } = calculateWordWrap(annotations, value)

    if (!updateContext) {
      inputProps.group.forEach((item, index) => {
        valuesList[item.annotation.fieldName] = values[index]
      })
    }

    console.log('>>>>', valuesList)
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
