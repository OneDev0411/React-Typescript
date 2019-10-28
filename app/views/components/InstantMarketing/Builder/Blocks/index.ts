import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlocks, { Options as AgentOptions } from './Agents'
import registerStaticBlocks from './Statics'
import registerGifBlock, { Options as GifOptions } from './Gif'
import registerVideoBlock, { Options as VideoOptions } from './Video'
import { reorderBlocksWithCustomLabels, collapseBlockCategories } from './utils'
import { BlockOptions } from './types'

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  gif: GifOptions
  video: VideoOptions
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent, gif, video }: Options
) {
  registerStaticBlocks(editor, renderData)

  const dynamicBlocks = {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    gif: registerGifBlock(editor, gif),
    video: registerVideoBlock(editor, renderData, video)
  }

  reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
