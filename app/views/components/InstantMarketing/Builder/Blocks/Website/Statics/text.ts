import { Editor } from 'grapesjs'

import TextIcon from 'assets/images/marketing/editor/blocks/text.png'

import { BASICS_BLOCK_CATEGORY } from 'components/InstantMarketing/Builder/constants'

import { baseView, isComponent } from '../utils'
import Text from './text.njk'
import registerBlock from '../../registerBlock'

const typeText = 'text'
export const textBlockName = typeText

export interface TextBlockOptions {
  textClassNames?: string
  textBlock?: string
}

export default (
  editor: Editor,
  { textClassNames, textBlock }: TextBlockOptions
) => {
  editor.DomComponents.addType(typeText, {
    isComponent: isComponent(typeText),
    view: { ...baseView(textClassNames) }
  })

  const textBlocks = {
    [textBlockName]: textBlock || Text
  }

  registerBlock(editor, {
    label: 'Text',
    icon: TextIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: textBlockName,
    template: textBlocks[textBlockName]
  })

  return textBlocks
}
