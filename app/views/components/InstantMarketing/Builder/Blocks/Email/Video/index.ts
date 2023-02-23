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
import { isComponent } from '../../Website/utils'

import template from './template.mjml'

const blockName = 'rechat-video'
const componentName = 'mj-video'

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
  editor.DomComponents.addType(componentName, {
    isComponent: isComponent(componentName),
    extend: 'mj-image'
  })

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
      adaptive: true,
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
      image: selectedVideo.thumbnailWithPlayIcon
    }),
    onDrop
  )
}
