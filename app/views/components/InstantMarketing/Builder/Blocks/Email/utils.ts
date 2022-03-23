import type { Editor } from 'grapesjs'

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
  BLOCK_IDS_TO_REMOVE.forEach(id => editor.BlockManager.remove(id))
}

export const isComponent =
  (type: string, returnFunc?: (el: HTMLElement) => object) =>
  (el: HTMLElement) =>
    el.tagName === type
      ? returnFunc
        ? { type, ...returnFunc(el) }
        : true
      : false
