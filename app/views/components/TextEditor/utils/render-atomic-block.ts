import { CSSProperties } from 'react'

interface AtomicBlockEntityData {
  alignment?: 'left' | 'right' | 'center' | 'default' // comes from alignment plugin
  width?: number // comes from block resizable plugin
  height?: number // comes from block resizable plugin
  src?: string // comes from image plugin
}

/**
 * Creates style string based on entity data created by plugins used for
 * atomic blocks like image. Their internal blockRendererFn is not useful
 * because they don't render to string, and also the signature is different than
 * blockRendererFn in stateToHTML options.
 * @param alignment
 * @param width
 * @param height
 */
export function renderAtomicBlockStyles({
  alignment,
  width,
  height
}: AtomicBlockEntityData) {
  return styleString({
    ...getAlignmentStyles(alignment),
    ...getSizeStyles(width, height)
  })
}

function getSizeStyles(
  width: number | undefined,
  height: number | undefined
): CSSProperties {
  const styles: CSSProperties = {}

  // NOTE: we currently are using 'relative' positioning which is the default
  // mode in resizable draftjs plugin. If we change that, we need to change
  // here too
  styles.width = `${width || 40}%`
  styles.height = `${height || 40}%`

  return styles
}
function getAlignmentStyles(
  alignment: AtomicBlockEntityData['alignment']
): CSSProperties {
  switch (alignment) {
    case 'center':
      return {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    case 'left':
    case 'right':
      return {
        float: alignment
      }
    default:
      return {}
  }
}

const styleString = (style: CSSProperties) =>
  Object.entries(style).reduce((styleString, [propName, propValue]) => {
    return `${styleString}${normalizePropName(propName)}:${propValue};`
  }, '')

const normalizePropName = propName =>
  propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`)
