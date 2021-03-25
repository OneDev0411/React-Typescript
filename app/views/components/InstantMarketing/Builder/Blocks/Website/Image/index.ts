import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Image } from 'components/ImageDrawer/types'

import ImageIcon from 'assets/images/marketing/editor/blocks/image.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, isComponent } from '../utils'
import { handleBlockDragStopEvent } from '../../utils'
import template from './template.njk'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeImage = 'image'
export const imageBlockName = typeImage

export interface ImageBlockOptions {
  imageClassNames?: string
  onImageDrop: (model: Model) => void
}

interface ImageBlock {
  selectHandler: (selectedImage?: Image) => void
}

export default function registerImageBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks,
  { imageClassNames, onImageDrop }: ImageBlockOptions
): ImageBlock {
  editor.DomComponents.addType(typeImage, {
    isComponent: isComponent(typeImage),
    extend: 'image',
    extendView: 'image',
    model: {
      defaults: {
        resizable: {
          tl: 0,
          tr: 0,
          bl: 0,
          br: 0,
          cl: 0,
          cr: 0
        },
        name: 'Image'
      }
    },
    view: { ...baseView(imageClassNames) }
  })

  const imageBlocks = {
    [imageBlockName]: templateBlocks[imageBlockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Image/GIF',
      icon: ImageIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: imageBlockName,
      template: imageBlocks[imageBlockName]
    },
    templateBlocks[imageBlockName]
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Image',
    imageBlocks,
    templateBlocks
  )

  return handleBlockDragStopEvent(
    editor,
    allBlocks,
    (selectedImage: Image) => ({
      ...renderData,
      image: selectedImage
    }),
    onImageDrop
  )
}
