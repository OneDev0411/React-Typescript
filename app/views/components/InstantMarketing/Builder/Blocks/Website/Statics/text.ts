import { Editor } from 'grapesjs'

import TextIcon from 'assets/images/marketing/editor/blocks/text.png'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import { baseView, isComponent } from '../utils'
import Text from './text.njk'
import registerBlock from '../../registerBlock'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeText = 'text'
export const textBlockName = typeText

export interface TextBlockOptions {
  textClassNames?: string
}

export default function registerTextBlock(
  editor: Editor,
  templateBlocks: TemplateBlocks,
  { textClassNames }: TextBlockOptions
) {
  editor.DomComponents.addType(typeText, {
    isComponent: isComponent(typeText),
    view: { ...baseView(textClassNames) }
  })

  const textBlocks = {
    [textBlockName]: templateBlocks[textBlockName]?.template || Text
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
    templateBlocks[textBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    textBlocks,
    templateBlocks
  )

  return allBlocks
}
