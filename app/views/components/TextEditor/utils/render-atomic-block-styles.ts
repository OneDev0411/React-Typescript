import { AtomicBlockEntityData } from '../types'
import { getAlignmentStyles } from './get-alignment-styles'
import { stylesToString } from './styles-to-string'
import { getSizeStyles } from './get-size-styles'

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
  return stylesToString({
    ...getAlignmentStyles(alignment),
    ...getSizeStyles(width, height)
  })
}
