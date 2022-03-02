import { Model } from 'backbone'
import { Editor } from 'grapesjs'

import { Video } from '@app/views/components/SearchVideoDrawer/types'
import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'
import registerBlock from '../../registerBlock'
import { registerTemplateBlocks } from '../../templateBlocks'
import { RegisterBlockSelectHandler, TemplateBlockOptions } from '../../types'
import { handleBlockDragStopEvent } from '../../utils'

import { getPaddingValue, PLAY_BUTTON_SIZE } from './helpers'
import template from './template.mjml'

const blockName = 'rechat-video'

interface VideoRenderData {
  url: string
  image: Optional<string>
}

export interface Options {
  onDrop: (model: Model) => void
}

export default function registerVideoBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlockOptions: TemplateBlockOptions,
  { onDrop }: Options
): RegisterBlockSelectHandler<Video> {
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

  return handleBlockDragStopEvent<Video, VideoRenderData>(
    editor,
    allBlocks,
    selectedVideo => ({
      ...renderData,
      url: selectedVideo.url,
      image: selectedVideo.thumbnail,
      padding: selectedVideo.thumbnailAspectRatio
        ? getPaddingValue(selectedVideo.thumbnailAspectRatio)
        : 30, // Default padding value
      playButtonSize: PLAY_BUTTON_SIZE
    }),
    onDrop
  )
}
