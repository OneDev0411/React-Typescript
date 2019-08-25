import { CSSProperties } from 'react'

import { AtomicBlockEntityData } from '../types'

export function getAlignmentStyles(
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
