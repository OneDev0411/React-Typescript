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
import { TemplateBlockOptions } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeImage = 'image'
const typeImageBg = 'image-bg'
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
  templateBlockOptions: TemplateBlockOptions,
  { imageClassNames, onImageDrop }: ImageBlockOptions
): ImageBlock {
  const resizable = {
    tl: 0,
    tr: 0,
    bl: 0,
    br: 0,
    cl: 0,
    cr: 0
  }

  editor.DomComponents.addType(typeImage, {
    isComponent: isComponent(typeImage),
    extend: 'image',
    extendView: 'image',
    model: {
      defaults: {
        resizable,
        name: 'Image'
      }
    },
    view: { ...baseView(imageClassNames) }
  })

  editor.DomComponents.addType(typeImageBg, {
    isComponent: isComponent(typeImageBg),
    model: {
      defaults: {
        resizable
      }
    },
    view: { ...baseView(imageClassNames) }
  })

  const imageBlocks = {
    [imageBlockName]:
      templateBlockOptions.blocks[imageBlockName]?.template || template
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
    allBlocks,
    (selectedImage: Image) => ({
      ...renderData,
      image: selectedImage
    }),
    onImageDrop
  )
}
