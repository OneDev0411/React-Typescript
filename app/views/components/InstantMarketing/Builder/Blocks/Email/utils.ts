import type { Editor, Model } from 'grapesjs'

import adapt from '../adapt'
import type { BlockTemplates, GetBlockTemplateFunc } from '../types'

const BLOCK_IDS_TO_REMOVE = [
  'mj-button',
  'mj-image',
  'mj-social-group',
  'mj-social-element',
  'mj-navbar',
  'mj-navbar-link',
  'mj-1-column',
  'mj-2-columns',
  'mj-3-columns',
  'mj-text',
  'mj-divider',
  'mj-spacer',
  'mj-carousel',
  'mj-carousel-image',
  'mj-hero'
]

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function adaptTemplates(
  templates: BlockTemplates
): GetBlockTemplateFunc {
  return (parent: Model | null, blockId: string) =>
    parent && templates[blockId]
      ? adapt(parent, templates[blockId])
      : templates[blockId]
}

export const isComponent = (
  type: string,
  returnFunc?: (el: HTMLElement) => object
) => (el: HTMLElement) =>
  el.tagName === type
    ? returnFunc
      ? { type, ...returnFunc(el) }
      : true
    : false
