import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Image } from 'components/ImageDrawer/types'

import ImageIcon from 'assets/images/marketing/editor/blocks/image.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'

const typeImage = 'image'
const blockName = typeImage

export interface ImageBlockOptions {
  imageClassNames?: string
  imageBlock?: string
  onImageDrop: (model: Model) => void
}

interface ImageBlock {
  selectHandler: (selectedImage?: Image) => void
}

export default function registerImageBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { imageClassNames, imageBlock, onImageDrop }: ImageBlockOptions
): ImageBlock {
  editor.DomComponents.addType(typeImage, {
    isComponent: isComponent(typeImage),
    extend: 'image',
    extendView: 'image',
    model: {
      defaults: {
        name: 'Image',
        style: {
          display: 'block',
          width: '100%'
        }
      }
    },
    view: { ...baseView(imageClassNames) }
  })

  const imageBlocks = {
    [blockName]: imageBlock || template
  }

  registerBlock(editor, {
    label: 'Image/GIF',
    icon: ImageIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template: imageBlocks[blockName]
  })

  return handleBlockDragStopEvent(
    editor,
    imageBlocks,
    (selectedImage: Image) => ({
      ...renderData,
      image: selectedImage
    }),
    onImageDrop
  )
}
