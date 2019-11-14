import { AtomicBlockEntityData } from '../types'
import { renderAttributes } from './render-attributes'

/**
 * IMPORTANT: this is mainly because of Outlook desktop which seem to strip
 * styles
 * Creates attributes string based on entity data created by plugins used for
 * atomic blocks like image. Their internal blockRendererFn is not useful
 * because they don't render to string, and also the signature is different than
 * blockRendererFn in stateToHTML options.
 */
export function renderAtomicBlockAttrs({
  src,
  alignment,
  width,
  height
}: AtomicBlockEntityData): string {
  return renderAttributes({
    src,
    width,
    align: alignment
  })
}
