import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'

import Text from './text.html'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'
import { registerTemplateBlocks } from '../../templateBlocks'

export const textBlockName = 'rechat-text'

export default function registerStaticBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions
): void {
  const staticBlocks = {
    [textBlockName]:
      templateBlockOptions.blocks[textBlockName]?.template || Text
  }

  registerBlock(
    editor,
    {
      label: 'Text',
      category: BASICS_BLOCK_CATEGORY,
      blockName: textBlockName,
      template: staticBlocks[textBlockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Statics',
    staticBlocks,
    templateBlockOptions.blocks
  )

  handleBlockDragStopEvent(editor, allBlocks, renderData)
}
