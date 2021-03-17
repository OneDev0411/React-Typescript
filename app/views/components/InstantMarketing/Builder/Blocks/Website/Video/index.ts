import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Video } from 'components/VideoDrawer/types'

import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, isComponent } from '../utils'
import { handleBlockDragStopEvent } from '../../utils'
import template from './template.njk'
import { generateEmbedVideoUrl } from './utils'

const typeEmbedVideo = 'embed-video'
export const embedVideoBlockName = typeEmbedVideo

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
  const VideoComponent = editor.DomComponents.getType('video')!
  const VideoModel = VideoComponent.model
  const VideoView = VideoComponent.view

  const isComponentVideo = (el: HTMLElement) => {
    if (isComponent(typeEmbedVideo)(el)) {
      return {
        ...(VideoModel as any).isComponent(el),
        type: typeEmbedVideo
      }
    }
  }

  editor.DomComponents.addType(typeEmbedVideo, {
    model: VideoModel.extend(
      {
        defaults: {
          ...VideoModel.prototype.defaults,
          resizable: {
            tl: 0,
            tr: 0,
            bl: 0,
            br: 0,
            cl: 0,
            cr: 0
          }
        }
      },
      {
        isComponent: isComponentVideo
      }
    ),
    view: VideoView.extend({
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
