import React, { Fragment } from 'react'
import _ from 'underscore'

import { calculateWordWrap } from '../../../../utils/word-wrap'

export function AnnotationWrapper(props) {
  function getFormValue(values, annotations) {
    const valueList = annotations
      .map(annotation => values[annotation.fieldName])
      .filter(Boolean)

    if (valueList.length === 0) {
      return undefined
    }

    return valueList.join(' ')
  }

  return (
    <Fragment>
      {_.map(props.items, (groups, name) =>
        _.map(groups, group => {
          const annotations = group.map(item => item.annotation)

          const formValue =
            getFormValue(props.values, annotations) ||
            props.getValue(name, group[0])

          const { appearance, rects, values, fontSize } = calculateWordWrap(
            annotations,
            formValue,
            {
              maxFontSize: 20
            }
          )

          return rects.map((rect, key) => {
            const style = {
              position: 'absolute',
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              backgroundColor: '#d2e5f2',
              fontSize: `${fontSize || 16}px`,
              fontFamily: appearance.font,
              color: appearance.color,
              fontWeight: appearance.bold ? 'bold' : 'normal',
              minWidth: '15px',
              border: '1px solid #ccc',
              transition: '0.1s ease-in all',
              padding: '0 3px',
              lineHeight: 'normal'
            }

            return props.render({
              key,
              style,
              value: values[key]
            })
          })
        })
      )}
    </Fragment>
  )
}
