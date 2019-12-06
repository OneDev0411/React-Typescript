import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Image } from 'components/ImageDrawer/types'

import registerBlock from '../../registerBlock'
import adapt from '../../adapt'
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
    label: 'Image Library',
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template,
    adaptive: true
  })

  let modelHandle: any

  const selectHandler = (selectedImage?: Image) => {
    if (!modelHandle) {
      return
    }

    const parent = modelHandle.parent()

    if (selectedImage) {
      const mjml = nunjucks.renderString(adapt(parent, template), {
        image: selectedImage.url
      })

      parent.append(mjml, { at: modelHandle.opt.at })
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
