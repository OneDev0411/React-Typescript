import { Editor } from 'grapesjs'
import { Model } from 'backbone'

import { Video } from 'components/VideoDrawer/types'

import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'

import registerBlock from '../../registerBlock'
import { BASICS_BLOCK_CATEGORY } from '../../../constants'
import { TemplateRenderData } from '../../../utils/get-template-render-data'

import { baseView, handleBlockDragStopEvent, isComponent } from '../utils'
import template from './template.njk'

const typeVideoLink = 'video-link'
const typeVideoThumbnail = 'video-thumbnail'
const blockName = typeVideoLink

export interface VideoBlockOptions {
  videoLinkClassNames?: string
  videoThumbnailClassNames?: string
  videoLinkBlock?: string
  onVideoDrop: (model: Model) => void
}

interface VideoBlock {
  selectHandler: (selectedVideo?: Video) => void
}

export default function registerVideoBlock(
  editor: Editor,
  renderData: TemplateRenderData,
  {
    videoLinkClassNames,
    videoThumbnailClassNames,
    videoLinkBlock,
    onVideoDrop
  }: VideoBlockOptions
): VideoBlock {
  editor.DomComponents.addType(typeVideoLink, {
    isComponent: isComponent(typeVideoLink),
    model: {
      defaults: {
        name: 'Video',
        droppable: false
      }
    },
    view: { ...baseView(videoLinkClassNames) }
  })

  editor.DomComponents.addType(typeVideoThumbnail, {
    isComponent: isComponent(typeVideoThumbnail),
    model: {
      defaults: {
        selectable: false,
        hoverable: false,
        layerable: false,
        droppable: false,
        draggable: false
      }
    },
    view: { ...baseView(videoThumbnailClassNames) }
  })

  registerBlock(editor, {
    label: 'Video',
    icon: VideoIcon,
    category: BASICS_BLOCK_CATEGORY,
    blockName,
    template
  })

  return handleBlockDragStopEvent(
    editor,
    {
      [blockName]: videoLinkBlock || template
    },
    (selectedVideo: Video) => ({
      ...renderData,
      url: selectedVideo.url,
      image: selectedVideo.thumbnail
    }),
    onVideoDrop
  )
}
