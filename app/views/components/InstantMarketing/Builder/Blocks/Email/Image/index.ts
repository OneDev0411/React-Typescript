import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Image } from 'components/ImageDrawer/types'

import ImageIcon from 'assets/images/marketing/editor/blocks/image.png'

import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import template from './template.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { adaptTemplates } from '../utils'
import { TemplateBlockOptions } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

export const blockName = 'rechat-image'

export interface Options {
  onDrop: (model: Model) => void
}

interface ImageBlock {
  selectHandler: (selectedImageUrl?: Image) => void
}

export default function registerImageBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): ImageBlock {
  const imageBlocks = {
    [blockName]: templateBlockOptions.blocks[blockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Image/GIF',
      icon: ImageIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName,
      template,
      adaptive: true
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Image',
    imageBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent(
    editor,
    adaptTemplates(allBlocks),
    (selectedImageUrl: Image) => ({
      ...renderData,
      image: selectedImageUrl
    }),
    onDrop
  )
}
