import { Editor } from 'grapesjs'

// Basic
import GifIcon from 'assets/images/marketing/editor/blocks/gif.png'
import OneColIcon from 'assets/images/marketing/editor/blocks/col-1.png'
import TwoColIcon from 'assets/images/marketing/editor/blocks/col-2.png'
import ThreeColIcon from 'assets/images/marketing/editor/blocks/col-3.png'
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
import AgentSingleIcon from 'assets/images/marketing/editor/blocks/agent-single.png'

import {
  articleTopBlockName,
  articleDualBlockName,
  articleLeftBlockName,
  articleRightBlockName
} from './Statics'
import {
  listingTopBlockName,
  listingLeftBlockName,
  listingRightBlockName
} from './Listings'
import { agentSingleBlockName } from './Agents'

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
  'mj-1-column': OneColIcon,
  'mj-2-columns': TwoColIcon,
  'mj-3-columns': ThreeColIcon,
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
  [listingLeftBlockName]: ArticleImageLeftIcon,
  [listingRightBlockName]: ArticleImageRightIcon,

  [agentSingleBlockName]: AgentSingleIcon
}

const BLOCK_BUTTONS_ORDER = [
  'rechat-gif',
  'mj-1-column',
  'mj-2-columns',
  'mj-3-columns',
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
  listingLeftBlockName,
  listingRightBlockName,

  agentSingleBlockName
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
