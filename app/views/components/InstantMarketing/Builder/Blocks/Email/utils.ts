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
import ButtonIcon from 'assets/images/marketing/editor/blocks/button.png'
import ShareIcon from 'assets/images/marketing/editor/blocks/share.png'

// Article & Listing
import ArticleImageTopIcon from 'assets/images/marketing/editor/blocks/image-top.png'
import ArticleImageDualIcon from 'assets/images/marketing/editor/blocks/dual.png'
import ArticleImageLeftIcon from 'assets/images/marketing/editor/blocks/image-left.png'
import ArticleImageRightIcon from 'assets/images/marketing/editor/blocks/image-right.png'

// Agent
import AgentLeftIcon from 'assets/images/marketing/editor/blocks/agent-left.png'

import {
  articleTopBlockName,
  articleDualBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Statics'
import {
  listingTopBlockName,
  listingGridBlockName,
  listingLeftBlockName,
  listingRightBlockName
} from './Listings'

import { headline1BlockName } from './Statics'
import { headline2BlockName } from './Statics'
import { agentLeftBlockName } from './Agents'
import { blockName as rechatImageBlockName } from './Image'

const BLOCK_IDS_TO_REMOVE = [
  'mj-button',
  'mj-image',
  'mj-social-group',
  'mj-social-element',
  'mj-navbar',
  'mj-navbar-link'
]

const BLOCK_BUTTON_ICONS = {
  'rechat-gif': GifIcon,
  'rechat-video': VideoIcon,
  [rechatImageBlockName]: ImageIcon,
  'mj-1-column': OneColIcon,
  'mj-2-columns': TwoColIcon,
  'mj-3-columns': ThreeColIcon,
  [headline1BlockName]: Headline1Icon,
  [headline2BlockName]: Headline2Icon,
  'mj-text': TextIcon,
  'mj-divider': DividerIcon,
  'mj-spacer': SpacerIcon,
  'mj-image': ImageIcon,
  'mj-button': ButtonIcon,
  'mj-social-group': ShareIcon,
  'mj-social-element': ShareIcon,

  [articleTopBlockName]: ArticleImageTopIcon,
  [articleDualBlockName]: ArticleImageDualIcon,
  [articleLeftBlockName]: ArticleImageLeftIcon,
  [articleRightBlockName]: ArticleImageRightIcon,

  [listingTopBlockName]: ArticleImageTopIcon,
  [listingGridBlockName]: ArticleImageDualIcon,
  [listingLeftBlockName]: ArticleImageLeftIcon,
  [listingRightBlockName]: ArticleImageRightIcon,

  [agentLeftBlockName]: AgentLeftIcon
}

const BLOCK_BUTTONS_ORDER = [
  'rechat-gif',
  'rechat-video',
  rechatImageBlockName,
  'mj-1-column',
  'mj-2-columns',
  'mj-3-columns',
  headline1BlockName,
  headline2BlockName,
  'mj-text',
  'mj-divider',
  'mj-spacer',
  'mj-image',
  'mj-button',
  'mj-social-group',
  'mj-social-element',

  articleTopBlockName,
  articleDualBlockName,
  articleLeftBlockName,
  articleRightBlockName,

  listingTopBlockName,
  listingGridBlockName,
  listingLeftBlockName,
  listingRightBlockName,

  agentLeftBlockName
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
