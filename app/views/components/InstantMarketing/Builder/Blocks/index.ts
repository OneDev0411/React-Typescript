import { Editor } from 'grapesjs'

import { TemplateRenderData } from '../utils/get-template-render-data/index'

import registerListingBlocks, { Options as ListingOptions } from './Listings'
import registerAgentBlock, { Options as AgentOptions } from './Agent'
import registerStaticBlocks from './Statics'
import registerBasicBlocks from './Basics'
import { BlockOptions } from './types'

const BLOCK_IDS_TO_REMOVE = [
  'mj-social-group',
  'mj-social-element',
  'mj-navbar',
  'mj-navbar-link'
]

interface Options {
  listing: ListingOptions
  agent: AgentOptions & BlockOptions
}

export function removeUnusedBlocks(editor: Editor) {
  BLOCK_IDS_TO_REMOVE.forEach(editor.BlockManager.remove)
}

export function registerCustomBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing, agent }: Options
) {
  registerBasicBlocks(editor)
  registerStaticBlocks(editor, renderData)

  return {
    listing: registerListingBlocks(editor, renderData, listing),
    agent: registerAgentBlock(editor, renderData, agent)
  }
}
