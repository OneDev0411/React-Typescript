import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Video } from 'components/VideoDrawer/types'

import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'
import { generateEmbedVideoUrl } from './utils'

const typeEmbedVideo = 'embed-video'
const embedVideoBlockName = typeEmbedVideo
export interface VideoBlockOptions {
  embedVideoClassNames?: string
  onVideoDrop: (model: Model) => void
}

interface VideoBlock {
  selectHandler: (selectedVideo?: Video) => void
}

export default function registerVideoBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  { embedVideoClassNames, onVideoDrop }: VideoBlockOptions
): VideoBlock {
  const dType = editor.DomComponents.getType('video')!
  const dModel = dType.model
  const dView = dType.view

  editor.DomComponents.addType(typeEmbedVideo, {
    isComponent: isComponent(typeEmbedVideo),
    model: dModel,
    view: (dView as any).extend({
      ...baseView(embedVideoClassNames)
    })
  })

  const videoBlocks = {
    [embedVideoBlockName]: template
  }

  registerBlock(editor, {
    label: 'Video',
    icon: VideoIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName: embedVideoBlockName,
    template: videoBlocks[embedVideoBlockName]
  })

  return handleBlockDragStopEvent(
    editor,
    videoBlocks,
    (selectedVideo: Video) => ({
      ...renderData,
      url: generateEmbedVideoUrl(selectedVideo.url)
    }),
    onVideoDrop
  )
}
