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
  { onDrop }: Options
): ImageBlock {
  registerBlock(editor, {
    label: 'Image/GIF',
    icon: ImageIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template,
    adaptive: true
  })

  return handleBlockDragStopEvent(
    editor,
    adaptTemplates({
      [blockName]: template
    }),
    (selectedImageUrl: Image) => ({
      ...renderData,
      image: selectedImageUrl
    }),
    onDrop
  )
}
