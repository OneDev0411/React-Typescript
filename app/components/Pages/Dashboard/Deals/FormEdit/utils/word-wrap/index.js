import memoize from 'lodash/memoize'

import parseAppearanceString from '../appearance'
import linebreak from '../linebreak'

export const calculateWordWrap = memoize(
  (
    annotations,
    value,
    options = {
      maxFontSize: 20
    }
  ) => {
    const first = annotations[0]
    const appearance = parseAppearanceString(first.defaultAppearance)

    const rects = annotations.map(annotation => {
      const rect = annotation.rect

      return {
        left: rect[0],
        top: rect[1],
        right: rect[2],
        bottom: rect[3],
        width: Math.floor(rect[2] - rect[0]),
        height: Math.floor(rect[3] - rect[1]),
        multiline: annotation.multiLine
      }
    })

    let { values, fontSize } = linebreak(
      value,
      rects,
      appearance.size,
      appearance.font,
      appearance.bold
    )

    fontSize = Math.min(fontSize - 1, options.maxFontSize || fontSize)

    return {
      appearance,
      rects,
      values,
      fontSize
    }
  },
  (annotations, value, options) =>
    JSON.stringify({
      annotations,
      value,
      options
    })
)

export function getAnnotationsValues(annotations, value, options = {}) {
  const { values } = calculateWordWrap(annotations, value, options)
  const list = {}

  annotations.forEach((annotation, index) => {
    const { fieldName } = annotation

    list[fieldName] = values[index] || ''
  })

  return list
}
