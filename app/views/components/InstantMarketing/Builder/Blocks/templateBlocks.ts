import type { Editor } from 'grapesjs'

import {
  TemplateBlock,
  TemplateBlocks,
  TemplateBlockBase,
  TemplateOptions,
  TemplateBlockOptions
} from './types'

import { isComponent as isComponentWebsite } from './Website/utils'
import { isComponent as isComponentEmail } from './Email/utils'

import registerBlock from './registerBlock'

export async function getTemplateOptions(
  template: IMarketingTemplate
): Promise<Nullable<TemplateOptions>> {
  try {
    const response = await fetch(`${template.url}/blocks.json`)

    if (response.status >= 400) {
      return null
    }

    return response.json()
  } catch (e) {
    return null
  }
}

async function getTemplateBlockBase(
  templateBlock: TemplateBlockBase,
  template: IMarketingTemplate
): Promise<Nullable<string>> {
  try {
    const response = await fetch(
      `${template.url}/blocks/${templateBlock.category}/${templateBlock.name}.html`
    )

    if (response.status >= 400) {
      return null
    }

    return response.text()
  } catch (e) {
    return null
  }
}

export async function getTemplateBlockOptions(
  template: IMarketingTemplate,
  templateOptions: Nullable<TemplateOptions>
): Promise<TemplateBlockOptions> {
  if (!templateOptions) {
    return { blocks: {} }
  }

  const templateUrl = template.url

  try {
    const blocksWithTemplate = await Promise.all(
      templateOptions.blocks.map(
        async templateBlock =>
          ({
            ...templateBlock,
            icon: templateBlock.icon
              ? `${templateUrl}/${templateBlock.icon}`
              : '',
            template:
              (await getTemplateBlockBase(templateBlock, template)) ?? ''
          } as TemplateBlock)
      )
    )

    return {
      ...templateOptions,
      blocks: blocksWithTemplate
        .filter(templateBlock => !!templateBlock.template)
        .reduce(
          (acc, templateBlock: TemplateBlock) => ({
            ...acc,
            [templateBlock.name]: templateBlock
          }),
          {}
        )
    }
  } catch (e) {}

  return { blocks: {} }
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
        label: templateBlock.label || '',
        category: templateBlock.category || '',
        template: templateBlock.template || '',
        adaptive: !!templateBlock.adaptive
      })

      return {
        ...templates,
        [blockName]: templateBlocks[blockName].template
      }
    }, registeredBlocks)
}
