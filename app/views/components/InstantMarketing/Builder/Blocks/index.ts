import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlocks, { Options as AgentOptions } from './Agents'
import registerStaticBlocks from './Statics'
import registerGifBlock, { Options as GifOptions } from './Gif'
import { reorderBlocksWithCustomLabels, collapseBlockCategories } from './utils'
import { BlockOptions } from './types'

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  gif: GifOptions
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent, gif }: Options
) {
  registerStaticBlocks(editor, renderData)

  const dynamicBlocks = {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    gif: registerGifBlock(editor, gif)
  }

  reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
