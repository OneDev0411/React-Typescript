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
import { TemplateBlocks } from '../../types'
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
  templateBlocks: TemplateBlocks,
  { onDrop }: Options
): ImageBlock {
  const imageBlocks = {
    [blockName]: templateBlocks[blockName]?.template || template
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
    templateBlocks[blockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Image',
    imageBlocks,
    templateBlocks
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
