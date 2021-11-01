import { Editor } from 'grapesjs'

import SenderLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'

import { PLACEHOLDER_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import SenderLeft from './sender-left.mjml'

export const senderLeftBlockName = 'sender-left'

export interface PlaceholderOptions {
  hasSenderBlocks: boolean
}

export default function registerPlaceholderBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { hasSenderBlocks }: PlaceholderOptions
): void {
  const placeholderBlocks = {
    [senderLeftBlockName]:
      templateBlockOptions.blocks[senderLeftBlockName]?.template || SenderLeft
  }

  if (hasSenderBlocks) {
    registerBlock(
      editor,
      {
        label: 'Sender Left',
        icon: SenderLeftIcon,
        category: PLACEHOLDER_BLOCK_CATEGORY,
        blockName: senderLeftBlockName,
        template: placeholderBlocks[senderLeftBlockName],
        adaptive: true
      },
      templateBlockOptions
    )
  }

  const allBlocks = registerTemplateBlocks(
    editor,
    'Placeholders',
    placeholderBlocks,
    templateBlockOptions.blocks
  )

  handleBlockDragStopEvent(editor, allBlocks, renderData)
}
