import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import nunjucks from 'components/InstantMarketing/helpers/nunjucks'
import { Video } from 'components/VideoDrawer/types'

import registerBlock from '../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../constants'
import { TemplateRenderData } from '../../utils/get-template-render-data'

import template from './template.mjml'

const blockName = 'rechat-video'

export interface Options {
  onDrop: (model: Model) => void
}

interface VideoBlock {
  selectHandler: (selectedVideo?: Video) => void
}

export default function registerVideoBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { onDrop }: Options
): VideoBlock {
  registerBlock(editor, {
    label: 'Video',
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template
  })

  let modelHandle: any

  const selectHandler = (selectedVideo?: Video) => {
    if (!modelHandle) {
      return
    }

    if (selectedVideo) {
      const mjml = nunjucks.renderString(template, {
        ...renderData,
        url: selectedVideo.url,
        image: selectedVideo.thumbnail
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
