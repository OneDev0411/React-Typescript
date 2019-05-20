import React, { Fragment } from 'react'

import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

export function AnnotationWrapper(props) {
  return (
    <Fragment>
      {Object.entries(props.items).map(([name, groups]) =>
        Object.entries(groups).map(([, group]) => {
          const annotation = group[0]

          const annotations = group
            .sort((a, b) => a.order - b.order)
            .map(item => item.annotation)

          const formValue =
            getFormValue(props.values, annotations) ||
            props.getValue(name, annotation)

          const { appearance, rects, values, fontSize } = calculateWordWrap(
            annotations,
            formValue
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

            if (annotation.readonly) {
              return (
                <div key={key} style={style}>
                  {values[key]}
                </div>
              )
            }

            return props.render({
              key,
              style,
              rect,
              values,
              group,
              annotation,
              rectIndex: key,
              value: values[key]
            })
          })
        })
      )}
    </Fragment>
  )
}

function getFormValue(values, annotations) {
  const valueList = annotations
    .map(annotation => values[annotation.fieldName])
    .filter(Boolean)

  if (valueList.length === 0) {
    return undefined
  }

  return valueList.join(' ')
}
