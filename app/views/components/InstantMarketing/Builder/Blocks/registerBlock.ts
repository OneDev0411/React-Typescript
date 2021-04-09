import { Editor } from 'grapesjs'

import { BlockOptions, TemplateBlockOptions } from './types'
import { isDefaultBlocksDisabled } from './utils'

const domParser = new DOMParser()

export function registerBlock(
  editor: Editor,
  {
    label,
    category,
    blockName,
    template,
    icon,
    adaptive = false
  }: BlockOptions,
  templateBlockOptions?: TemplateBlockOptions
): void {
  const templateBlock = templateBlockOptions?.blocks[blockName]
  const blockCategory = templateBlock?.category || category

  if (
    templateBlockOptions &&
    isDefaultBlocksDisabled(templateBlockOptions, blockCategory)
  ) {
    return
  }

  // I don't use templateBlock?.template || template because there is
  // a similar logic on the block file
  const document = domParser.parseFromString(template, 'text/html')
  const { tagName } = document.body.children[0]

  const elementName =
    templateBlock?.adaptive || adaptive
      ? 'mj-adaptive'
      : tagName === 'IFRAME'
      ? 'DIV'
      : tagName

  editor.BlockManager.add(blockName, {
    category: blockCategory,
    label:
      templateBlock?.icon || icon
        ? `<div style="background-image:url(${templateBlock?.icon || icon});">${
            templateBlock?.label || label
          }</div>`
        : label,
    content: `<${elementName} data-block="${blockName}"></${elementName}>`
  })
}

export default registerBlock
