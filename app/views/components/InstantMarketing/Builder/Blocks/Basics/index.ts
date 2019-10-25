import { Editor } from 'grapesjs'

import { BASIC_BLOCKS_CATEGORY } from '../../constants'

export default function registerBasicBlocks(editor: Editor, opts: object = {}) {
  editor.BlockManager.add('mj-social-group', {
    label: 'Group Social',
    content: `<mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal">
        <mj-social-element name="facebook"></mj-social-element>
        <mj-social-element name="instagram"></mj-social-element>
        <mj-social-element name="twitter"></mj-social-element>
      </mj-social>`,
    attributes: { class: 'fa fa-share-alt' },
    category: BASIC_BLOCKS_CATEGORY,
    ...opts
  })

  editor.BlockManager.add('mj-social-element', {
    label: 'Group Social Element',
    content: '<mj-social-element name="facebook" />',
    attributes: { class: 'fa fa-share-alt-square' },
    category: BASIC_BLOCKS_CATEGORY,
    ...opts
  })
}
