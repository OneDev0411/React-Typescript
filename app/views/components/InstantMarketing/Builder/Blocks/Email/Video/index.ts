import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Video } from 'components/VideoDrawer/types'

import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import template from './template.mjml'
import { handleBlockDragStopEvent } from '../../utils'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

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
  templateBlocks: TemplateBlocks,
  { onDrop }: Options
): VideoBlock {
  const videoBlocks = {
    [blockName]: templateBlocks[blockName]?.template || template
  }

  registerBlock(editor, {
    label: 'Video',
    icon: VideoIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template: videoBlocks[blockName]
  })

  const allBlocks = registerTemplateBlocks(
    editor,
    'Video',
    videoBlocks,
    templateBlocks
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
