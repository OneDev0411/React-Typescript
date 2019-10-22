import { Editor } from 'grapesjs'

import registerListingBlock, { Options as ListingOptions } from './Listing'
import { TemplateRenderData } from '../utils/get-template-render-data/index'

interface Options {
  listing: ListingOptions
}

export default function registerBlocks(
  editor: Editor,
  renderData: TemplateRenderData,
  { listing }: Options
) {
  return {
    listing: registerListingBlock(editor, renderData, listing)
  }
}
