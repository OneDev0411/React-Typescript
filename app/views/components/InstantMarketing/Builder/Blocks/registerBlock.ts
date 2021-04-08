import { Editor } from 'grapesjs'

import { BlockOptions, TemplateBlock } from './types'

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
  templateBlock?: TemplateBlock
): void {
  const document = domParser.parseFromString(
    templateBlock?.template || template,
    'text/html'
  )
  const { tagName } = document.body.children[0]

  const elementName =
    templateBlock?.adaptive || adaptive
      ? 'mj-adaptive'
      : tagName === 'IFRAME'
      ? 'DIV'
      : tagName

  editor.BlockManager.add(blockName, {
    category: templateBlock?.category || category,
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
