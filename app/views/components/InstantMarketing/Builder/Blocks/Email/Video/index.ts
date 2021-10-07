import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import { Video } from '@app/views/components/SearchVideoDrawer/types'
import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

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
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): VideoBlock {
  const videoBlocks = {
    [blockName]: templateBlockOptions.blocks[blockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Video',
      icon: VideoIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName,
      template: videoBlocks[blockName]
    },
    templateBlockOptions
  )

  const allBlocks = registerTemplateBlocks(
    editor,
    'Video',
    videoBlocks,
    templateBlockOptions.blocks
  )

  return handleBlockDragStopEvent(
    editor,
    allBlocks,
    (selectedVideo: Video) => ({
      ...renderData,
      url: selectedVideo.url,
      image: selectedVideo.thumbnail
    }),
    onDrop
  )
}
