import React from 'react'

import { calculateWordWrap } from 'deals/FormEdit/utils/word-wrap'

export function AnnotationWrapper(props) {
  return (
    <>
      {Object.entries(props.items).map(([, groups]) =>
        Object.entries(groups).map(([, group]) => {
          const annotation = group[0]

          const annotations = group
            .sort((a, b) => a.order - b.order)
            .map(item => item.annotation)

          const { appearance, rects, values, fontSize } = calculateWordWrap(
            annotations,
            getFormValue(props.values, annotations)
          )

          return rects.map((rect, index) => {
            const key = `${annotation.annotation.fieldName}-${index}`

            const style = {
              position: 'absolute',
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              fontSize: `${fontSize || 16}px`,
              fontFamily: appearance.font,
              color: appearance.color,
              fontWeight: appearance.bold ? 'bold' : 'normal',
              minWidth: '15px',
              padding: '0 3px',
              cursor: 'pointer'
            }

            if (annotation.readonly) {
              return (
                <div
                  key={key}
                  style={{
                    ...style,
                    cursor: 'default',
                    padding: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    whiteSpace: 'pre'
                  }}
                >
                  {values[index]}
                </div>
              )
            }

            return props.render({
              key,
              style,
              rect,
              values,
              group,
              appearance: {
                ...appearance,
                fontSize
              },
              annotation,
              rectIndex: index,
              value: values[index] || ''
            })
          })
        })
      )}
    </>
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
