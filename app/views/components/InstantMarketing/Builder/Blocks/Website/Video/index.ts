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

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="80" viewBox="0 0 24 24" style="fill: rgba(0,0,0,0.15); transform: scale(0.75); margin: 0 auto"'

const svgIcon = `<svg ${svgAttrs}>
  <path d="M9 9l7.5 5.25-7.5 5.25v-10.5z"></path>
  <path d="M21.511 5.369c-0.521-0.71-1.246-1.54-2.043-2.337s-1.627-1.523-2.337-2.043c-1.209-0.886-1.795-0.989-2.131-0.989h-11.625c-1.034 0-1.875 0.841-1.875 1.875v20.25c0 1.034 0.841 1.875 1.875 1.875h17.25c1.034 0 1.875-0.841 1.875-1.875v-14.625c0-0.336-0.102-0.922-0.989-2.131zM18.407 4.093c0.72 0.72 1.284 1.369 1.701 1.907h-3.608v-3.608c0.539 0.417 1.188 0.982 1.907 1.701zM21 22.125c0 0.203-0.172 0.375-0.375 0.375h-17.25c-0.203 0-0.375-0.172-0.375-0.375v-20.25c0-0.203 0.172-0.375 0.375-0.375 0 0 11.624-0 11.625 0v5.25c0 0.414 0.336 0.75 0.75 0.75h5.25v14.625z"></path>
</svg>`

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
          },
          src: svgIcon,
          fallback: svgIcon
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
