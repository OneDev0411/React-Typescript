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
import {
  generateEmbedVideoUrl,
  getVimeoVideoId,
  getYouTubeVideoId
} from './utils'
import { TemplateBlocks } from '../../types'
import { registerTemplateBlocks } from '../../templateBlocks'

const typeEmbedVideo = 'embed-video'
export const embedVideoBlockName = typeEmbedVideo

export interface VideoBlockOptions {
  embedVideoClassNames?: string
  onVideoDrop: (model: Model) => void
  onVideoDoubleClick: (model: Model) => void
  onEmptyVideoClick: (model: Model) => void
}

interface VideoBlock {
  selectHandler: (selectedVideo?: Video) => void
}

export default function registerVideoBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  templateBlocks: TemplateBlocks,
  {
    embedVideoClassNames,
    onVideoDrop,
    onVideoDoubleClick,
    onEmptyVideoClick
  }: VideoBlockOptions
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
        },
        init() {
          this.listenTo(this, 'change:video:info', this.handleChangeVideoInfo)
          this.listenTo(
            this,
            'change:videoId change:provider',
            this.handleSrcUpdate
          )
        },
        handleChangeVideoInfo({ url }) {
          const yt = 'yt'
          const vi = 'vi'
          const ytnc = 'ytnc'
          const so = 'so'

          const src = generateEmbedVideoUrl(url)

          const isYtProv = /youtube\.com\/embed/.test(src)
          const isYtncProv = /youtube-nocookie\.com\/embed/.test(src)
          const isViProv = /player\.vimeo\.com\/video/.test(src)

          this.set({ src }, { silent: true })

          if (isYtProv) {
            this.set({ provider: yt, videoId: getYouTubeVideoId(url) })
          } else if (isYtncProv) {
            this.set({ provider: ytnc, videoId: getYouTubeVideoId(url) })
          } else if (isViProv) {
            this.set({ provider: vi, videoId: getVimeoVideoId(url) })
          } else {
            this.set({ provider: so })
          }

          this.parseFromSrc()
        },
        handleSrcUpdate() {
          this.set('autoplay', 0)
        },
        // Override the updateTraits to prevent displaying the video traits
        updateTraits() {}
      },
      {
        isComponent: isComponentVideo
      }
    ),
    view: VideoView.extend({
      ...baseView(embedVideoClassNames),
      events: {
        click(): void {
          const src: string = this.model.get('src') || ''

          if (src.trim().startsWith('<svg')) {
            onEmptyVideoClick(this.model)
          }
        },
        dblclick() {
          onVideoDoubleClick(this.model)
        }
      }
    })
  })

  const videoBlocks = {
    [embedVideoBlockName]:
      templateBlocks[embedVideoBlockName]?.template || template
  }

  registerBlock(
    editor,
    {
      label: 'Video',
      icon: VideoIcon,
      category: BASICS_BLOCK_CATEGORY,
      blockName: embedVideoBlockName,
      template: videoBlocks[embedVideoBlockName]
    },
    templateBlocks[embedVideoBlockName]
  )

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
      url: generateEmbedVideoUrl(selectedVideo.url)
    }),
    onVideoDrop
  )
}
