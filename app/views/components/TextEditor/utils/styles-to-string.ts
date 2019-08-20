import { CSSProperties } from 'react'

const normalizePropName = propName =>
  propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`)

export const stylesToString = (style: CSSProperties) =>
  Object.entries(style).reduce((styleString, [propName, propValue]) => {
    return `${styleString}${normalizePropName(propName)}:${propValue};`
  }, '')
