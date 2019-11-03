import { BlockRenderer } from 'draft-js-export-html'
import { ContentBlock } from 'draft-js'

import { renderAttributes } from './render-attributes'

export const blockLevelLinkRendererWrapper = (
  renderer: BlockRenderer,
  block: ContentBlock
) => {
  const result = renderer(block)
  const href = block.getData().get('href')
  const title = block.getData().get('title')

  if (href) {
    return `<a ${renderAttributes({ href, title })}>${result}</a>`
  }

  return result
}
