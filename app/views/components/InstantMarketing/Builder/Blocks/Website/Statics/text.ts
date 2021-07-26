import { Editor } from 'grapesjs'

import TextIcon from 'assets/images/marketing/editor/blocks/text.png'
import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions } from '../../types'
import { baseView, isComponent } from '../utils'

import Text from './text.njk'

const typeText = 'text'
export const textBlockName = typeText

export interface TextBlockOptions {
  textClassNames?: string
}

export default function registerTextBlock(
  editor: Editor,
  templateBlockOptions: TemplateBlockOptions,
  { textClassNames }: TextBlockOptions
) {
  editor.DomComponents.addType(typeText, {
    isComponent: isComponent(typeText),
    view: { ...baseView(textClassNames) }
  })

  const textBlocks = {
    [textBlockName]:
      templateBlockOptions.blocks[textBlockName]?.template || Text
  }

  registerBlock(
    editor,
    {
      label: 'Text',
      icon: TextIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: textBlockName,
      template: textBlocks[textBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    textBlocks,
    templateBlockOptions.blocks
  )

  return allBlocks
}
