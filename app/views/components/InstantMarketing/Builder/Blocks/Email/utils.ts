import type { Editor } from 'grapesjs'

import adapt from '../adapt'

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
  templates: Record<string, string>
): (parent: HTMLElement | null) => Record<string, string> {
  return (parent: HTMLElement | null) =>
    parent
      ? Object.keys(templates).reduce(
          (newTemplates, key) => ({
            ...newTemplates,
            [key]: adapt(parent, templates[key])
          }),
          {}
        )
      : templates
}
