import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import ImageIcon from 'assets/images/marketing/editor/blocks/image.png'
import { TemplateRenderData } from 'components/InstantMarketing/Builder/utils/get-template-render-data'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import template from './template.mjml'

export const blockName = 'rechat-image'

export interface Options {
  onDrop: (model: Model) => void
}

interface ImageRenderData {
  image: string
}

export default function registerImageBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): RegisterBlockSelectHandler<string> {
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

  return handleBlockDragStopEvent<string, ImageRenderData>(
    editor,
    allBlocks,
    selectedImageUrl => ({
      ...renderData,
      image: selectedImageUrl
    }),
    onDrop
  )
}
