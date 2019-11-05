import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Image } from 'components/ImageDrawer/types'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'

import template from './template.mjml'

export const blockName = 'rechat-image'

export interface Options {
  onDrop: (model: Model) => void
}

interface ImageBlock {
  selectHandler: (selectedImage?: Image) => void
}

export default function registerImageBlock(
  editor: Editor,
  { onDrop }: Options
): ImageBlock {
  registerBlock(editor, {
    label: 'Image',
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template
  })

  let modelHandle: any

  const selectHandler = (selectedImage?: Image) => {
    if (!modelHandle) {
      return
    }

    if (selectedImage) {
      const mjml = nunjucks.renderString(template, {
        image: selectedImage.url
      })

      modelHandle.parent().append(mjml, { at: modelHandle.opt.at })
    }

    modelHandle.remove()
  }

  editor.on('block:drag:stop', (model: Model, block: any) => {
    if (!model) {
      return
    }

    if (block.id === blockName) {
      modelHandle = model
      onDrop(model)
    }
  })

  return {
    selectHandler
  }
}
