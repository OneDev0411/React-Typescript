import { Editor } from 'grapesjs'

import { BlockOptions } from './types'

const domParser = new DOMParser()

function registerBlock(
  editor: Editor,
  { label, category, blockName, template }: BlockOptions
): void {
  const root = domParser.parseFromString(template, 'text/xml')
  const tagName = root.children[0].tagName

  editor.BlockManager.add(blockName, {
    category,
    label,
    content: `<${tagName} data-block="${blockName}"></${tagName}>`
  })
}

export default registerBlock
