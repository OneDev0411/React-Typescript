import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlocks, { Options as AgentOptions } from './Agents'
import registerStaticBlocks from './Statics'
import registerGifBlock, { Options as GifOptions } from './Gif'
import { BlockOptions } from './types'

const BLOCK_IDS_TO_REMOVE = [
  'mj-button',
  'mj-image',
  'mj-social-group',
  'mj-social-element',
  'mj-navbar',
  'mj-navbar-link'
]

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  gif: GifOptions
}

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent, gif }: Options
) {
  registerStaticBlocks(editor, renderData)

  return {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    gif: registerGifBlock(editor, gif)
  }
}
