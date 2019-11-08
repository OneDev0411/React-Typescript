import { Editor } from 'grapesjs'

import { BlockOptions } from './types'

const domParser = new DOMParser()

function registerBlock(
  editor: Editor,
  { label, category, blockName, template }: BlockOptions
): void {
  const document = domParser.parseFromString(template, 'text/html')
  const { tagName } = document.body.children[0]

  editor.BlockManager.add(blockName, {
    category,
    label,
    content: `<${tagName} data-block="${blockName}"></${tagName}>`
  })
}

export default registerBlock
