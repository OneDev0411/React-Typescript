import { Editor } from 'grapesjs'

import registerListingBlock, { Options as ListingOptions } from './Listing'
import { TemplateRenderData } from '../utils/get-template-render-data/index'

const BLOCK_IDS_TO_REMOVE = ['mj-social-element', 'mj-navbar', 'mj-navbar-link']

interface Options {
  listing: ListingOptions
}

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing }: Options
) {
  return {
    listing: registerListingBlock(editor, renderData, listing)
  }
}
