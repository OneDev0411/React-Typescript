import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlocks, { Options as AgentOptions } from './Agents'
import registerStaticBlocks from './Statics'
import registerImageBlock, { Options as ImageOptions } from './Image'
import registerGifBlock, { Options as GifOptions } from './Gif'
import registerVideoBlock, { Options as VideoOptions } from './Video'
import { reorderBlocksWithCustomLabels, collapseBlockCategories } from './utils'
import { BlockOptions } from './types'

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
  image: ImageOptions
  gif: GifOptions
  video: VideoOptions
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent, image, gif, video }: Options
) {
  registerStaticBlocks(editor, renderData)

  const dynamicBlocks = {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlocks(editor, renderData, agent),
    image: registerImageBlock(editor, image),
    gif: registerGifBlock(editor, gif),
    video: registerVideoBlock(editor, renderData, video)
  }

  reorderBlocksWithCustomLabels(editor)
  collapseBlockCategories(editor)

  return dynamicBlocks
}
