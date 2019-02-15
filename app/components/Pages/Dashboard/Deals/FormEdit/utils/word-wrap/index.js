import parseAppearanceString from '../appearance'
import linebreak from '../linebreak'

export function calculateWordWrap(annotations, value, options = {}) {
  const first = annotations[0]
  const appearance = parseAppearanceString(first.defaultAppearance)

  // TODO: Proper grouping
  const rects = annotations.map(annotation => {
    const rect = annotation.rect

    return {
      left: rect[0],
      top: rect[1],
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

  fontSize = Math.min(fontSize, options.maxFontSize || fontSize)

  return {
    appearance,
    rects,
    values,
    fontSize
  }
}

export function getAnnotationsValues(annotations, value, options = {}) {
  const { values } = calculateWordWrap(annotations, value, options)
  const list = {}

  annotations.forEach((annotation, index) => {
    const { fieldName } = annotation

    list[fieldName] = values[index] || ''
  })

  return list
}
