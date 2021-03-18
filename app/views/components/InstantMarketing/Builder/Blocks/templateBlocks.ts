import type { Editor } from 'grapesjs'

import { TemplateBlock, TemplateBlocks, TemplateBlockContent } from './types'

import { isComponent as isComponentWebsite } from './Website/utils'
import { isComponent as isComponentEmail } from './Email/utils'

import registerBlock from './registerBlock'

async function getTemplateBlockContent(
  templateBlock: TemplateBlockContent,
  templateUrl: string
) {
  const response = await fetch(
    `${templateUrl}/blocks/${templateBlock.category}/${templateBlock.name}.html`
  )

  if (response.status === 404) {
    return null
  }

  const template = await response.text()

  return template
}

export async function getTemplateBlocks(
  templateUrl: string
): Promise<Record<string, TemplateBlock>> {
  const response = await fetch(`${templateUrl}/blocks.json`)

  try {
    const templateBlocks = (await response.json()) as TemplateBlockContent[]

    const templateBlocks1 = await Promise.all(
      templateBlocks.map(
        async templateBlock =>
          ({
            ...templateBlock,
            icon: `${templateUrl}/${templateBlock.icon}`,
            template:
              (await getTemplateBlockContent(templateBlock, templateUrl)) ?? ''
          } as TemplateBlock)
      )
    )

    return templateBlocks1
      .filter(templateBlock => !!templateBlock.template)
      .reduce(
        (acc, templateBlock: TemplateBlock) => ({
          ...acc,
          [templateBlock.name]: templateBlock
        }),
        {}
      )
  } catch (e) {}

  return {}
}

export function registerTemplateBlocks(
  editor: Editor,
  type: string,
  registeredBlocks: Record<string, string>,
  templateBlocks: TemplateBlocks
) {
  return Object.keys(templateBlocks)
    .filter(
      blockName =>
        templateBlocks[blockName].type === type &&
        registeredBlocks[blockName] === undefined
    )
    .reduce((templates, blockName) => {
      editor.DomComponents.addType(blockName, {
        isComponent: el =>
          isComponentEmail(blockName)(el) || isComponentWebsite(blockName)(el)
      })

      const templateBlock = templateBlocks[blockName]

      registerBlock(editor, {
        blockName,
        icon: templateBlock.icon,
        label: templateBlock.label,
        category: templateBlock.category,
        template: templateBlock.template,
        adaptive: templateBlock.adaptive
      })

      return {
        ...templates,
        [blockName]: templateBlocks[blockName].template
      }
    }, registeredBlocks)
}
