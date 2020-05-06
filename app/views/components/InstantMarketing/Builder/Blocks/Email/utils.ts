import { Editor } from 'grapesjs'

// Basic
import GifIcon from 'assets/images/marketing/editor/blocks/gif.png'
import VideoIcon from 'assets/images/marketing/editor/blocks/video.png'
import OneColIcon from 'assets/images/marketing/editor/blocks/col-1.png'
import TwoColIcon from 'assets/images/marketing/editor/blocks/col-2.png'
import ThreeColIcon from 'assets/images/marketing/editor/blocks/col-3.png'
import Headline1Icon from 'assets/images/marketing/editor/blocks/h1.png'
import Headline2Icon from 'assets/images/marketing/editor/blocks/h2.png'
import TextIcon from 'assets/images/marketing/editor/blocks/text.png'
import DividerIcon from 'assets/images/marketing/editor/blocks/divider.png'
import SpacerIcon from 'assets/images/marketing/editor/blocks/spacer.png'
import ImageIcon from 'assets/images/marketing/editor/blocks/image.png'
import PhotoGifIcon from 'assets/images/marketing/editor/blocks/photo-gif.png'
import ButtonIcon from 'assets/images/marketing/editor/blocks/button.png'
import ShareIcon from 'assets/images/marketing/editor/blocks/share.png'

// Article & Listing
import ArticleImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ArticleImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ArticleImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'

// Agent
import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'
import AgentMultiIcon from 'assets/images/marketing/editor/blocks/multi-agent.png'

// Market Reports
import NeighborhoodsIcon from 'assets/images/marketing/editor/blocks/neighborhoods.png'
import NeighborhoodsGraphsIcon from 'assets/images/marketing/editor/blocks/neighborhoods-graphs.png'

// Common
import DualIcon from 'assets/images/marketing/editor/blocks/dual.png'

import {
  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Article/constants'
import {
  listingTopBlockName,
  listingGridBlockName,
  listingGridTwoBlockName,
  listingLeftBlockName,
  listingRightBlockName
} from './Listings'

import {
  headline1BlockName,
  dividerBlockName,
  spacerBlockName
} from './Statics'
import { headline2BlockName } from './Statics'
import {
  agentLeftBlockName,
  agentGridBlockName,
  agentMultiBlockName
} from './Agents'
import { blockName as rechatImageBlockName } from './Image'
import {
  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
} from './Neighborhoods'

const BLOCK_IDS_TO_REMOVE = [
  'mj-button',
  'mj-image',
  'mj-social-group',
  'mj-social-element',
  'mj-navbar',
  'mj-navbar-link',
  'mj-1-column',
  'mj-2-columns',
  'mj-3-columns',
  'mj-text',
  'mj-divider',
  'mj-spacer',
  'mj-carousel',
  'mj-carousel-image',
  'mj-hero'
]

const BLOCK_BUTTON_ICONS = {
  'rechat-gif': GifIcon,
  'rechat-video': VideoIcon,
  [rechatImageBlockName]: ImageIcon,
  'column-1': OneColIcon,
  'column-2': TwoColIcon,
  'column-3': ThreeColIcon,
  [headline1BlockName]: Headline1Icon,
  [headline2BlockName]: Headline2Icon,
  text: TextIcon,
  [dividerBlockName]: DividerIcon,
  [spacerBlockName]: SpacerIcon,
  'mj-image': PhotoGifIcon,
  'mj-button': ButtonIcon,
  'mj-social-group': ShareIcon,

  [articleTopBlockName]: ArticleImageTopIcon,
  [articleLeftBlockName]: ArticleImageLeftIcon,
  [articleRightBlockName]: ArticleImageRightIcon,

  [listingTopBlockName]: ArticleImageTopIcon,
  [listingGridBlockName]: DualIcon,
  [listingGridTwoBlockName]: DualIcon,
  [listingLeftBlockName]: ArticleImageLeftIcon,
  [listingRightBlockName]: ArticleImageRightIcon,

  [agentLeftBlockName]: AgentLeftIcon,
  [agentGridBlockName]: DualIcon,
  [agentMultiBlockName]: AgentMultiIcon,
  [neighborhoodsBlockName]: NeighborhoodsIcon,
  [neighborhoodsGraphsBlockName]: NeighborhoodsGraphsIcon
}

const BLOCK_BUTTONS_ORDER = [
  'rechat-gif',
  'rechat-video',
  rechatImageBlockName,
  'mj-image',
  'column-1',
  'column-2',
  'column-3',
  headline1BlockName,
  headline2BlockName,
  'text',
  dividerBlockName,
  spacerBlockName,
  'mj-button',
  'mj-social-group',

  articleTopBlockName,
  articleLeftBlockName,
  articleRightBlockName,

  listingTopBlockName,
  listingGridBlockName,
  listingGridTwoBlockName,
  listingLeftBlockName,
  listingRightBlockName,

  agentLeftBlockName,
  agentGridBlockName,
  agentMultiBlockName,

  neighborhoodsBlockName,
  neighborhoodsGraphsBlockName
]

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function reorderBlocksWithCustomLabels(editor: Editor) {
  BLOCK_BUTTONS_ORDER.forEach(blockName => {
    const icon = BLOCK_BUTTON_ICONS[blockName]

    if (!icon) {
      return
    }

    const oldBlock = editor.BlockManager.get(blockName) as any

    if (!oldBlock) {
      return
    }

    const newBlock = oldBlock.set({
      label: `<div style="background-image:url(${icon});">${oldBlock.get(
        'label'
      )}</div>`,
      attributes: {
        class: ''
      }
    })

    editor.BlockManager.remove(blockName)
    editor.BlockManager.add(blockName, newBlock)
  })
}

export function collapseBlockCategories(editor: Editor) {
  const categories = editor.BlockManager.getCategories() as any

  categories.each((category: any) => {
    category.set('open', false).on('change:open', (opened: any) => {
      opened.get('open') &&
        categories.each((category: any) => {
          category !== opened && category.set('open', false)
        })
    })
  })
}
