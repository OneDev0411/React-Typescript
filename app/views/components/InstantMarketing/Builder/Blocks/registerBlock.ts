import { Editor } from 'grapesjs'

import { BlockOptions } from './types'

const domParser = new DOMParser()

function registerBlock(
  editor: Editor,
  { label, category, blockName, template, icon, adaptive = false }: BlockOptions
): void {
  const document = domParser.parseFromString(template, 'text/html')
  const { tagName } = document.body.children[0]

  const elementName = adaptive ? 'mj-adaptive' : tagName

  editor.BlockManager.add(blockName, {
    category,
    label: icon
      ? `<div style="background-image:url(${icon});">${label}</div>`
      : label,
    content: `<${elementName} data-block="${blockName}"></${elementName}>`
  })
}

export default registerBlock
