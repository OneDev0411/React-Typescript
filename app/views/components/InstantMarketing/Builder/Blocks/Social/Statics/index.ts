import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Text from './text.html'
import { TemplateBlocks } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { registerTemplateBlocks } from '../../templateBlocks'

export const textBlockName = 'rechat-text'

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks
): void {
  const staticBlocks = {
    [textBlockName]: templateBlocks[textBlockName]?.template || Text
  }

  registerBlock(
    editor,
    {
      label: 'Text',
      category: BASICS_BLOCK_CATEGORY,
      blockName: textBlockName,
      template: staticBlocks[textBlockName]
    },
    templateBlocks[textBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    staticBlocks,
    templateBlocks
  )

  handleBlockDragStopEvent(editor, allBlocks, renderData)
}
